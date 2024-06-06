import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//api
import { fetchTranscriptionSummary } from "../services/api"
import { AppContext } from "../context/AppContext"

import LottieView from 'lottie-react-native';
import LoadingLottie from "../assets/lottie/loading.json"

const SummaryScreen = ({ route }) => {
  const { token } = useContext(AppContext)
  const { transcriptionId, title } = route.params

  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)

  const getSummary = async () => {
    try {
      setLoading(true)
      const data = await fetchTranscriptionSummary(token, transcriptionId)
      setSummary(data.summary)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    token && getSummary()
  }, [token])

  return (
    <View  >
      <Text style={styles.screenHeader} >Summary</Text>
      <Text style={styles.title} >{title}</Text>
      {
        loading ? (
          <View style={{ alignSelf: "center" }} >
            <LottieView source={LoadingLottie} autoPlay loop height={wp("30%")} width={wp("30%")} />
          </View>
        ) : (
          <ScrollView>
            <Text style={styles.summary} >{summary}</Text>
          </ScrollView>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  screenHeader: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#F99417",
    margin: wp("3%")
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#190482",
    margin: wp("3%")
  },
  summary: {
    fontSize:wp("4.2%"),
    fontWeight:"bold",
    lineHeight:wp("5%"),
    padding:10,
    paddingBottom:hp("5%")
  }
})

export default SummaryScreen