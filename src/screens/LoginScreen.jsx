import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useState, useContext, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import LottieView from 'lottie-react-native';
//import lottie
import LoginLottie from "../assets/lottie/login.json"
import LoadingLottie from "../assets/lottie/loading.json"

import { AppContext } from "../context/AppContext"
import { serverLogin } from "../services/api"

//google login
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import googleImg from "../assets/images/google-logo.png"

import EncryptedStorage from 'react-native-encrypted-storage';
import Toast  from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const { setUser, setToken } = useContext(AppContext)
  const [isLogging, setIsLogging] = useState(false)

  GoogleSignin.configure({
    webClientId: "726353468433-mdu15vp4tkdqnhlhimo5hvojnk7dd63e.apps.googleusercontent.com",
  });
  const showToastMessage = (message) => {
    Toast .show({
      type: 'error',
      text1: message,
      position: 'bottom',
    });
  };

  const autoLogin = async () => {
    //check if user is already signed in
    const isSignedIn = await EncryptedStorage.getItem("is_signed_in");
    if (!!isSignedIn) {
      setIsLogging(true)
      const token = await EncryptedStorage.getItem("token");
      const user = await EncryptedStorage.getItem("user");
      setToken(token)
      setUser(JSON.parse(user))
      setIsLogging(false)
      navigation.replace("HomeScreen")
    }
  }

  useEffect(() => {
    autoLogin()
  }, [])


  const googleLogin = async () => {
    try {
      setIsLogging(true)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      //check if user is already signed in
      const isSignedIn = await GoogleSignin.isSignedIn();
      
      const userInfo =isSignedIn ? await GoogleSignin.getCurrentUser(): await GoogleSignin.signIn();
      try {
        await serverLogin(userInfo.user)
      } catch (err) {
        console.log(err)
        showToastMessage("Sorry, we couldn't connect to the server")
        setIsLogging(false)
        return;
      }
      console.log("setting user info")
      await EncryptedStorage.setItem("is_signed_in", "true");
      await EncryptedStorage.setItem("token", userInfo.idToken);
      await EncryptedStorage.setItem("user", JSON.stringify(userInfo.user));

      setToken(userInfo.idToken)
      setUser(userInfo.user)
      setIsLogging(false)
      navigation.replace("HomeScreen")
    } catch (error) {
      // toast the error
      console.log(error)
      showToastMessage("Something went wrong, try again")
      setIsLogging(false)
    }
  }

  return (
    <View style={styles.container} >
      <Toast></Toast>
      <LottieView source={LoginLottie} autoPlay loop height={350} width={350} />
        {
        isLogging ?
          (
            <View style={styles.loadingbtn} >
              <LottieView source={LoadingLottie} autoPlay loop height={wp(35)} width={wp(35)} />
            </View>

          )
          :
          (
            <TouchableOpacity style={styles.googlesigninbtn} onPress={googleLogin} >
              <Image source={googleImg} style={styles.googleimg} />
              <Text style={styles.googlesignintext} >Continue with google</Text>
            </TouchableOpacity>
          )
        }


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  googleimg: {
    width: wp("10%"),
    height: hp("5%")
  },
  googlesigninbtn: {
    width: wp("80%"),
    height: hp("8%"),
    marginTop: hp("10%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
  },
  googlesignintext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4942E4",
  },
  loadingbtn: {
    marginTop: hp("10%"),
  }
})

export default LoginScreen