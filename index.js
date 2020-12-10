// handle url nya biar lebih gampang 
const express = require('express')

const http = require('http')
const app = express()

const socket = require('socket.io')
const server = http.createServer(app)

//set static folder
app.use(express.static('./public'))

//brarti socket io nya kek bekerja di server ini
const io = socket(server)

var users = []

// menunggu apakah ada client yang connect, jika ada jalanin yang di callback
io.on("connection", socket =>{
    console.log("New Connection")

    socket.on('joinRoom',(userInfo)=>{

        addNewUser(socket.id,userInfo.user,userInfo.room)
        socket.join(userInfo.room)

        socket.broadcast.to(userInfo.room).emit('message', `${userInfo.user} has joined this room`)

        io.emit('newMember', users);

        socket.on('chatMessage',(messageInfo)=>{
            socket.to(userInfo.room).emit('chatMessage',messageInfo)
        })
    })
    socket.emit('message','Welcome')
    
    socket.on('disconnect',()=>{
        var user = deleteUser(socket.id)
        console.log(user)
        io.emit('newMember', users);
        io.emit('message',`${user.user} has left`)
    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Listening to ${PORT} port`))


function addNewUser(id,user,room){
    users.push({'id' : id,'user' : user , 'room' : room})
    return {'id' : id,'user' : user , 'room' : room};
}

function deleteUser(id){
    var user = 0;
    console.log(id)
    for(let i=0;i<users.length;i++){
        if(users[i].id == id){
            user = users[i]
            console.log(`user ini yang mati ${user}`)
            users.splice(i,1);
            break;
        }
    }
    return user
}

function roomUser(room){
    console.log(users.find((user)=>user.room == room))
    return users.find((user)=>user.room == room)
}

function getUser(id){
    return users.find((user)=>user.id == id)
}
