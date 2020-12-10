const socket = io()
var queryParams = new URLSearchParams(window.location.search);
document.getElementById('usernameHi').innerText = `Hi , ${queryParams.get('username')}`
document.getElementById('roomName').innerText = `${queryParams.get('room')}`

socket.on('message',message=>{
    var newDiv = `<div class="adminChat">
                        <p>${message}</p>
                    </div>`
    document.getElementsByClassName("chatHistory")[0].innerHTML += newDiv
    console.log(message)
})

socket.on('newMember',(users)=>{
    console.log(users)
    document.getElementsByClassName('memberList')[0].innerHTML = ``;
    document.getElementsByClassName('memberList2')[0].innerHTML = ``;
    for(let i=0;i <users.length;i++){
        if(users[i].room == 'Room#1'){
            document.getElementsByClassName('memberList')[0].innerHTML += `<p>${users[i].user}</p>`
        }
        if(users[i].room == 'Room#2'){
            document.getElementsByClassName('memberList2')[0].innerHTML += `<p>${users[i].user}</p>`
        }
    }
})

socket.on('chatMessage',messageInfo=>{
    var newDiv = `<div class="reply">
                    <p>${messageInfo.user}</p>
                    <div class="replyBubble">
                        <p>${messageInfo.message}</p>
                    </div>
                </div>`
    document.getElementsByClassName("chatHistory")[0].innerHTML += newDiv
    var objDiv = document.getElementsByClassName("chatHistory")[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    console.log(messageInfo.message)
})

document.getElementById('messageArea').addEventListener('keyup',(e)=>{
    if(e.keyCode == 13){
        socket.emit('chatMessage',{'message' : document.getElementById('messageArea').value, 'user' : queryParams.get('username')})
        var newDiv = `<div class="myChat">
                    <p>${queryParams.get('username')}(me)&nbsp&nbsp</p>
                    <div class="bubble">
                        <p>${document.getElementById('messageArea').value}</p>
                    </div>
                </div>`
        document.getElementsByClassName("chatHistory")[0].innerHTML += newDiv
        document.getElementById('messageArea').value = ""
        var objDiv = document.getElementsByClassName("chatHistory")[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    }
})

// socket.on('Broadcast',(userInfo)=>{
//     console.log(userInfo.user.room)
// })

socket.emit('joinRoom',{'user' : queryParams.get('username'), 'room' : queryParams.get('room')})


function changeRoom(room){
    
    queryParams.set("room", room); 
    history.replaceState(null, null, "?"+queryParams.toString());
    document.location.reload()
}