const { ethers } = require("ethers");
const ABI = require("./abi.json");
const MongoClient = require("mongodb").MongoClient;

async function main() {
  // Set up your Ethereum provider and contract information
  const provider = new ethers.providers.JsonRpcProvider(
    "http://localhost:8545"
  );
  const contractAddress = "<ANVIL DEPLOYED CONTRACT ADDRESS>";
  const contractABI = ABI;

  // Create an instance of your contract
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  // MongoDB connection
  const mongoURL = "YOUR_MONGODB_URL";
  const mongoDBName = "YOUR_MONGODB_DATABASE_NAME";
  const mongoCollectionName = "events";

  // Connect to MongoDB
  MongoClient.connect(mongoURL, { useUnifiedTopology: true })
    .then((client) => {
      const db = client.db(mongoDBName);
      const collection = db.collection(mongoCollectionName);

      contract.events
        .BetPending()
        .on("data", (event) => {
          // Handle the event data here
          console.log("BetPending:", event.returnValues);
          // Store the event data in MongoDB
          storeEvent(event.returnValues, collection);
        })
        .on("error", (error) => {
          // Handle any error that occurs while listening to events
          console.error("Error in BetPending:", error);
        });

      contract.events
        .BetActive()
        .on("data", (event) => {
          // Handle the event data here
          console.log("BetActive:", event.returnValues);
          // Store the event data in MongoDB
          storeEvent(event.returnValues, collection);
        })
        .on("error", (error) => {
          // Handle any error that occurs while listening to events
          console.error("Error in BetActive:", error);
        });

      contract.events
        .BetSettled()
        .on("data", (event) => {
          // Handle the event data here
          console.log("BetSettled:", event.returnValues);
          // Store the event data in MongoDB
          storeEvent(event.returnValues, collection);
        })
        .on("error", (error) => {
          // Handle any error that occurs while listening to events
          console.error("Error in BetSettled:", error);
        });
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
    });

  console.log("Listening for events...");
}

function storeEvent(eventData, collection) {
  collection
    .insertOne(eventData)
    .then(() => {
      console.log("Event data stored successfully.");
    })
    .catch((error) => {
      console.error("Error storing event data:", error);
    });
}

main().catch(console.error);
