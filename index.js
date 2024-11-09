const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const { log } = require("console");


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname,"public")));
app.use(express.static('public'));  //the previous one wasn't  working to attach the public directory

//fun fact:chatting apps are generally based on socket.io
io.on("connection", function(socket) {
  socket.on("send-location", function(data){
    io.emit("receive-location", {id: socket.id, ...data}) //sends location to everyone that is connected through the app..unique id for each individual
  });
  socket.on("disconnect", function(){
    io.emit("user-disconnected", socket.id);
  });
})

app.get("/", function(req,res){
  res.render("index")  //render because we are not viewing something on net
})


server.listen(3000,() => console.log("Server started"));