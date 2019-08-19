import React from 'react'
import {Text, TextInput, Button, View,StyleSheet, TouchableOpacity} from 'react-native'



export default class Steps extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            action: this.props.navigation.state.params.action,
            nextStep:null,
            requirements: new Array(),
            response : this.props.navigation.state.params.respForSteps,
            text:null,
            rex:null,
        }
        resp = this.state.response;
        for(var key in resp){
            if(resp[key]["value"] == ""){
                this.state.requirements.push(key);
            }
        }
        if (this.state.requirements.length > 0){
            console.log(this.state.requirements);
            this.state.nextStep = this.state.requirements.shift();
            this.state.rex = this.state.response[this.state.nextStep]["rex"];
        }
        else{
            this.props.navigation.navigate("Summary",{
                action:this.state.action,
                response:this.state.response
            });
        }
    
    }

    nextStep = () =>{
        const condition = new RegExp(this.state.rex);
        console.log(condition.test(this.state.text));
        if (condition.test(this.state.text)){
            currentAction = this.state.nextStep;
            this.state.response[currentAction]["value"] = this.state.text;
            this.setState({text:null})
            if(this.state.requirements.length !=0){
                nextStep = this.state.requirements.shift()
               this.setState({nextStep});
               this.setState({rex:this.state.response[nextStep]["rex"]})
            }
            else{
                this.props.navigation.navigate("Summary",{
                    action:this.state.action,
                    response:this.state.response
                });
            }
        }

    } 

    render(){
        return(
            <View style={styles.container}>
                <Text>{this.state.nextStep}</Text>
                <TextInput  style={styles.input} value={this.state.text} onChangeText ={(text)=>{this.setState({text})}}/>
                <TouchableOpacity onPress={this.nextStep} style={styles.nextButton}><Text>next</Text></TouchableOpacity>
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    nextButton:{
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    container: {
        flex: 1,
        marginTop:70,
        paddingHorizontal: 50
    },
    input:{
        marginTop:10,
        marginBottom:10,
        borderColor: '#666666',
        borderWidth: 1,
        borderRadius:3,
        padding:5
    }
});
