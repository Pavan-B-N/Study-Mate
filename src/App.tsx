// import all the screens here
import ChatGPTScreen from './screens/ChatGPTScreen';
import GPTChatScreen from './screens/GPTChatScreen';
import HomeScreen from './screens/HomeScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import QAScreen from './screens/QAScreen';
import QuizzScreen from './screens/QuizzScreen';
import SummaryScreen from './screens/SummaryScreen';
import TranscriptionScreen from './screens/TranscriptionScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import YoutubeScreen from './screens/YoutubeScreen';
import DallEScreen from './screens/DallEScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import { AppContextWrapper } from "./context/AppContext"

import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { useEffect } from 'react';


const App = () => {
  const requestWritePermission = () => {
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
              console.log(result);
            });
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log("Error occured while requesting permission")
      });

  }
  useEffect(() => {
    requestWritePermission()
  }, [])

  return (
    <AppContextWrapper>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='WelcomeScreen' screenOptions={{ headerShown: false }} >
          <Stack.Screen name="ChatGPTScreen" component={ChatGPTScreen} />
          <Stack.Screen name="GPTChatScreen" component={GPTChatScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="QAScreen" component={QAScreen} />
          <Stack.Screen name="QuizzScreen" component={QuizzScreen} />
          <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
          <Stack.Screen name="TranscriptionScreen" component={TranscriptionScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="YoutubeScreen" component={YoutubeScreen} />
          <Stack.Screen name="DallEScreen" component={DallEScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </AppContextWrapper>
  );
};
export default App;