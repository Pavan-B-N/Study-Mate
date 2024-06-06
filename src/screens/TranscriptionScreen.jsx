import { View, Text, TouchableOpactiy, StyleSheet, Image } from 'react-native'
import { useEffect, useState,useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import LottieView from 'lottie-react-native';
//import lottie
import downloadingLottie from "../assets/lottie/downloading.json"
import processingLottie from "../assets/lottie/processing.json"
import errorLottie from "../assets/lottie/error.json"

import TranscriptionComponet from '../components/TranscriptionComponet';

//api
import { fetchYoutubeTranscription } from "../services/api"
import { AppContext } from "../context/AppContext"

const YoutubeDetails = ({ thumbnail, title, description }) => {
  return (
    <View style={styles.youtubeDetailsContainer} >
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{title.length > 70 ? title.slice(0, 70) + "..." : title}</Text>
      <Text style={styles.description}>{description.length > 70 ? description.slice(0, 70) + "..." : description}  </Text>
    </View>
  )
}

const TranscriptionScreen = ({ navigation, route }) => {
  const {token}=useContext(AppContext)
  const { link, title, description, thumbnail } = route.params
  const [transcription, setTranscription] = useState("Transcription here")
  const [transcriptionId,setTranscriptionId]=useState(null)
  const [requestStep, setRequestStep] = useState("done")//downloading,processing,error,done


  const getTranscription = async (token,link) => {
    try {
      setRequestStep("processing")
      const data = await fetchYoutubeTranscription(token,link)
      setTranscriptionId(data._id)
      setTranscription(data.transcripts)
      setRequestStep("done")
    } catch (err) {
      console.log("error", err)
      setRequestStep("error")
    }
  }

  //fetch the transcription
  useEffect(() => {
    // fetch the transcription
    token && getTranscription(token,link)
  }, [token])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
      {
        requestStep === "downloading" ?
          <View style={styles.animConatiner} >
            <YoutubeDetails thumbnail={thumbnail} title={title} description={description} />
            <LottieView source={downloadingLottie} autoPlay loop width={wp("50%")} height={wp("50%")} />
            <Text style={styles.requestStepMsg} >Downloading Youtube Video Please wait..</Text>
          </View>
          :
          requestStep === "processing" ?
            <View style={styles.animConatiner} >
              <LottieView source={processingLottie} autoPlay loop width={wp("50%")} height={wp("50%")} />
              <Text style={styles.requestStepMsg} >Transcribing your video into text please wait...</Text>
            </View>
            :
            requestStep === "error" ?
              <View style={styles.animConatiner} >
                <LottieView source={errorLottie} autoPlay loop width={wp("50%")} height={wp("50%")} />
                <Text style={styles.requestStepMsg} >Error occured, try again later</Text>
                <Text style={styles.errorMsg} >Internal server error</Text>
              </View> :
              <TranscriptionComponet link={link} title={title} transcription={transcription} transcriptionId={transcriptionId} />
      }

    </View>
  )
}

const styles = StyleSheet.create({
  animConatiner: {
    alignItems: "center",
  },
  requestStepMsg: {
    width: wp("80%"),
    textAlign: "center",
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#F99417",
  },
  youtubeDetailsContainer: {
    alignItems: "center",
    margin: wp("2%")
  },
  thumbnail: {
    width: wp("90%"),
    height: wp("40%"),
    borderRadius: 10
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#F99417",
    width: wp("90%"),
  },
  description: {
    fontSize: wp("4%"),
    width: wp("90%"),
  },
  errorMsg: {
    fontSize: wp("4%"),
    color: "red",
    fontWeight: "bold",
    marginTop: hp("2%")
  }
})

export default TranscriptionScreen