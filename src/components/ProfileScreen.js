import React from 'react';
import {
    ActivityIndicator,
    Alert,
    AsyncStorage,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import User from '../components/User'
import firebase from 'firebase'

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            name: User.name,
            isLoading: false
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Profile'
        }

    }

    logout = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Auth');
    }
    handleChange = (key, value) => {
        this.setState({[key]: value})
    }
    ChangeName = async () => {
        debugger
        const { name} = this.state
        if (name.lenght < 3) {
            debugger
            Alert.alert("Error", 'Please enter name')
        } else if (User.name !== this.state.name) {
            User.name = name
            firebase.database().ref('users').child(User.phone).set({name: name})
            Alert.alert("Success", 'Name change Successfully')
        }


    }

    render() {
        const {name, isLoading} = this.state
        return (
            <SafeAreaView style={styles.container}>
                {isLoading &&
                <ActivityIndicator style={{position: 'absolute', marginLeft: 180, justifyContent: 'center'}}/>}
                <Text>{User.phone}</Text>
                <TextInput
                    placeholder={'Enter Your name'}
                    value={name}
                    onChangeText={(text) => this.handleChange('name', text)}
                />
                <TouchableOpacity onPress={() => this.ChangeName()}>
                    <Text>Change Name</Text>
                </TouchableOpacity><TouchableOpacity onPress={() => this.logout()}>
                <Text>Logout</Text>
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
