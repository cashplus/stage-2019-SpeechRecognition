import React from 'react'
import {Text, TextInput, Button, View} from 'react-native'


export default class Steps extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            action: this.props.navigation.state.params.action,
            nextStep:null,
            requirements: new Array(),
            response : this.props.navigation.state.params.respForSteps,
            text:null
        }
        resp = this.state.response;
        for(var key in resp){
            if(resp[key] == ""){
                this.state.requirements.push(key);
            }
        }
        console.log(this.state.requirements);
        this.state.nextStep = this.state.requirements.shift();
    }

    nextStep = () =>{
        currentAction = this.state.nextStep;
        this.state.response[currentAction] = this.state.text;
        this.setState({text:null})
        if(this.state.requirements.length !=0){
           this.setState({nextStep:this.state.requirements.shift()});
        }
        else{
            this.props.navigation.navigate("Summary",{
                action:this.state.action,
                response:this.state.response
            });
        }
    } 

    render(){
        return(
            <View>
                <Text>{this.state.nextStep}</Text>
                <TextInput value={this.state.text} onChangeText ={(text)=>{
                    this.setState({text})
                }}/>
                <Button title="next" onPress={this.nextStep}/>
            </View>
        );
    }
} 
