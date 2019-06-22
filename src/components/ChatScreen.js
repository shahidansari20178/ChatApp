import React, {Component} from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, Dimensions, Alert, AsyncStorage
} from 'react-native';
import firebase from 'firebase'
import User from "./User";

export default class ChatScreen extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone')
            },
            textMessage: '',
            MessageList: [],
            isLoading: false
        }
    }
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('name', null)
        }

    }
    componentWillMount () {
        this.setState({isLoading: true})
        let dbref = firebase.database().ref("messages").child(User.phone).child(this.state.person.phone).on('child_added', (val) => {
                this.setState((prevState) => {
                    return {MessageList: [...prevState.MessageList, val.val()], isLoading: false}
                })
        })
    }

    handleChange = (key, value) => {
        this.setState({[key]: value})
    }
    sendMessage = async () => {
        debugger
        const {textMessage} = this.state
        let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
        let updates = {}
        let message = {
            message: textMessage,
            time: firebase.database.ServerValue.TIMESTAMP,
            from: User.phone
        }
        updates['messages/' + User.phone + '/' + this.state.person.phone + '/' + msgId] = message;
        updates['messages/' + this.state.person.phone + '/' + User.phone + '/' + msgId] = message;
        firebase.database().ref().update(updates);
        this.setState({textMessage: ''});
    }
    ConvertTime = (time) => {
        let d = new Date(time);
        let c = new Date()
        let result=(d.getHours() < 10? '0': '')+d.getHours()+':';
        result += (d.getMinutes() < 10? '0': '')+d.getMinutes();
        if(c.getDay() !== d.getDay()){
            result= d.getDay()+' '+d.getMonth()+ ' '+result;
        }
        return result;
    }
    renderRow = ({item}) => {
        return (
            <View style={{
                flexDirection: 'row',
                width:'60%',
                alignSelf: item.from===User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from===User.phone ? '#00897b' : '#7cb342',
                borderRadius:5,
                marginBottom:10
            }}>
                <Text style={{color:'#fff',padding:7,fontSize:16}}>{item.message}</Text>
                <Text style={{color:'#fff',padding:5,fontSize:12}}>{this.ConvertTime(item.time)}</Text>
            </View>
        )
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
        const {MessageList, isLoading, textMessage} = this.state
        const {height,width} = Dimensions.get('window')
        return (
            <SafeAreaView style={styles.container}>
                {isLoading &&
                <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center'}} size={'large'}/>}
                <FlatList
                    style={{padding:10,height:height * 0.8}}
                    renderItem={this.renderRow}
                    data={MessageList}
                    keyExtractor={(item,index)=> index.toString()}/>
                <View style={{flexDirection: 'row', marginTop: 10,paddingBottom:20,marginHorizontal:10}}>
                    <TextInput
                        placeholder={'Type Message ...'}
                        value={textMessage}
                        style={{flex: 3, borderWidth: 1, height: 35}}
                        onChangeText={(text) => this.handleChange('textMessage', text)}
                    />
                    <TouchableOpacity
                        style={{flex: 1, borderWidth: 1, height: 35, justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => this.sendMessage()}>
                        <Text>Send</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    }
});
