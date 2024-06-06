import axios from "axios"

// const API_URL = "http://192.168.0.147:3000"
const API_URL = "https://study-mate-1po2.onrender.com"
// const API_URL = "http://localhost:3000"

const client = axios.create({
    baseURL: API_URL,
})

const serverLogin=(user)=>{
    return new Promise(async (resolve, reject) => {
        try{
            const {data}=await client.post("/auth/login",{...user})
            resolve(data)

        }catch(error){  
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message) 
        }
    })
}
const fetchLeaderBoard = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get("/user/leaderboard", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            resolve(data)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}
const fetchUserTranscriptionHistory = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get("/user/history", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            console.log(data)
            resolve(data?.history || [] )
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}
const fetchYoutubeTranscription = (token, link) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post("/youtube/transcription",
                {
                    youtubeLink: link
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                }

            )
            resolve(data)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}

const fetchYoutubeLinkDetails = (token, link) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get(`youtube/link-details?youtubeLink=${link}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            resolve(data)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}
const fetchTranscriptionSummary = (token, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`/youtube/transcription-summary`,
                {
                    transcription_id: id
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            resolve(data)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}

const fetchQAs = (token, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`/youtube/transcription-qa`,
                {
                    transcription_id: id
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            resolve(data.qa)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}

const fetchUserChats = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get(`/chatgpt/user-chats`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            resolve(data[0]?.chatIds || [] )
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}

const fetchChatMessages = (token, chatId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get(`/chatgpt/${chatId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            resolve(data.chats)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}

const createNewUserChat = (token, title) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`/chatgpt/new-user-chat`,
                {
                    title
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            resolve(data.data)
        } catch (error) {
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}
const promptGPT = (token, chatId, messages) => {

    return new Promise(async (resolve, reject) => {
        try {

            //first remove all _id from messages
            messages = messages.map(message => {
                delete message._id
                return message
            })
            console.log(messages)
            const { data } = await client.post(`/chatgpt/prompt`,
                {
                    chatId,
                    messages
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            console.log(data)
            resolve(data.data)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}
const getDallEMessage = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get(`/dalle`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            const msg = data.messages
            const newMsgs = []
            //extract prompt and url from the object push to the newMsgs array as single object
            msg.forEach(message => {
                const prompt = message.prompt
                const url = message.url
                newMsgs.push({ prompt })
                newMsgs.push({ url })
            })
            resolve(newMsgs)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}

const promptDallE = (token, prompt) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`/dalle/prompt`,
                {
                    prompt
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })

            const url = data.url
            resolve(url)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}


const fetchQuizzQuestions = (token, tid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`youtube/transcription-quizz`,
                {
                    transcription_id: tid
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            resolve(data.questions)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}

const addScrolToUserLeaderboard = (token, score) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.post(`user/add-score-to-leaderboard`,
                {
                    score
                }
                , {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                })
            resolve(data)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })
}

const userLeaderboardDetail = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await client.get(`/user/leaderboard-details`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            resolve(data)
            console.log(data)
        } catch (error) {
            console.log("error", error)
            console.log(error?.response?.data || error.message)
            reject(error?.response?.data?.message || error.message)
        }
    })

}

export {
    serverLogin,
    fetchLeaderBoard,
    fetchUserTranscriptionHistory,
    fetchYoutubeTranscription,
    fetchYoutubeLinkDetails,
    fetchTranscriptionSummary,
    fetchQAs,
    fetchUserChats,
    fetchChatMessages,
    createNewUserChat,
    promptGPT,
    getDallEMessage, promptDallE,
    fetchQuizzQuestions,
    addScrolToUserLeaderboard,
    userLeaderboardDetail
}