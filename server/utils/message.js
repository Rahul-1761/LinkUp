//MomentJS is a JavaScript library which helps is parsing, validating, manipulating and displaying date/time in JavaScript in a very easy way.
const moment = require('moment');

let generateMessage = function(from, text){
    return{
        from,
        text,
        createdAt: moment().valueOf()
    };
};  

let generateLocationMessage = function(from, lat, lng){
    return{
        from, 
        url: `https://www.google.com/maps?q=${lat}, ${lng}` ,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage}; 

