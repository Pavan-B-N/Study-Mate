import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,Image } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//api
import { fetchUserChats, createNewUserChat } from "../services/api"
import { AppContext } from "../context/AppContext"

import { useNavigation } from '@react-navigation/native';

import SwipeablePanel from 'react-native-sheets-bottom';
//lottie
import LottieView from 'lottie-react-native';
import LoadingLottie from "../assets/lottie/loading.json"
import NoDataLottie from "../assets/lottie/no-data.json"

import somethingWentWrong from "../assets/images/something-went-wrong.png"


import ChatHistoryItemSkeleton from '../components/ChatHistoryItemSkeleton';

const ChatGPTScreen = ({ navigation,route }) => {
  const { token } = useContext(AppContext)

  const [chats, setChats] = useState(null)
  const [panelActive, setPanelActive] = useState(false)
  const [error, setError] = useState(false)


  const getChats = async () => {
    try {
      const data = await fetchUserChats(token)
      setChats(data)
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("screen changed")
    token && getChats()
  }, [token,route?.name])



  return (
    <View style={styles.container}> 
      <Text style={styles.screenTitle} >Chats</Text>
      <View style={styles.chatConatiner}>
        {
          chats ?
            (
              chats.length > 0 ?
                <FlatList
                  data={chats}
                  renderItem={({ item }) => <ChatItem item={item} />}
                  keyExtractor={item => item._id}
                />
                :
                <View style={{ alignItems: "center", marginTop: hp("5%") }} >
                  <LottieView source={NoDataLottie} autoPlay loop height={wp("70%")} width={wp("70%")} />
                  <Text style={{ fontSize: wp("4%") }} >You do not have any chats</Text>
                  <Text style={{ fontSize: wp("4%") }} >Create New Chat</Text>
                </View>
            )
            :
            (
              error ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                  <Image source={somethingWentWrong} style={{ height: wp("70%"), width: wp("70%") }} />
                  <Text style={{ fontSize: wp("3.5%"), fontWeight: "bold", textAlign: "center" }} >Something went wrong, please try again later</Text>
                </View>
                :
                <View>
                  <ChatHistoryItemSkeleton />
                  <ChatHistoryItemSkeleton />
                  <ChatHistoryItemSkeleton />
                  <ChatHistoryItemSkeleton />
                  <ChatHistoryItemSkeleton />
                </View>
            )
        }
      </View>

      <TouchableOpacity onPress={() => setPanelActive(true)} >
        <View style={styles.newChatBtn} >
          <Text style={styles.newChatTxt} >Create New Chat</Text>
        </View>
      </TouchableOpacity>


      <SwipeablePanel
        fullWidth
        openLarge
        showCloseButton
        isActive={panelActive}
        onClose={() => setPanelActive(false)}
        onPressCloseButton={() => setPanelActive(false)}
        closeOnTouchOutside={false}
        noBackdropOpacity={false}
      >
        <BottomPanel setPanelActive={setPanelActive} token={token} navigation={navigation} />
      </SwipeablePanel>



    </View>
  )
}

const ChatItem = ({ item }) => {
  const navigation = useNavigation();
  const openChat = () => {
    navigation.navigate("GPTChatScreen", { chatId: item._id, title: item.title })
  }
  return (
    <TouchableOpacity style={styles.titleContainer}
      onPress={openChat}

    >
      <Text style={styles.titletxt} >{item.title}</Text>
      <Text style={{ marginTop: hp("1%") }} >{item.createdAt}</Text>
    </TouchableOpacity >
  )
}

const BottomPanel = ({ setPanelActive, token, navigation }) => {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)
  //create new chat
  const createNewGPTChat = async () => {
    try {
      setLoading(true)
      const data = await createNewUserChat(token, title)
      setPanelActive(false)
      setLoading(false)
      //pass the data to the next screen
      navigation.navigate("GPTChatScreen", { chatId: data._id, title: data.title })
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }
  return (
    <View style={styles.container} >
      <TextInput
        placeholder="Enter Title"
        style={styles.linkInput}
        value={title}
        onChangeText={newText => {
          setTitle(newText)
        }}
      />
      {
        loading ?
          <View style={styles.loadingbtn} >
            <LottieView source={LoadingLottie} autoPlay loop height={wp(35)} width={wp(35)} />
          </View>
          :
          <TouchableOpacity onPress={createNewGPTChat} >
            <View style={[styles.newChatBtn, styles.panelBtn]} >
              <Text style={[styles.newChatTxt]} >Create</Text>
            </View>
          </TouchableOpacity>
      }

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  screenTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "teal",
    margin: hp("2%"),
  },
  chatConatiner: {
    height: hp("70%"),
  },
  titleContainer: {
    margin: hp("1%"),
    padding: hp("2%"),
    backgroundColor: '#F5F7F8',
    borderRadius: 10,
  },
  titletxt: {
    fontSize: hp("2.3%"),
    fontWeight: "bold",
    // color: "#fff",

  },
  newChatBtn: {
    margin: hp("1%"),
    padding: hp("2%"),
    backgroundColor: 'teal',
    borderRadius: 10,
    marginTop: hp("5%")
  },
  newChatTxt: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center"
  },
  linkInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: wp("3%"),
    width: wp("90%"),
    alignSelf: "center",
    marginVertical: hp("5%"),
  },
  loadingbtn: {
    alignSelf: "center",
    marginTop: hp("5%")
  },
})

export default ChatGPTScreen