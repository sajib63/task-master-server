const express = require('express')
const app = express()
const cors = require('cors')
require ('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())





const uri =`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.z2qhqgi.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const taskCollection=client.db('taskMaster').collection('task')
        const commentCollection=client.db('taskMaster').collection('comment')

        app.post('/task', async (req, res)=>{
            const task=req.body;
            const result=await taskCollection.insertOne(task)
            res.send(result)
        })

        app.get('/task', async(req, res)=>{
          const email=req.query.email
          const query={email: email, complete:false}
          const result=await taskCollection.find(query).toArray()
          res.send(result)

        })

        app.get('/complete', async(req, res)=>{
          const email=req.query.email
          const query={email: email, complete:true}
          const result=await taskCollection.find(query).toArray()
          res.send(result)

        })

        app.delete('/delete/:id', async(req, res)=>{
          const id=req.params.id
          const query={_id: ObjectId(id)}
          const result=await taskCollection.deleteOne(query)
          res.send(result)
        })

        app.put('/update/:id', async (req, res)=>{
          const id=req.params.id
          const filter={_id: ObjectId(id)}
          const option={upsert: true}
          const updateUser={
            $set:{
              complete: true
            }
          }
          const result= await taskCollection.updateOne(filter, updateUser, option)
          res.send(result)
        })

        // dynamic id
        app.get('/update/:id', async(req, res)=>{
          const id=req.params.id
          const query={_id: ObjectId(id)}
          const result=await taskCollection.findOne(query)
          res.send(result)
        })

        // update data 
        app.put('/updateTask/:id', async(req, res)=>{
          const id=req.params.id
          const filter={_id: ObjectId(id)}
          const user=req.body 
          const updateDoc={
            $set:{
              task: user.task
              
            }
          }
          const result= await taskCollection.updateOne(filter, updateDoc)
          res.send(result)
        })


        app.put('/completedTask/:id', async (req, res)=>{
          const id=req.params.id
          const filter={_id: ObjectId(id)}
          const option={upsert: true}
          const updateUser={
            $set:{
              complete: false
            }
          }
          const result= await taskCollection.updateOne(filter, updateUser, option)
          res.send(result)
        })



    }

    finally{

    }

}
run().catch(console.dir())





app.get('/', (req, res) => {
  res.send('Task Master')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})