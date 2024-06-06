import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Platform, Alert,Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import HistoryItem from '../components/HistoryItem'

import SwipeablePanel from 'react-native-sheets-bottom';
import { KeyboardAvoidingView } from 'react-native';

//lottie
import LottieView from 'lottie-react-native';
import LoadingLottie from "../assets/lottie/loading.json"
import NoDataLottie from "../assets/lottie/no-data.json"

import somethingWentWrong from "../assets/images/something-went-wrong.png"

//api
import { fetchUserTranscriptionHistory, fetchYoutubeLinkDetails } from "../services/api"
import { AppContext } from "../context/AppContext"

import YoutubeItemSkeleton from '../components/YoutubeItemSkeleton';
const YoutubeScreen = ({ navigation }) => {
  const { token } = useContext(AppContext)

  const [panelActive, setPanelActive] = useState(false)
  const [history, setHistory] = useState(null)
  const [error, setError] = useState(false)


  const getHistory = async (token) => {
    try {
      const data = await fetchUserTranscriptionHistory(token)
      setHistory(data)
    } catch (err) {
      setError(true)
      console.log("error occured ", err)
    }
  }

  useEffect(() => {
    token && getHistory(token)
  }, [token])

  return (
    <View style={styles.container} >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <Text style={styles.screenTitle} >Transcriptions</Text>


        <View style={styles.historyContainer}>
          {
            history ?
              (
                history.length > 0 ?
                  <FlatList
                    data={history}
                    renderItem={({ item }) => <HistoryItem item={item} />}
                    keyExtractor={item => item._id}
                    ListFooterComponent={() => <View style={{ height: hp("10%") }} />}
                  />
                  :
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                    <LottieView source={NoDataLottie} autoPlay loop={false} height={wp("70%")} width={wp("70%")} />
                    <View style={{ alignItems: "center" }} >
                      <Text style={{ fontSize: wp("3.5%"), fontWeight: "bold", textAlign: "center" }} >You do not have any youtube transcription history,
                      </Text>
                      <Text style={{ fontSize: wp("3.5%"), fontWeight: "bold", textAlign: "center" }}  >let's start now</Text>
                    </View>
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
                  <View style={{ flex: 1 }} >
                    <YoutubeItemSkeleton />
                    <YoutubeItemSkeleton />
                    <YoutubeItemSkeleton />
                    <YoutubeItemSkeleton />
                    <YoutubeItemSkeleton />
                  </View>
              )
          }
        </View>


        <TouchableOpacity onPress={() => setPanelActive(true)} >
          <View style={styles.newTranscriptionbtn} >
            <Text style={styles.newTranscriptionText} >New Transcription</Text>
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

      </KeyboardAvoidingView>
    </View>
  )
}
const BottomPanel = ({ setPanelActive, token, navigation }) => {
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  //fetch link details
  const fetchLinkDetails = async () => {
    try {
      setLoading(true)
      const data = await fetchYoutubeLinkDetails(token, link)
      setPanelActive(false)
      setLoading(false)
      //pass the data to the next screen
      navigation.navigate("TranscriptionScreen", { link: link, title: data.title, description: data.description, thumbnail: data.thumbnail })
    } catch (err) {
      console.log(err)
      setLoading(false)
      Alert.alert("Error", "Invalid Youtube Link")
    }
  }
  return (
    <View>
      <TextInput
        placeholder="Enter Youtube Link"
        style={styles.linkInput}
        value={link}
        onChangeText={newText => {
          setLink(newText)
        }}
      />
      <Text
      style={{marginLeft:wp("5%"),marginBottom:hp("2%"),color:"#E9B824",fontSize:wp("3.5%")}}
      >Our app can transcribe videos up to 1 hour. Transcribing videos longer than this may cause errors</Text>
      {
        loading ?
          <View style={styles.loadingbtn} >
            <LottieView source={LoadingLottie} autoPlay loop height={wp(35)} width={wp(35)} />
          </View>
          :
          <TouchableOpacity onPress={fetchLinkDetails} >
            <View style={[styles.newTranscriptionbtn, styles.panelBtn]} >
              <Text style={[styles.newTranscriptionText]} >Transcribe</Text>
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
    margin: wp("2%"),
  },
  historyContainer: {
    height: hp("80%"),
  },
  newTranscriptionbtn: {
    width: wp("90%"),
    padding: wp("5%"),
    borderRadius: 10,
    backgroundColor: "teal",
    alignSelf: "center",
    marginVertical: hp("2%")
  },
  newTranscriptionText: {
    color: "white",
    textAlign: "center",

  },
  linkInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: wp("3%"),
    width: wp("90%"),
    alignSelf: "center",
    marginTop: hp("5%"),
    marginBottom: hp("2%"),
  },
  loadingbtn: {
    alignSelf: "center",
    marginTop: hp("5%")
  },

})
export default YoutubeScreen