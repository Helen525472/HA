const { MongoClient } = require('mongodb');
const fs = require('fs');

async function importData() {
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db('hackthon');
    const collection = db.collection('employee');
    const data = JSON.parse(fs.readFileSync('employees.json', 'utf8'));
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

importData();
