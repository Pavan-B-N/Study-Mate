import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LeaderboardItem = ({ item, index }) => {
    return (
        <View style={styles.LeaderboardItem} >
            <Text style={styles.index} >{index + 1}</Text>
            <Image source={{ uri: item.user_id.photo }} style={styles.avatar} />
            <View style={styles.userinfo} >
                <Text style={styles.name} >{item.user_id.name}</Text>
                <Text style={styles.email} >{item.user_id.email}</Text>
            </View>
            <View>
            <Text style={styles.score} >{item.score}</Text>
            <Text>score</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    LeaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp('3%'),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        gap: wp('2%')
    },
    index: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666'
    },
    avatar: {
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: 100
    },
    userinfo: {
        flex: 1,
        marginHorizontal: 10
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    email: {
        fontSize: 16,
        color: '#666'
    },
    score: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F99417'
    }
})

export default LeaderboardItem