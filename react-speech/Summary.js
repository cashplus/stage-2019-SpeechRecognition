import React from 'react'
import {Text, TextInput, Button, View} from 'react-native'

export default class Summary extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            response:this.props.navigation.state.params.response,
            action: this.props.navigation.state.params.action,
            summary: null
        }
        this.summary()
    }
    summary = ()=>{
        if(this.state.action == "virement"){
            this.state.summary ="virement de "+this.state.response.montant+" "+this.state.response.type+" destinée à "+this.state.response.destinataire
        }
    }

    confirm = ()=>{
        this.props.navigation.navigate("Speech")
    }

    annuler = ()=>{
        this.props.navigation.navigate("Speech")
    }
    
    render(){
        return(
            <View>
                <Text>{this.state.summary}</Text>
                <Button title="confimer" onPress={this.confirm}/>
                <Button title="annuler" onPress={this.annuler}/>
            </View>
        );
    }
} 
