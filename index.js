// fileName : server.js

import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import { authUser, updateUser } from "./routes/account.js";

const app = express();
const PORT = 3000;

const uri =
  "mongodb+srv://gambit:BarPass77840@nodedb.ieqn0.mongodb.net?retryWrites=true&w=majority&appName=nodeDB";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("\nSuccessfully connected to MongoDB");

  return client.db("users").collection("users");
}

export const database = await run().catch();

app.use(express.json());

app.post("/authUser", authUser);
app.post("/updateUser", updateUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
