import React from 'react'
import {Text, TextInput, Button, View,TouchableOpacity, StyleSheet} from 'react-native'

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
            this.state.summary ="virement de "+this.state.response.montant.value+" "+this.state.response.type.value+" destinée à "+this.state.response.destinataire.value
        }
        else if(this.state.action == "rechargeTelephonique"){
            this.state.summary = "recharge telephonique de "+this.state.response.montant.value+" Dhs d' "+this.state.response.operateur.value+" effectuée au numéro "+this.state.response.numero.value
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
            <View style={styles.container}>
                <Text>{this.state.summary}</Text>
                <TouchableOpacity style={styles.button} onPress={this.confirm}><Text>confirmer</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.annuler}><Text>annuler</Text></TouchableOpacity>
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    button:{
        marginTop:20,
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
    },
    container: {
        flex: 1,
        marginTop:70,
        paddingHorizontal: 50
    }
})
