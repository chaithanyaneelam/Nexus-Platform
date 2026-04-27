/**
 * Utility functions for generating and validating usernames
 */

import { UserRepository } from "../repositories/UserRepository";

/**
 * List of reserved usernames that cannot be used as usernames
 * Includes all API routes, sub-routes, and frontend routes to prevent conflicts
 */
const RESERVED_USERNAMES = new Set([
  // API route prefixes
  "api",
  "auth",
  "users",
  "courses",
  "enrollments",
  "payments",
  "admin",
  "classes",
  "reviews",
  "freelance",

  // Auth routes
  "register",
  "login",
  "signup",
  "profile",
  "google",
  "change-password",

  // Course routes
  "trending",
  "my-courses",
  "teacher",

  // Frontend routes
  "home",
  "dashboard",
  "onboarding",
  "about",
  "contact",
  "privacy",
  "terms",
  "settings",
  "logout",
  "student",
  "google-meet",
  "resume",

  // Common reserved words
  "admin",
  "api",
  "app",
  "bot",
  "root",
  "system",
  "support",
  "help",
  "docs",
  "documentation",
  "blog",
  "news",
  "update",
  "health",
]);

/**
 * Check if a username is reserved
 */
export function isUsernameReserved(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}

/**
 * Generate a unique username from a name
 * Converts name to lowercase, replaces spaces with underscores/hyphens,
 * removes special characters, and ensures uniqueness by appending numbers if needed
 */
export async function generateUniqueUsername(
  name: string,
  userRepository: UserRepository,
): Promise<string> {
  // Convert to lowercase and remove leading/trailing spaces
  let baseUsername = name.toLowerCase().trim();

  // Replace spaces with underscores
  baseUsername = baseUsername.replace(/\s+/g, "_");

  // Remove any characters that aren't lowercase letters, numbers, underscores, or hyphens
  baseUsername = baseUsername.replace(/[^a-z0-9_-]/g, "");

  // Ensure it's between 3-20 characters
  if (baseUsername.length < 3) {
    baseUsername = baseUsername.padEnd(3, "a"); // Pad with 'a' if too short
  }
  if (baseUsername.length > 20) {
    baseUsername = baseUsername.substring(0, 20);
  }

  // Check if username is available and not reserved
  let username = baseUsername;
  let counter = 1;

  // If the base username is reserved, start with a suffix
  if (isUsernameReserved(username)) {
    counter = 1;
  }

  while (
    (await userRepository.findByUsername(username)) ||
    isUsernameReserved(username)
  ) {
    // Username already exists or is reserved, try appending a number
    const suffix = counter.toString();
    const maxLength = 20 - suffix.length - 1; // Reserve space for underscore and number
    const trimmedBase = baseUsername.substring(0, maxLength);
    username = `${trimmedBase}_${suffix}`;
    counter++;

    // Safety check to prevent infinite loop
    if (counter > 999) {
      throw new Error("Could not generate unique username");
    }
  }

  return username;
}

/**
 * Validate username format and check if it's reserved
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-z0-9_-]{3,20}$/;

  // Check format first
  if (!usernameRegex.test(username)) {
    return false;
  }

  // Check if username is reserved
  if (isUsernameReserved(username)) {
    return false;
  }

  return true;
}

/**
 * Generate username from name (simple version without DB lookup)
 * Used when you don't need uniqueness guarantee
 */
export function generateUsernameFromName(name: string): string {
  let username = name.toLowerCase().trim();
  username = username.replace(/\s+/g, "_");
  username = username.replace(/[^a-z0-9_-]/g, "");

  if (username.length < 3) {
    username = username.padEnd(3, "a");
  }
  if (username.length > 20) {
    username = username.substring(0, 20);
  }

  return username;
}
