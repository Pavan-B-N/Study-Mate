import Onboarding from 'react-native-onboarding-swiper';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
//import lottie
import studyHeadacheLottie from "../assets/lottie/study-headche.json"
import AIAssistantLottie from "../assets/lottie/ai-assistant.json"

//import images
import videoToTextImg from "../assets/images/video-text.png"
import ChatWithGPT from "../assets/images/chat-with-gpt.png"

import EncryptedStorage from 'react-native-encrypted-storage';
import { useEffect } from 'react';


const WelcomeScreen = ({navigation}) => {
  // check if user saw the onboarding screen
  const checkOnboarding = async () => {
    const isOnboarded = await EncryptedStorage.getItem("is_onboarded")
    if (!!isOnboarded) {
      //navigate to login screen
      navigation.replace("LoginScreen")
    }
  }
  useEffect(() => {
    checkOnboarding()
  }, [])
  
  const finishOnBoarding =async () => {
    await EncryptedStorage.setItem("is_onboarded", "true");
    //navigate to login screen
    navigation.replace("LoginScreen")
  }

  const donebtn = () => {
    return (
      <TouchableOpacity onPress={finishOnBoarding} >
        <View style={{ padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
          <Text style={{ color: 'black' }}>Done</Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View
      style={{ flex: 1, }}
    >
      <Onboarding
        showSkip={false}
        DoneButtonComponent={donebtn}
        containerStyles={{ paddingHorizontal: 20 }}

        pages={
          [
            {
              backgroundColor: '#DCF2F1',
              image: <LottieView source={studyHeadacheLottie} autoPlay loop height={200} width={200} />,
              title: 'Frustrated with studies?',
              subtitle: 'Don"t worry, make it easy with us',
            },
            {
              backgroundColor: '#DCF2F1',
              image: <LottieView source={AIAssistantLottie} autoPlay loop height={200} width={200} />,
              title: 'Artificial Intelligence',
              subtitle: 'use AI to make your studies easier',
            },
            {
              backgroundColor: '#DCF2F1',
              image: <Image source={videoToTextImg} style={{ height: 200, width: 200 }} />,
              title: 'Youtube Transcription',
              subtitle: 'Seamlessly convert youtube videos to text with our app',
            },
            {
              backgroundColor: '#DCF2F1',
              image: <Image source={ChatWithGPT} style={{ height: 200, width: 200 }} />,
              title: 'Chat with GPT',
              subtitle: 'Chat with GPT to get answers to your questions',
            },
          ]
        }
      />
    </View>
  )
}

export default WelcomeScreen