import { View, Text,TouchableOpacity,StyleSheet,ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const TranscriptionComponet = ({transcription,title,transcriptionId}) => {
  const navigation=useNavigation()
  return (
    <View>
      <View style={styles.header} >
        <Text style={styles.title} >{title}</Text>
        <TouchableOpacity style={styles.quizzbtn}
           onPress={()=>{
            navigation.navigate("QuizzScreen",{transcriptionId:transcriptionId,title:title})
          }}
        >
          <Text>quizz</Text>
        </TouchableOpacity>
      </View>

      {/* transcription */}
      <ScrollView style={styles.transcriptionContainer}
      >
        <Text style={styles.transcription} >{transcription}</Text>
      </ScrollView>

      {/* action buttons */}
      <View style={styles.actionbtnContainer} >
        <TouchableOpacity style={[styles.qabtn,styles.actionbtn]} 
           onPress={()=>{
            navigation.navigate("QAScreen",{transcriptionId:transcriptionId,title:title})
          }}
        >
          <Text style={styles.btnTxt} >Q&A</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[styles.summarizebtn,styles.actionbtn]} 
        onPress={()=>{
          navigation.navigate("SummaryScreen",{transcriptionId:transcriptionId,title:title})
        }}
        
        >
          <Text style={styles.btnTxt} >Summarize</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    header:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"start",
      margin:10
    },
    title:{
      fontSize:wp("5%"),
      fontWeight:"bold",
      color:"#F99417",
      width:wp("82%")
    },
    quizzbtn:{
      backgroundColor:"#9EC8B9",
      padding:5,
      borderRadius:3,
      height:hp("4%")
    },
    transcriptionContainer:{
      height:hp("80%"),
    },
    transcription:{
      fontSize:wp("4.2%"),
      fontWeight:"bold",
      lineHeight:wp("5%"),
      padding:10,
      paddingBottom:hp("5%")
    },
    actionbtnContainer:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      margin:10,
      marginTop:hp("2%"),
      height:hp("8%")
    },
    actionbtn:{
      padding:10,
      borderRadius:5,
      width:wp("45%"),
      alignItems:"center"
    },
    qabtn:{
      backgroundColor:"teal"
    },
    summarizebtn:{
      backgroundColor:"#F99417"
    },
    btnTxt:{
      color:"white",
      fontSize:wp("4%")
    }
  })

export default TranscriptionComponet