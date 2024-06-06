import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
const HistoryItem = ({ item }) => {
    const navigation = useNavigation()
    return (
       <TouchableOpacity onPress={() => navigation.navigate("TranscriptionScreen",{link:item.link,title:item.title,description:item.description,thumbnail:item.thumbnail})} >
         <View style={styles.container} >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text style={styles.title}  >{item.title.length>70 ? item.title.slice(0, 70) : item.title}</Text>
                <Text style={styles.description} >{item.description.length>100 ? item.description.slice(0, 100)+"..." : item.description}</Text>
            </View>
        </View>
         </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: wp("2%"),
        margin: wp("2%"),
        padding: wp("2%"),
        backgroundColor: '#176B87',
        borderRadius: 10,
    },
    thumbnail: {
        width: wp("20%"),
        height: wp("20%"),
    },
    title:{
        width: wp("70%"),
        fontSize: wp("4%"),
        fontWeight: 'bold',
        color:"#F8FAE5"
    },
    description:{
        width: wp("70%"),
        fontSize: wp("3%"),
        color:"#FBF6EE"
    },
})

export default HistoryItem