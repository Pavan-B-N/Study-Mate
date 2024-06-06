import { View } from 'react-native'
//skeleton
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ChatHistoryItemSkeleton = () => {
    return (
        <SkeletonPlaceholder borderRadius={4} speed={800 * 2} >
            <View style={{  alignItems: 'center', justifyContent: 'space-between', gap: wp("2%"), margin: hp("2%") }}>
                <View style={{ width: wp("90%"), height: hp("8%"),borderRadius:10 }} />
            </View>
        </SkeletonPlaceholder>
    )
}

export default ChatHistoryItemSkeleton