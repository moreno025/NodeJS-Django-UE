const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://usuario:1234@curso-mongo-db.ravmwon.mongodb.net/?retryWrites=true&w=majority&appName=Curso-Mongo-DB';
const dbName = 'VideosDB';
const collectionName = 'Video';

async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    return { client, collection };
}

module.exports = { connectToDatabase };