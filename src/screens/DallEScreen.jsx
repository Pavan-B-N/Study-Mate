import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions, Keyboard } from 'react-native'
import { useState, useEffect, useContext, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//icon
import IonIcons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
//api
import { getDallEMessage, promptDallE } from "../services/api"
import { AppContext } from "../context/AppContext"

import LottieView from 'lottie-react-native';
//import lottie
import waveLottie from "../assets/lottie/wave-loading.json"
import loadingLottie from "../assets/lottie/loading.json"

//import mic images
import micIcon from "../assets/images/mic.png"
import micListeningIcon from "../assets/images/listening.gif"
import volumeImg from "../assets/images/volume.png"
import volumeMuteImg from "../assets/images/volume-mute.png"

import RNFetchBlob from "rn-fetch-blob"
import Toast from 'react-native-toast-message';


const DallEScreen = () => {
    const { token } = useContext(AppContext)

    const [messages, setMessages] = useState(null)
    const [text, setText] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const [listening, setListening] = useState(false)
    const [speaking, setSpeaking] = useState(false)
    const [speakingEnabled, setSpeakingEnabled] = useState(true)

    const [flatListHeight, setFlatListHeight] = useState();
    const flatlistRef = useRef(null);

    const prompt = async () => {
        messages ? setMessages(pre => [...pre, { prompt: text }]) : setMessages([{ prompt: text }])
        setText("")
        try {
            setLoading(true)
            const url = await promptDallE(token, text)
            setLoading(false)
            console.log("url", url)
            messages && setMessages(pre => [...pre, { url }])
        } catch (err) {
            setMessages(pre => [...pre, { error: "Something went wrong" }])
            setLoading(false)
        }
    }
    const getMessages = async () => {
        try {
            setLoading(true)
            const data = await getDallEMessage(token)
            setMessages(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setError(true)
            setLoading(false)
        }
    }

    const srollToBottom = () => {
        if (flatlistRef && flatlistRef.current) {
            setTimeout(() => {
                flatlistRef.current.scrollToEnd({ animated: true })
            }, 500)
        }
    }
    useEffect(() => {
        srollToBottom()
    }, [messages])

    useEffect(() => {
        token && getMessages()
    }, [token])



    const startSpeaking = () => {
        if (speakingEnabled) {
            setSpeaking(true)
        }
    }
    const stopSpeaking = () => {
        setSpeaking(false)
    }
    const startListening = () => {
        setListening(true)

    }
    const stopListening = () => {
        setListening(false)

    }
    const enableSpeaking = () => {
        setSpeakingEnabled(true)

    }
    const disableSpeaking = () => {
        setSpeakingEnabled(false)

    }

    useEffect(() => {
        const h = Dimensions.get('window').height
        setFlatListHeight(h * 0.7)
    }, [])

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => _keyboardDidShow(e)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => _keyboardDidHide()
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const _keyboardDidShow = (e) => {
        const keyboardHeight = e.endCoordinates.height;
        const windowHeight = Dimensions.get('window').height;
        const bottomSpace = windowHeight - keyboardHeight;
        setFlatListHeight(bottomSpace * 0.55);
    };

    const _keyboardDidHide = () => {
        const windowHeight = Dimensions.get('window').height;
        setFlatListHeight(windowHeight * 0.7);
    };

    return (
        <View style={styles.container} >
            <View style={{ position: 'absolute', top: hp("2%"), alignSelf: "center", width: wp("90%"), zIndex: 1 }} >
                <Toast />
            </View>

            <Text style={styles.title} >DallE</Text>
            <View style={[styles.chatConatiner, { height: flatListHeight }]}>
                {
                    !messages ?
                        (
                            !error ?
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
                                    <LottieView source={loadingLottie} autoPlay loop style={{ width: wp("25%"), height: hp("10%") }} />
                                    <Text>Fetching your chats..</Text>
                                </View>
                                :
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} >
                                    <Text>Something went wrong</Text>
                                </View>
                        )
                        :
                        (
                            messages.length == 0 ?
                                <View style={styles.nomsgs} >
                                    <Text style={{ textAlign: "center" }} >No messages</Text>
                                </View>
                                :
                                <View
                                // style={{ height: flatListHeight }}
                                >

                                    <FlatList
                                        ref={flatlistRef}
                                        data={messages}
                                        renderItem={({ item }) => <MessageItem item={item} />}
                                        ListFooterComponent={() => {
                                            return (
                                                loading &&
                                                <View style={{ marginLeft: wp("2%") }} >
                                                    <LottieView source={waveLottie} autoPlay loop style={{ width: wp("20%"), height: hp("10%") }} />
                                                </View>
                                            )
                                        }}
                                    />

                                </View>
                        )
                }
            </View>


            <View style={styles.inputContainer}>
                <TextInput placeholder="Prompt" style={styles.input}
                    value={text}
                    onChangeText={(text) => setText(text)}

                />
                <TouchableOpacity
                    onPress={prompt}
                    disabled={loading}
                >
                    <IonIcons name='send' size={30} color={loading ? "gray" : "teal"} />
                </TouchableOpacity>
            </View>

            {/* bottomSection */}

            <View style={styles.bottomSection}>
                {/* actions section */}
                <View style={styles.actions}>
                    <View>
                        {
                            speaking &&
                            <TouchableOpacity style={styles.stopBtn} >
                                <Text style={styles.stopBtnText} onPress={stopSpeaking} >Stop</Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <View>
                        {
                            listening ?
                                <TouchableOpacity onPress={stopListening}>
                                    <Image source={micListeningIcon} style={styles.micIcon} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={startListening}>
                                    <Image source={micIcon} style={styles.micIcon} />
                                </TouchableOpacity>
                        }
                    </View>

                    <View>
                        {
                            speakingEnabled ?
                                <TouchableOpacity onPress={disableSpeaking}>
                                    <Image source={volumeImg} style={styles.volumeIcon} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={enableSpeaking}>
                                    <Image source={volumeMuteImg} style={styles.volumeIcon} />
                                </TouchableOpacity>
                        }
                    </View>

                </View>
            </View>

        </View>
    )
}
const MessageItem = ({ item }) => {
    const { prompt, url, error } = item
    const showToastMessage = (type, message) => {
        Toast.show({
            type: type,
            text1: message,
            position: 'top',
        });
    };

    const downloadFile = (url) => {
        showToastMessage("info", "Downloading file")
        let dirs = RNFetchBlob.fs.dirs;
        const filePath = dirs.DownloadDir + "/" + Date.now() + ".jpg"
        const fileName = Date.now() + ".jpg"
        RNFetchBlob.
            config({
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    mediaScannable: true,
                    title: fileName,
                    path: filePath,
                },
            })
            .fetch("GET", url)
            .then((res) => {
                showToastMessage("success", "File downloaded  successfully, check your gallary ")
                console.log("The file saved to ", res.path());
            }).catch((err) => {
                showToastMessage("error", "Something went wrong")
                console.log(err)
            })
    }

    return (
        <View>
            {
                prompt ?
                    <Text style={styles.userMsg}>{prompt}</Text>
                    :
                    (
                        error ?
                            <Text style={styles.errMsg}>Something went wrong</Text>
                            :
                            <View style={styles.imgConatiner}>
                                <Image source={{ uri: url }} style={[styles.botMsg]} />
                                <TouchableOpacity style={styles.downloadbtn}
                                    onPress={() => downloadFile(url)}

                                >
                                    <FontAwesome name="arrow-down" size={13} />
                                </TouchableOpacity>
                            </View>
                    )
            }
        </View >


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",

    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
        color: "teal"
    },
    chatConatiner: {
        backgroundColor: "#EEF5FF",
    },
    userMsg: {
        backgroundColor: "#FB7813",
        color: "#fff",
        padding: 10,
        margin: 10,
        borderRadius: 10,
        alignSelf: "flex-end"
    },
    errMsg: {
        backgroundColor: "#FF004D",
        color: "#fff",
        padding: 10,
        margin: 10,
        borderRadius: 10,
        alignSelf: "flex-start"
    },
    botMsg: {
        margin: wp("2%"),
        borderRadius: 10,
        alignSelf: "flex-start",
        width: wp("70%"),
        height: hp("32%"),
        borderRadius: 10,
    },
    nomsgs: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: wp("100%")

    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: hp("2%"),
        marginHorizontal: hp("2%")
    },
    input: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 10,
        width: wp("80%"),
        padding: 7,
    },
    bottomSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: wp("100%"),
        padding: wp("3%"),
    },
    stopBtnText: {
        color: "red"
    },
    micIcon: {
        width: wp("15%"),
        height: wp("15%"),
        resizeMode: "contain"
    },
    volumeIcon: {
        width: wp("10%"),
        height: wp("10%")
    },
    imgConatiner: {
        flexDirection: "row",
        alignItems: "center",

    },
    downloadbtn: {
        padding: wp("2%"),
        backgroundColor: "#FBF9F1",
        borderRadius: 100,
    }

})


export default DallEScreen