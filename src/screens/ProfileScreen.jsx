import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useState, useContext, useEffect } from 'react'
import { AppContext } from "../context/AppContext"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { userLeaderboardDetail } from "../services/api"

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import EncryptedStorage from 'react-native-encrypted-storage';


const ProfileScreen = ({navigation}) => {
  const { user, token } = useContext(AppContext)

  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(0);

  const getLeaderboardDetail = async () => {
    try {
      const data = await userLeaderboardDetail(token)
      setScore(data.score)
      setPosition(data.rank)
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    token && getLeaderboardDetail()

  }, [token])

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      // remove user from storage
      await EncryptedStorage.removeItem("is_signed_in");
      await EncryptedStorage.removeItem("token");
      await EncryptedStorage.removeItem("user");

      navigation.popToTop();
      navigation.replace("LoginScreen")

    } catch (error) {
      
      console.log("logout err",error)
    }
  }

  return (
    <View>
      <View style={styles.headerInfo} >
        <Image source={{ uri: user.photo }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      <View style={styles.quizzScoreContainer} >
        <Text style={styles.score}>Your Leaderboard</Text>

        <View style={styles.scrorebord} >
          <View style={styles.scrorebord}>
            <FontAwesome name="star" size={30} color="#FF6000" />
            <Text style={styles.score}>Score</Text>
          </View>
          <Text style={styles.score}>{score || 0}</Text>
        </View>

        <View style={styles.scrorebord} >
          <View style={styles.scrorebord} >
            <IonIcons name="stats-chart" size={30} color="#FF6000" />
            <Text style={styles.score}>Rank</Text>
          </View>
          <Text style={styles.score}>{position || 0}</Text>
        </View>

      </View>

      <TouchableOpacity style={styles.logoutbtn}  onPress={logout} >
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerInfo: {
    marginVertical: hp("5%"),
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000"
  },
  name: {
    fontSize: 23,
    fontWeight: "bold"
  },
  info: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
    marginTop: 10
  },
  quizzScoreContainer: {
    margin: wp("4%"),
    padding: wp("4%"),
    borderRadius: 10,
    backgroundColor: "#D6E4E5",
  },
  scrorebord: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10
  },
  logoutbtn: {
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: wp("90%"),
    alignSelf: "center"
  },
  logout: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "red"
  }
})

export default ProfileScreen