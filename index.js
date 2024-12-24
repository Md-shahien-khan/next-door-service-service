// step 1 Connecting express cors
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// step 6 adding dotenv
require('dotenv').config();
const port = process.env.PORT || 5000;

// step 2 using middle ware
app.use(cors());
app.use(express.json());


// step 4 Db_user =  DB_PASS = and save it .env file 


// step 5 getting mongodb
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5uoh0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5uoh0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // step 7 Get the database and collection on which to run the operation
    const serviceCollection = client.db('next_door_service').collection('company_services');
    // step 10 service booking collection 
    const bookingCollection = client.db('next_door_service').collection('service_booking');

    // step 8 all services api
    app.get('/services', async(req, res) =>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        // const result = await serviceCollection.find({name : "test service", price : 100});
        res.send(result);
    });

    // step 9 get specific service trough id
    app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await serviceCollection.findOne(query);
        res.send(result);
    });


    // step 11 service booking
    app.post('/service-bookings', async(req, res)=>{
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking)
        res.send(result)
    })



  } finally {
    // Ensures that the client will close when you finish/error
    // step 6 running the server
    // await client.close();
  }
}
run().catch(console.dir);

// step 3 get the server
app.get('/', (req, res) =>{
    res.send('data is coming from database');
});

// step 4 listen the port
app.listen(port, () => {
    console.log(`Server is running at : ${port}`);
});