import { View, Text, FlatList, StyleSheet, RefreshControl, Image } from 'react-native'
import { useEffect, useState, useContext } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import LeaderboardItem from '../components/LeaderboardItem'

//api call
import { fetchLeaderBoard } from "../services/api"
import { AppContext } from "../context/AppContext"

import somethingWentWrong from "../assets/images/something-went-wrong.png"


import LeaderBoardSkeletonItem from '../components/LeaderBoardSkeletonItem';
const LeaderboardScreen = () => {
  const { token } = useContext(AppContext)
  const [leaderboard, setLeaderboard] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const getLeaderboard = async (token) => {
    try {
      setLoading(true)
      const data = await fetchLeaderBoard(token)
      setLeaderboard(data)
      setLoading(false)
    } catch (err) {
      setError(true)
      console.log("error", err)
    }
  }

  useEffect(() => {
    token && getLeaderboard(token)
  }, [token])

  return (
    <View style={{flex:1,backgroundColor:"white"}} >
      <Text style={styles.leaderboardHeader} >Leaderboard</Text>

      {
        leaderboard === null ?
          (
            error ?
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                <Image source={somethingWentWrong} style={{ height: wp("70%"), width: wp("70%") }} />
                <Text style={{ fontSize: wp("3.5%"), fontWeight: "bold", textAlign: "center" }} >Something went wrong, please try again later</Text>
              </View>
              :
              <View>
                <LeaderBoardSkeletonItem />
                <LeaderBoardSkeletonItem />
                <LeaderBoardSkeletonItem />
                <LeaderBoardSkeletonItem />
                <LeaderBoardSkeletonItem />
              </View>
          )

          :
          (
            leaderboard.length > 0 ?
              <FlatList
                data={leaderboard}
                renderItem={({ item, index }) => (
                  <LeaderboardItem item={item} index={index} />
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => getLeaderboard(token)}
                  />
                }
                keyExtractor={item => item._id}
              />
              :
              <View >
                <Text style={{ textAlign: "center" }}>No Data Found</Text>
              </View>
          )
      }


    </View>
  )
}

const styles = StyleSheet.create({
  leaderboardHeader: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#F99417",
    margin: wp("3%")
  }
})

export default LeaderboardScreen