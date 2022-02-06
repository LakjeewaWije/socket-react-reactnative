/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import uuid from 'react-uuid';
// import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [socket, setSocket] = useState(null);
  const [textmsg, onChangeText] = React.useState();
  const [userId, setUserId] = useState(uuid());
  const [currentMsg, setCurrentMessage] = useState([]);
  useEffect(() => {
    getInitialRoute();
    setSocket(io("http://192.168.8.102:4000"));
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  async function getInitialRoute() {
    try {
      const dataRaw = await fetch('http://192.168.8.102:4000');

      const data = await data.json()
      console.log(" Data retrieved ", data);
    } catch (error) {
      console.log(" ERROR ", error);
    }

  }

  useEffect(() => {
    console.log(" MEAAAGFEEEEE ", currentMsg);
  }, [currentMsg])

  useEffect(() => {
    // console.log(" textmsg ",textmsg);
  }, [textmsg]);

  useEffect(() => {
    if (socket) {

      console.log("my userId ", userId);
      const sendData = {
        userId: userId,
        msg: `FIRST CONNECTION TEXT FROM ${userId}`
      };
      socket.emit('chat message', sendData);
      socket.on('chat message', function (msg) {
        console.log("RECIEVED MESSAGFE ", msg, "your user id ", userId);
        console.log(" is your own message ", userId == msg.userId);
        setCurrentMessage(oldArray => [...oldArray, msg])
      });
    }
  }, [socket]);

  const sendMessage = () => {
    console.log("sending message! ", textmsg);
    const sendData = {
      userId: userId,
      msg: textmsg
    };
    socket.emit('chat message', sendData);
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ margin: 10 }}>Type message!</Text>
        <TextInput style={{ marginBottom: 40, padding: 5, backgroundColor: 'white', width: '80%' }} onChangeText={onChangeText}
          value={textmsg}
        ></TextInput>
        <TouchableOpacity style={{ padding: 5, backgroundColor: 'pink' }} onPress={() => {
          sendMessage()
        }}>

          <Text>SEND</Text>

        </TouchableOpacity>
        {currentMsg.map((msg, i) => (
          <Text key={i}>{userId == msg.userId ? "you : " + msg.msg : "friend : " + msg.msg}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
