const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT
const uri = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    //await client.connect();
    const db = client.db("b13-a09-server");
    const appointmentsCollection = db.collection("appointments");
    
    // post oparetion
    app.post('/appointments', async(req, res)=>{
      const appointmentsData = req.body
      const result = await appointmentsCollection.insertOne(appointmentsData)
      res.send(result)
    })

    // get operation
    app.get('/appointments', async(req, res)=>{
      const result = await appointmentsCollection.find().toArray()
      res.send(result)
    })

    app.get('/appointments/:id', async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await appointmentsCollection.findOne(query)
      res.send(result)
    })

    //delete
    app.delete('/appointments/:id', async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await appointmentsCollection.deleteOne(query)
      res.send(result)
    })

    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
  res.send('Server is on the way')
})

app.listen(port, ()=>{
  console.log(`Server is running on port http://localhost:${port}`);
})