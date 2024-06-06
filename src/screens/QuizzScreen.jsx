import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
//api
//api
import { fetchQuizzQuestions, addScrolToUserLeaderboard } from "../services/api"
import { AppContext } from "../context/AppContext"

import LottieView from 'lottie-react-native';
import loadingLottie from "../assets/lottie/loading.json"
import quizzCompletedLottie from "../assets/lottie/quizz-completed.json"

import Toast from 'react-native-toast-message';

const QuizzScreen = ({ route, navigation }) => {
  const { transcriptionId, title } = route.params

  const { token } = useContext(AppContext)


  const [questions, setQuestions] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current; // For the slide animation

  const [loading, setLoading] = useState(false);


  const getQuestions = async () => {
    try {
      const questions = await fetchQuizzQuestions(token, transcriptionId)
      setQuestions(questions)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { getQuestions() }, [])

  useEffect(() => {
    slideAnim.setValue(0);
  }, [currentQuestionIndex]);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      // Animate and move to the next question after a short delay
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      });
    }
  };

  const showToastMessage = (type, message) => {
    Toast.show({
      type: type,
      text1: message,
      position: 'top',
    });
  };

  const addScoreToLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await addScrolToUserLeaderboard(token, questions.length)
      setLoading(false)
      navigation.replace("HomeScreen")
    } catch (err) {
      setLoading(false)
      showToastMessage("error", "Something went wrong, try again")
      console.log(err)
    }

  }

  const transformStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(Dimensions.get('window').width * 0.7)], // Adjust the range for your desired animation
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={{ position: 'absolute', bottom: hp("2%"), alignSelf: "center", width: wp("90%"), zIndex: 1 }} >
        <Toast />
      </View>
      {
        questions ?
          (
            questions.length == 0 ? <Text>There are no questions</Text> :
              (
                (currentQuestionIndex < questions.length) ?
                  <View>
                    <Text style={styles.title} >{title}</Text>
                    <Text style={styles.questionCount}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
                    <Animated.View style={[styles.questionContainer, transformStyle]}>
                      <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleAnswer(option)}>
                          <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </Animated.View>
                  </View>
                  :
                  (
                    <View style={{ flex: 1, alignItems: "center" }} >
                      <LottieView source={quizzCompletedLottie} autoPlay loop={false} width={wp("70%")} height={wp("70%")} />

                      <View style={styles.scoreboard}  >
                        <Text style={styles.scoreboardText} >You gained a score of {questions.length}
                        </Text>
                      </View>

                      {
                        loading ?
                          (
                            <LottieView source={loadingLottie} autoPlay loop={true} width={wp("20%")} height={wp("20%")} />
                          )
                          :
                          (
                            <TouchableOpacity style={styles.leaderboardbtn} onPress={() => addScoreToLeaderboard()} >
                              <Text style={styles.leaderboardText} >Add score to leaderboard</Text>
                            </TouchableOpacity>
                          )
                      }
                    </View>
                  )
              )
          )
          :
          (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
              <LottieView source={loadingLottie} autoPlay loop={true} width={wp("20%")} height={wp("20%")} />
            </View>
          )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Change the background color as needed
  },
  title: {
    fontSize: wp("4%"),
    marginVertical: hp("2%"),
    marginHorizontal: hp("2%"),
    color: "#FF9843",
    fontWeight: "bold"
  },
  questionCount: {
    fontSize: wp("4%"),
    fontWeight: 'bold',
    marginBottom: 20,
    marginHorizontal: wp("2%"),
  },
  questionContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  questionText: {
    fontSize: hp("2.5%"),
    color: '#3D3B40',
    marginBottom: hp("2%"),
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2, // for Android
  },
  optionText: {
    textAlign: 'left',
    color: '#333',
    fontSize: 16,
  },
  scoreboard: {
    backgroundColor: '#FF9130',
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: '90%',
  },
  scoreboardText: {
    color: 'white',
    fontSize: wp("4%"),
    textAlign: 'center',
  },
  leaderboardbtn: {
    padding: 15,
    borderRadius: 5,
    marginVertical: hp("2%"),
    width: '60%',
    borderWidth: 1,
    borderRadius: 30,
  },
  leaderboardText: {
    fontSize: wp("4%"),
    textAlign: 'center',
  }
});

export default QuizzScreen;
