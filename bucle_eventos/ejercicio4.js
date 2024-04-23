const events = require('events')

class User extends events.EventEmitter {
    constructor(name){
        super()
        this.name=name;
        this.messageCount=0;
    }
}

const Antonio = new User('Antonio')
const Laura = new User('Laura')
const Maria = new User('Maria')

const users = [Antonio, Maria, Laura]

users.forEach(user => {
    user.on('message', () => {
        user.messageCount += 1
    })
});

Antonio.emit('message')
Antonio.emit('message')
Antonio.emit('message')
Antonio.emit('message')

console.log(Antonio.messageCount)

