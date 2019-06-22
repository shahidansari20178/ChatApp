import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import User from '../components/User'
import firebase from 'firebase'
export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        User.phone = await AsyncStorage.getItem('phone');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
    };
componentWillMount () {
    const firebaseConfig = {
        apiKey: "AIzaSyBi6era4zLzwfM3hMUDH3JbCF9f6-woovo",
        authDomain: "chatapp-1c19f.firebaseapp.com",
        databaseURL: "https://chatapp-1c19f.firebaseio.com",
        projectId: "chatapp-1c19f",
        storageBucket: "",
        messagingSenderId: "83394557742",
        appId: "1:83394557742:web:a6706b7998ef5083"
    };
    firebase.initializeApp(firebaseConfig)
}
    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
