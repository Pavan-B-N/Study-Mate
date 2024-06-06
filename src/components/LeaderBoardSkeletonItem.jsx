import { View } from 'react-native'
//skeleton
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const LeaderBoardSkeletonItem = () => {
    return (
        <SkeletonPlaceholder borderRadius={4} speed={800*2} >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: wp('3%'), borderBottomWidth: 1, borderBottomColor: '#ddd', gap: wp('2%') ,marginBottom:hp("2%")}}>
                <View style={{ width: wp("10%"), height: wp("10%"), borderRadius: 50 }} />
                <View  >
                    <View style={{ width: wp("70%%"), height: wp("5%"), borderRadius: 4, marginBottom: hp("2%") }} />
                    <View style={{ width: wp("70%%"), height: wp("5%"), borderRadius: 4 }} />
                </View>
                <View>
                <View style={{ width: wp("8%"), height: wp("8%"), borderRadius: 5,marginBottom:hp("2%") }} />
                <View style={{ width: wp("8%"), height: wp("2%"), borderRadius: 5 }} />
                </View>
            </View>
        </SkeletonPlaceholder>
    )
}

export default LeaderBoardSkeletonItem