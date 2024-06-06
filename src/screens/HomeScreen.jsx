import { View, Text, Image, StyleSheet, TouchableOpacity ,ScrollView} from 'react-native'
import {useContext} from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


import LottieView from 'lottie-react-native';
//import lottie
import StudyOnBook from "../assets/lottie/study-on-book.json"

import IonIcons from "react-native-vector-icons/Ionicons";

//import images
import youtubeImg from "../assets/images/youtube.png"
import chatGPTImg from "../assets/images/chatgpt.png"
import dalleImg from "../assets/images/dalle.png"

import Card from "../components/Card"

import { AppContext } from "../context/AppContext"

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AppContext)

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <Text style={styles.appName} >StudyMate</Text>
        <View style={styles.iconsec} >
          <TouchableOpacity style={styles.iconbtn} onPress={() => navigation.navigate("LeaderboardScreen")} >
            <IonIcons name="stats-chart" size={30} color="#FF6000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconbtn} onPress={() => navigation.navigate("ProfileScreen")} >
            <Image source={{ uri: user.photo }} style={{ width: wp("10%"), height: wp("10%"), borderRadius: 100 }} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ alignSelf: "center" }} >
        <LottieView source={StudyOnBook} autoPlay loop height={200} width={200} />
      </View>


      <ScrollView>
        <View style={styles.featuresContainer}>
          <Card srcImg={youtubeImg} titel="Youtube Trancriptions" desc="seemlessly transcribe video to text, get summary , Q&A and take quizz" backgroundColor="#D6D5A8" route="YoutubeScreen" />
          <Card srcImg={chatGPTImg} titel="ChatGPT" desc="Ask any questions, doubts to chatgpt. It can provide you with instant acknowledgeable response" backgroundColor="#B3E5BE" route="ChatGPTScreen" />
          <Card srcImg={dalleImg} titel="DallE" desc="Dot E can generate imaginative and diverse images from textual description expanding the boundaries of visual creativity" backgroundColor="#FFA1CF" route="DallEScreen" />
        </View>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp("5%"),
    height: hp("10%"),
    width: wp("100%")
  },
  iconsec: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  iconbtn: {
    width: wp("12%"),
    height: wp("12%"),
    alignItems: "center",
    justifyContent: "center",
    margin: wp("2%"),
  },
  appName: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#F99417"
  }
})
export default HomeScreen