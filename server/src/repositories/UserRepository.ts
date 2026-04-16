import User, { IUser } from "../models/User";

export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Find all users
   */
  async findAll(): Promise<IUser[]> {
    return await User.find();
  }

  /**
   * Update user
   */
  async updateById(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete user
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<IUser[]> {
    return await User.find({ role });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });
    return user !== null;
  }
}

export default new UserRepository();
