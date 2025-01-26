
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://survey:Mindcraft1234@cluster0.zd4mf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Define the database and collection
    const database = client.db("sample_mflix"); // Replace with your database name
    const collection = database.collection("comments"); // Replace with your collection name

    // Query the collection
    const query = {name:'Melissa Jones' }; // Empty object to fetch all documents
    const cursor = collection.find(query);

    // Iterate over and print the documents
    const results = await cursor.toArray(); // Converts the cursor into an array of documents
    if (results.length > 0) {
      console.log("Documents found:");
      results.forEach((doc, index) => {
        console.log(`${index + 1}:`, doc);
      });
    } else {
      console.log("No documents found.");
    }
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

