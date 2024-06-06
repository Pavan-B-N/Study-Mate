import { View, Text, Image, StyleSheet ,TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { useNavigation } from '@react-navigation/native';

const Card = ({ srcImg, titel, desc, backgroundColor,route }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={()=> navigation.navigate(route)} >
            <View style={[styles.card, { backgroundColor }]} >
            <View style={styles.cardHeader} >
                <Image source={srcImg} style={styles.cardImg} />
                <Text style={styles.cardTitel} >{titel}</Text>
            </View>
            <View style={styles.cardText} >
                <Text style={styles.cardDesc} >{desc}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        alignItems: "start",
        padding: wp("2%"),
        margin: wp("2%"),
        borderRadius: 10,
    },
    cardHeader:{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    cardImg: {
        width: wp("13%"),
        height: wp("10%"),
        resizeMode: "contain"
    },
    cardText: {
        padding: 10,
    },
    cardTitel: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#393646",
    },
    cardDesc: {
        fontSize: 14,
        color: "#232D3F",
        width: wp("90%"),
    }
})
export default Card;