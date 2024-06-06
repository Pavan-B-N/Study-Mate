import { View, Text, StyleSheet, FlatList } from 'react-native'
import { useState, useEffect, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//api
import { fetchQAs } from "../services/api"
import { AppContext } from "../context/AppContext"

import LottieView from 'lottie-react-native';
import LoadingLottie from "../assets/lottie/loading.json"

const QAScreen = ({ route }) => {
  const { token } = useContext(AppContext)
  const { transcriptionId, title } = route.params

  const [QAs, setQAs] = useState([])
  const [loading, setLoading] = useState(false)

  const getQAs = async () => {
    try {
      setLoading(true)
      const data = await fetchQAs(token, transcriptionId)
      setQAs(data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    token && getQAs()
  }, [token])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
      <Text style={styles.header} >Q&A</Text>

      {
        loading ? (
          <View >
            <LottieView source={LoadingLottie} autoPlay loop height={200} width={200} />
          </View>
        ) : (
          <FlatList
            data={QAs}
            renderItem={({ item }) => <QAItem item={item} />}
            keyExtractor={item => item.id}
          />
        )
      }
    </View>
  )
}
const QAItem = ({ item }) => {
  console.log(item)
  return (
    <View style={styles.qaitem} >
      <Text style={styles.question}> {item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginVertical: wp("3%"),
    color: "teal",
  },
  qaitem:{
    marginVertical:wp("2%"),
    width:wp("95%"),
    padding:wp("2%"),
    borderRadius:wp("2%"),
    backgroundColor:"#FBF9F1"
  },
  question: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginBottom: wp("1%"),
  },
  answer: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    padding: wp("2%"),
  }
})

export default QAScreen