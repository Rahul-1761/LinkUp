const Mustache = require('mustache');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');

const app = express();
let server = http.createServer(app); //Using this we can create our own server so that we can integrate socket.io to our own server
let io = socketIO(server);
let users = new Users();


app.use(express.static("public"));


//.on is used to listen to an event 

io.on('connection', function(socket){  //This is used to listen to an event and popular one is connection event. The callback function "socket" is the same as index.html "socket".
    console.log("A new user just connected");

    

    socket.on('join', (params, callback) => {
        if(!isRealString(params.Name) || !isRealString(params.Room)){ //Checking for Real String means as spaces are also the type of string so checking it
          return callback('Name and room are required');
        }

        socket.join(params.Room); // to join the room 
        users.removeUser(socket.id); // remove user from other room where he is 
        users.addUser(socket.id, params.Name, params.Room); // add user in new room

        io.to(params.Room).emit("updateUsersList", users.getUsersList(params.Room)); // this will update the user list when new user adds


        //.emit is used to create an event 
        //socket is used for singular connection or one user one server connection
        socket.emit('newMessage', generateMessage('LinkUp Bot', `Welcome ${params.Name} To LinkUp`));

        socket.broadcast.to(params.Room).emit('newMessage', generateMessage('LinkUp Bot', `${params.Name} Has Joined!`));

    callback();
  })
    

     
    socket.on('createMessage', function(message, callback){
        console.log("createMessage", message);

        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            // io is used for all connection on server OR Broadcasting
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }


        //It broadcast to everyone except me
        // socket.broadcast.emit('newMessage', {
        //         from: message.from,
        //         text: message.text,
        //         createDate: new Date().getTime()
        //     })

        callback('This is the server:');
    });

    socket.on('createLocationMessage', function(coords){

        let user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.lng))
        }
        
    })

    socket.on('disconnect', function(){
        let user = users.removeUser(socket.id); // This will take take updated array of user 

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUsersList(user.room)); //this will update the user list when the user gets disconnected
            io.to(user.room).emit('newMessage', generateMessage('LinkUp Bot', `${user.name} has left ${user.room} Room.`)); // this will generate the message that the user has disconnected 
        }
    });
});



server.listen(process.env.PORT || 3000, function(){
    console.log('Server is up on port 3000');
})