const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({ origin: true }));

let url= process.env.MONGO_URI;
mongoose.pluralize(null);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected to mongoDB...");
  })
  .catch(err => {
    console.log("could not connect to mongoDB...", err);
  });


  const courseSchema = new mongoose.Schema({
      todo: String
  });

  const loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
  },{ collection: 'login' });

  app.post("/adddata", (req,res)=>{
    const Todo = mongoose.model(req.body.username, courseSchema);
    let todo = new Todo({todo: req.body.todo});
    todo.save(function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.send({data});
        }
      });
})

app.get("/getdata/:username",(req,res)=>{
    if(req.params.username ==='admin'){
      const Admin = mongoose.model('login',loginSchema);
      let userdata=[];
      Admin.find({role:'user'}, function(err, users){
        if(err){
          res.send('Error getting data')
        } else {
          users.map((a,i)=>{
            const Data = mongoose.model(a.username,courseSchema);
            Data.find({}, function (err, data) {
              if (err) {
                res.send("Error uploading data");
              } else {
                userdata.push(...data);
                if(i === users.length-1) {
                  res.send(userdata);
                }
              }
            });
          });
        }
      });
    }else{
      const Todo = mongoose.model(req.params.username, courseSchema);
      Todo.find({}, function (err, data) {
        if (err) {
          res.send("Error uploading data");
        } else {
          res.send(data);
        }
      });
    }
   
})
app.post("/delete",(req,res)=>{
    const Todo = mongoose.model(req.body.username, courseSchema);
    Todo.findByIdAndDelete({_id: req.body._id}, function (err, data) {
        if (err) {
          res.send("Error uploading data", err);
        } else {
          res.send(data);
        }
      });
})


app.post('/login',(req,res)=>{
  const Login = mongoose.model('LOGIN',loginSchema);
  Login.find({role: req.body.role},function(err,data){
    if(err){
      res.send('login failed',err);
    }else{
      let login = false;
      data.map((a)=>{
        if(a.username===req.body.username && a.password === req.body.password){
          login = true;
        }
      });
      if(login) {
        res.status(200).send({status:'success'})
      } else {
        res.status(401).send({status:'failed'})
      }
    }
  })
})

app.listen(4000, () => {
    console.log("Server is listining to port 4000");
});