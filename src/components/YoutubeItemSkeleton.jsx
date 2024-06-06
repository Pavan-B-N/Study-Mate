import { View } from 'react-native'
//skeleton
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const YoutubeItemSkeleton = () => {
    return (
        <SkeletonPlaceholder borderRadius={4} speed={800 * 2} >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',gap:wp("2%") ,margin:hp("2%")}}>
                <View style={{ width: wp("20%"),height:hp("10%") }} />
                <View>
                    <View style={{ height: hp("4%"),width: wp("70%"),marginBottom:hp("1%")}} />
                    <View style={{ height: hp("3%") ,width: wp("60%")}} />
                </View>
            </View>
        </SkeletonPlaceholder>
    )
}

export default YoutubeItemSkeleton