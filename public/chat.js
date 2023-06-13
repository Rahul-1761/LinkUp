let socket = io(); //It is a Method or Function that we just got from "/socket.io/socket.io.js" library. And this is used to make the connection alive with server or backend.

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild
    messages.scrollIntoView();
}

socket.on('connect', function(){
    console.log("Connected to server");

    //This will get value back from url Such as Name and Room Id
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}'); //This will create an object with name and  room id as parameters

    socket.emit('join', params, function(err) {
    if(err){
      alert(err);
      window.location.href = '/';
    }else {

        ////taking data from template
        const template = document.querySelector('#Room-template').innerHTML;
        const html = Mustache.render(template, {
            params: params.Room,
        });

        document.querySelector('#room_name').append(html);
      console.log('No Error');
    }
    })

    // socket.emit('createMessage', {
    //     from: "RAHUL",
    //     text: "Whats Going on!"
    // })

});

socket.on('disconnect', function(){
    console.log("Disconnected to server");
});

socket.on('updateUsersList', function(users){
    let ol = document.createElement('ol');
   
    users.forEach(function(user){
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    });

    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ol);
})

socket.on('newMessage', function(message){
    const formattedTime = moment(message.createdAt).format('LT'); //Using Moment.js to format the time created at
    console.log("newMessage", message);

    //taking data from template
    const template = document.querySelector('#message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html

    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
    // let li = document.createElement('li');
    // li.innerText = `${message.from} ${formattedTime}: ${message.text}` //Use backticks ` to embed the data

    // li.style.listStyleType = "none"; // Set list-style-type to none

    // document.querySelector('#messages').appendChild(li);
});

socket.on('newLocationMessage', function(message){
    const formattedTime = moment(message.createdAt).format('LT');
    console.log("newLocationMessage", message);

    const template = document.querySelector('#location-message-template').innerHTML;
    const html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        url: message.url,
        createdAt: formattedTime
    });

    const div = document.createElement('div');
    div.innerHTML = html

    document.querySelector('#messages').appendChild(div);
    scrollToBottom();
    // let li = document.createElement('li');
    // let a = document.createElement('a');
    // li.innerText = `${message.from} ${formattedTime}:`
    // a.setAttribute('target', '_blank');
    // a.setAttribute('href', message.url);
    // a.innerText = 'My Current Location';
    // li.appendChild(a);

    // li.style.listStyleType = "none"; // Set list-style-type to none

    // document.querySelector('#messages').appendChild(li);
});



// socket.emit('createMessage', {
//     from: "Rahul",
//     text: "Hey"
// }, function(message){
//     console.log('Got it', message); // acknowleding the message is recieved by the server
// });



//Submit Buttion action
document.querySelector('#submit-btn').addEventListener('click', function(e){
    e.preventDefault(); //prevent reload 

    socket.emit('createMessage', {
        from: "User",
        text: document.querySelector('input[name="message"]').value

    }, function(){

    })
})


//Send Location Button
document.querySelector('#Send-location').addEventListener('click', function(e){
    e.preventDefault();

    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your Browser.');
    }
      
    navigator.geolocation.getCurrentPosition(function(position)
    {
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function(){
        alert('Unable to fetch location.');
    })
 })

 