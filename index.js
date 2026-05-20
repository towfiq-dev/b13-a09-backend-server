const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs')
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


// JWT authentication
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)
const verifyToken = async(req, res, next)=>{
  const authHeader = req?.headers.authorization
  if (!authHeader) {
    return res.status(401).json({message: 'Unauthorized'})
  }
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  try{
    const {payload} = await jwtVerify(token, JWKS)
    console.log(payload);
    
    next()
  }catch (error) {
    return res.status(403).json({ message: "Forbidden" })
  }
}

// mongoDB-Connection
async function run() {
  try {
    const db = client.db("b13-a09-server");
    const appointmentsCollection = db.collection("appointments");
    const bookingCollection = db.collection('userBookingInfo')
    
    // post operation
    app.post('/appointments', verifyToken,
      async(req, res)=>{
      const appointmentsData = req.body
      const result = await appointmentsCollection.insertOne(appointmentsData)
      res.send(result)
    })

    app.post('/bookings', verifyToken,
      async(req, res)=>{
      const bookingsData = req.body
      const result = await bookingCollection.insertOne(bookingsData)
      res.send(result)
    })

    // get operation
    app.get('/appointments',
      async(req, res)=>{
      const result = await appointmentsCollection.find().toArray()
      res.send(result)
    })

    app.get('/featured', async(req, res)=>{
      const result = await appointmentsCollection.find().limit(5).toArray()
      res.send(result)
    })

    app.get('/appointments/:id', verifyToken,
      async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await appointmentsCollection.findOne(query)
      res.send(result)
    })

  app.get('/bookings/:userId', verifyToken, 
    async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = { userId: userId }; 
    const result = await bookingCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

    //delete
    app.delete('/appointments/:id', verifyToken,
      async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await appointmentsCollection.deleteOne(query)
      res.send(result)
    })

    app.delete('/bookings/:id', verifyToken,
      async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    //patch
    app.patch('/appointments/:id', verifyToken,
      async(req, res)=>{
    const id = req.params.id
    const query = {
      _id: new ObjectId(id)
    }
    const update = req.body
    const updated={
    $set:{
      ...update
    }
    }
    const result = await appointmentsCollection.updateOne(query, updated)
    res.send(result)
    })

app.patch('/bookings/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updateData = req.body;

    delete updateData._id;

    const updated = {
      $set: {
        ...updateData
      }
    };

    const result = await bookingCollection.updateOne(query, updated);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Booking update backend error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

    await client.db("admin").command({ ping: 1 });
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