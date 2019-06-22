import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './src/components/HomeScreen'
import LoginScreen from './src/components/LoginScreen'
import ChatScreen from './src/components/ChatScreen'
import ProfileScreen from './src/components/ProfileScreen'
import AuthLoadingScreen from  './src/components/AuthLoadingScreen'

const AppStack = createStackNavigator({ Home: HomeScreen,Chat:ChatScreen,Profile:ProfileScreen });
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
));
