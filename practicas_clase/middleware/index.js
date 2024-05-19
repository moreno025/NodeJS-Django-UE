const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://usuario:1234@curso-mongo-db.ravmwon.mongodb.net/?retryWrites=true&w=majority&appName=Curso-Mongo-DB";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);