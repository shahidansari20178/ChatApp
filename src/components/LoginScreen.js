import React from 'react';
import {Alert, AsyncStorage, StyleSheet, Text, TextInput, TouchableOpacity, View,SafeAreaView} from 'react-native';
import User from '../components/User'
import firebase from 'firebase'
export default class App extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            phone: "",
            name: ""
        }
    }

    handleChange = (key, value) => {
        this.setState({[key]: value})
    }
    onSubmit = async () => {
        debugger
        const {phone, name} = this.state
        if (phone.lenght < 10) {
            Alert.alert("Error", 'Please enter correct phone no')
        } else if (name < 3) {
            Alert.alert("Error", 'Please enter name')
        } else {
            await AsyncStorage.setItem('phone', phone).then(() => {
                this.setState({phone: '', name: ''})
            })
            User.phone = phone
            firebase.database().ref('users/'+User.phone).set({name:name})
            this.props.navigation.navigate('App' );

        }
    }

    render() {
        const {phone, name} = this.state
        return (
            <SafeAreaView style={styles.container}>
                <TextInput
                    placeholder={'Enter Your phone '}
                    value={phone}
                    keyboardType={'number-pad'}
                    onChangeText={(text) => this.handleChange('phone', text)}
                />
                <TextInput
                    placeholder={'Enter Your name'}
                    value={name}
                    onChangeText={(text) => this.handleChange('name', text)}
                />
                <TouchableOpacity onPress={() => this.onSubmit()}>
                    <Text>Enter</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
