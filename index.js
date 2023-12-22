const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000 ;

app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.5y6t7ws.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    // await client.connect();
    const newtaskCollection = client.db("tasktoolDB").collection("newtasks");
    const newfeedbackCollection = client.db("tasktoolDB").collection("newfeedbacks");
    app.post('/newtask' , async(req , res) => {
        const newtask = req.body ;
        const result = await newtaskCollection.insertOne(newtask);
        res.send(result);
      })
    app.post('/newfeedback' , async(req , res) => {
        const newfeedback = req.body ;
        const result = await newfeedbackCollection.insertOne(newfeedback);
        res.send(result);
      })
      app.get('/newfeedback' , async(req, res) => {
        const cursor = newfeedbackCollection.find();
        const result = await cursor.toArray();
        res.send(result);

      })
      app.get('/newtasks' , async(req, res) => {
        const cursor = newtaskCollection.find();
        const result = await cursor.toArray();
        res.send(result);

      })
      app.get('/newtasks/:id' , async(req, res) => {
        const id = req.params.id ;
        console.log(id);
        const filter = { _id : new ObjectId(id)}
        const result = await newtaskCollection.findOne(filter);
        res.send(result);
      })
      app.patch( '/newtasks/:_id' , async(req , res) => {
        const id = req.params._id;
        console.log(id);
      const filter = { _id : new ObjectId(id)} ;
        const options = { upsert: true };
        const updateTask = req.body ;
        const task = {
            $set: {
             title :updateTask.title,
             date : updateTask.date,
             priority: updateTask.priority,
             description: updateTask.description
           },
          };
          const result = await newtaskCollection.updateOne(filter , task , options);
          res.send(result)
        
      })
      app.delete('/newtasks/:_id' , async(req , res) => {
        const id = req.params._id;
        const query = {_id : new ObjectId(id)};
        const result = await newtaskCollection.deleteOne(query);
        res.send(result)
    
    })
      app.get('/newtask',  async(req , res) => {
        console.log(req.query.email); 
        const email = req.query.email ;
        const filter = {email : email}
        const cursor = newtaskCollection.find(filter);
        const result = await cursor.toArray();
        res.send(result);

    })
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req , res) => {
    res.send('data is coming')
})
app.listen(port , (req, res ) =>{
    console.log(`database is running successfully port : ${port}`)
})