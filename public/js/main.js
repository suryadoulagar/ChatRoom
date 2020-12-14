const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const {username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

const socket = io();

//Join KickChat
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) =>{
    outputRoomName(room);
    outputUsers(users);
});

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get message from input field
    const msg =e.target.elements.msg.value;
    
    //emit message to servers
    socket.emit('chatMessage', msg);

    //clear input after submit
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//Output message from DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
      ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}