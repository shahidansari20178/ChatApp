import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import User from '../components/User'
import firebase from 'firebase'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            isLoading: false
        }
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: "Chat Friend",
            headerRight: (
                <TouchableOpacity
                    onPress={()=> navigation.navigate('Profile')}
                >
                    <Image style={{height: 32, width: 32,marginRight:7}} source={require('../resources/images/profile.png')}/>
                </TouchableOpacity>
            )
        }

    }

    componentWillMount() {
        let dbref = firebase.database().ref("users");
        this.setState({isLoading: true})
        dbref.on('child_added', (val) => {
            let person = val.val()
            person.phone = val.key
            if (User.phone === person.phone) {
                User.name = person.name
            } else {
                this.setState((prevState) => {
                    return {users: [...prevState.users, person], isLoading: false}
                })
            }

        })
    }

    logout = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Auth');
    }
    renderRow = ({item}) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{borderWidth: 1, borderColor: '#ccc', padding: 10}}>
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {users, isLoading} = this.state
        return (
            <SafeAreaView style={styles.container}>
                {isLoading &&
                <ActivityIndicator style={{position: 'absolute', marginLeft: 180, justifyContent: 'center'}}
                                   size={'large'}/>}
                <FlatList
                    renderItem={this.renderRow}
                    data={users}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
