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
        // step 14 getting job from particular email
        const email = req.query.email;
        let query = {};
        if(email){
            query = {service_provider_email : email}
        }

        // step 15 set the query in find
        const cursor = serviceCollection.find(query);
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

    // step 12 getting people through email
    app.get('/single-booking', async(req, res) =>{
        const email = req.query.email;
        const query = {user_email: email }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    });


    // step 11 service booking
    app.post('/service-bookings', async(req, res)=>{
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking)
        res.send(result)
    });

    // step 13 add new service related api
    app.post('/services', async(req, res) =>{
        const newService = req.body;
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    });


    // step 16 single booking by id
    app.get('/single-booking/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await bookingCollection.findOne(query);
        res.send(result);
    });

    // step 17 update status
    app.patch('/single-booking/:id', async(req, res) =>{
        const id = req.params.id;
        const data = req.body;
        const filter = {_id: new ObjectId(id)};
        const updatedDoc = {
            $set:{
                status : data.service_status
            }
        }
        const result = await bookingCollection.updateOne(filter, updatedDoc);
        res.send(result);
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