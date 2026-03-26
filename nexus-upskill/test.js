const { MongoClient } = require("mongodb");
// Replace this with your LONG connection string from Step 2
const uri =
  "mongodb+srv://neelamchaithanya6:Chaithu123@cluster0.yhivgju.mongodb.net/nexus_upskill?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log("Connecting to Atlas...");
    await client.connect();
    console.log("✅ SUCCESS! Your laptop can talk to MongoDB.");
  } catch (e) {
    console.error("❌ STILL FAILING:", e.message);
  } finally {
    await client.close();
  }
}
run();
