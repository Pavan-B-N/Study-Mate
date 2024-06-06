import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions, Keyboard } from 'react-native'
import { useState, useEffect, useContext, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//icon
import IonIcons from "react-native-vector-icons/Ionicons"
//api
import { fetchChatMessages, promptGPT } from "../services/api"
import { AppContext } from "../context/AppContext"

import LottieView from 'lottie-react-native';
//import lottie
import waveLottie from "../assets/lottie/wave-loading.json"
import loadingLottie from "../assets/lottie/loading.json"

//import mic images
import micIcon from "../assets/images/mic.png"
import micListeningIcon from "../assets/images/listening.gif"
import volumeImg from "../assets/images/volume.png"
import volumeMuteImg from "../assets/images/volume-mute.png"

const GPTChatScreen = ({ route }) => {
  const { token } = useContext(AppContext)
  const { chatId, title } = route.params

  const [text, setText] = useState("")
  const [messages, setMessages] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)


  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [speakingEnabled, setSpeakingEnabled] = useState(true)

  const [flatListHeight, setFlatListHeight] = useState();
  const flatlistRef = useRef(null);

  const prompt = async () => {
    const newMessages = [...messages, { content: text, role: "user" }]
    setMessages(newMessages)
    setText("")
    try {
      setLoading(true)
      const msg = await promptGPT(token, chatId, newMessages)
      console.log("msg", msg)
      setLoading(false)
      msg && setMessages(pre => [...pre, msg])
    } catch (err) {
      console.log("err in prompt", err)
      setMessages(pre => [...pre, { content: "Something went wrong", role: "assistant" }])
      setLoading(false)
    }
  }
  const getMessages = async () => {
    try {
      setLoading(true)
      const data = await fetchChatMessages(token, chatId)
      setMessages(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setError(true)
    }
  }

  const srollToBottom = () => {
    if (flatlistRef && flatlistRef.current) {
      setTimeout(() => {
        flatlistRef.current.scrollToEnd({ animated: true })
      }, 500)
    }
  }
  useEffect(() => {
    srollToBottom()
  }, [messages])

  useEffect(() => {
    token && getMessages()
  }, [token])


  const startSpeaking = () => {
    if (speakingEnabled) {
      setSpeaking(true)
    }
  }
  const stopSpeaking = () => {
    setSpeaking(false)
  }
  const startListening = () => {
    setListening(true)

  }
  const stopListening = () => {
    setListening(false)

  }
  const enableSpeaking = () => {
    setSpeakingEnabled(true)

  }
  const disableSpeaking = () => {
    setSpeakingEnabled(false)

  }

  useEffect(() => {
    const h = Dimensions.get('window').height
    setFlatListHeight(h * 0.7)
  }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => _keyboardDidShow(e)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => _keyboardDidHide()
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = (e) => {
    const keyboardHeight = e.endCoordinates.height;
    const windowHeight = Dimensions.get('window').height;
    const bottomSpace = windowHeight - keyboardHeight;
    setFlatListHeight(bottomSpace * 0.55);
  };

  const _keyboardDidHide = () => {
    const windowHeight = Dimensions.get('window').height;
    setFlatListHeight(windowHeight * 0.7);
  };



  return (
    <View style={styles.container} >
      <Text style={styles.title} >{title}</Text>
      <View style={[styles.chatConatiner, { height: flatListHeight }]}>
        {
          !messages ?
            (
              !error ?
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
                  <LottieView source={loadingLottie} autoPlay loop style={{ width: wp("25%"), height: hp("10%") }} />
                  <Text>Fetching your chats..</Text>
                </View>
                :
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
                  <Text>Something went wrong</Text>
                </View>
            )
            :
            (
              messages.length == 0 ?
                <View style={styles.nomsgs} >
                  <Text style={{ textAlign: "center" }} >No messages</Text>
                </View>
                :
                <View
                // style={{ height: flatListHeight }}
                >

                  <FlatList
                    ref={flatlistRef}
                    data={messages}
                    renderItem={({ item }) => <MessageItem item={item} />}
                    ListFooterComponent={() => {
                      return (
                        loading &&
                        <View style={{ marginLeft: wp("2%") }} >
                          <LottieView source={waveLottie} autoPlay loop style={{ width: wp("20%"), height: hp("10%") }} />
                        </View>
                      )
                    }}
                  />

                </View>
            )
        }
      </View>


      <View style={styles.inputContainer}>
        <TextInput placeholder="Prompt" style={styles.input}
          value={text}
          onChangeText={(text) => setText(text)}

        />
        <TouchableOpacity
          onPress={prompt}
          disabled={loading}
        >
          <IonIcons name='send' size={30} color={loading ? "gray" : "teal"} />
        </TouchableOpacity>
      </View>

      {/* bottomSection */}

      <View style={styles.bottomSection}>
        {/* actions section */}
        <View style={styles.actions}>
          <View>
            {
              speaking &&
              <TouchableOpacity style={styles.stopBtn} >
                <Text style={styles.stopBtnText} onPress={stopSpeaking} >Stop</Text>
              </TouchableOpacity>
            }
          </View>

          <View>
            {
              listening ?
                <TouchableOpacity onPress={stopListening}>
                  <Image source={micListeningIcon} style={styles.micIcon} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={startListening}>
                  <Image source={micIcon} style={styles.micIcon} />
                </TouchableOpacity>
            }
          </View>

          <View>
            {
              speakingEnabled ?
                <TouchableOpacity onPress={disableSpeaking}>
                  <Image source={volumeImg} style={styles.volumeIcon} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={enableSpeaking}>
                  <Image source={volumeMuteImg} style={styles.volumeIcon} />
                </TouchableOpacity>
            }
          </View>

        </View>
      </View>

    </View>

  )
}


const MessageItem = ({ item }) => {
  return (
    <Text style={item.role == "user" ? styles.userMsg : styles.botMsg} >{item.content}</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10
  },
  chatConatiner: {
    backgroundColor: "#EEF5FF",
  },
  userMsg: {
    backgroundColor: "#FB7813",
    color: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignSelf: "flex-end"
  },
  botMsg: {
    backgroundColor: "#fff",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: wp("80%")
  },
  nomsgs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: wp("100%")

  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: hp("2%"),
    marginHorizontal: hp("2%")
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    width: wp("80%"),
    padding: 7,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: wp("100%"),
    padding: wp("3%"),
  },
  stopBtnText: {
    color: "red"
  },
  micIcon: {
    width: wp("15%"),
    height: wp("15%"),
    resizeMode: "contain"
  },
  volumeIcon: {
    width: wp("10%"),
    height: wp("10%")
  },

})
export default GPTChatScreen