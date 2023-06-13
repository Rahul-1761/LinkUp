// the message is broadcast to all irrespective of the room id
// so new class is being created so that the room id , display name is stored nd the message is broadcast to those only.
// to do so every time a new user join a new unique socket id is generated so that id is being used to 


//creating class because it can be used as an instances
class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    getUsersList(room){  

        let users = this.users.filter((user) => user.room === room);// 1. It takes an array of users (`this.users`) and filters it based on a specific condition.
                                                                    // 2. The condition is that the `room` property of each user object should match the `room` variable.
                                                                    // 3. The filtered users are stored in a new array called `users`.

        let namesArray = users.map((user) => user.name); // 1. It creates a new array called `namesArray` by extracting the `name` property from each user object in the `users` array.
                                                        // 2. This is done using the `map()` method, which applies a function to each element of the array and returns a new array with the results.
                                                        // 3. The function used here simply retrieves the `name` property from each user object.

        return namesArray;
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    removeUser(id){
        let user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

}

module.exports = {Users};

