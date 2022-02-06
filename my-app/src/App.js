import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import uuid from 'react-uuid'
import { io } from "socket.io-client";
function App() {
  // var socket = io("http://localhost:4000");
  const [socket, setSocket] = useState(null);
  const [textmsg, setMessage] = useState();
  const [userId, setUserId] = useState(uuid());
  const [currentMsg, setCurrentMessage] = useState([]);
  useEffect(() => {
    setSocket(io("http://localhost:4000"));
  }, []);

  useEffect(() => {
    if (socket) {

      console.log("my userId ", userId);
      const sendData = {
        userId: userId,
        msg: `FIRST CONNECTION TEXT FROM ${userId}`
      };
      socket.emit('chat message', sendData);
      socket.on('chat message', function (msg) {
        // console.log("RECIEVED MESSAGFE ", msg , "your user id ",userId);
        console.log(" is your own message ",userId == msg.userId);
        setCurrentMessage(oldArray => [...oldArray, msg])
      });
    }
  }, [socket]);

  useEffect(()=>{
    console.log(" MEAAAGFEEEEE ",currentMsg);
  },[currentMsg])
  const sendMessage = () => {
    console.log("sending message! ", textmsg);
    const sendData = {
      userId: userId,
      msg: textmsg
    };
    socket.emit('chat message', sendData);
  }
  return (
    <div className="App">
      <input type="text" onChange={(e) => { setMessage(e.target.value) }}></input>
      <button onClick={() => { sendMessage() }}>Send</button>
      {currentMsg.map((msg,i) =>(
        <span key={i}>{msg.msg} <br></br></span>
      ))}
    </div>
  );
}

export default App;
