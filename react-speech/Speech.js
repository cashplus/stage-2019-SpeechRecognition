import React from 'react';
import {Button, StyleSheet, Text, View,TouchableOpacity,Image} from 'react-native';
import {Audio} from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import {createAppContainer, createStackNavigator} from 'react-navigation'
import axios from 'axios';
import Steps from "./Steps"
import Summary from './Summary'

class Speech extends React.Component {

    constructor(props){
        super(props);
        this.recording=null;
        this. state = {
            isRecording:false,
            transcription:null,
            respForSteps:null
        }
        this.timeOut = null;
        
    }

    startRecording = async () =>{
      const  RecordingOptions = {
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB,
          sampleRate: 16000,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 16000,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };
        const {status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (status !== 'granted'){
            console.log('Recording not granted!!');
            return('Recording not granted!!');
        }else{
            console.log('Recording granted');
            this.setState({isRecording:true});
            const recording = new Audio.Recording();
            try {
                await recording.prepareToRecordAsync(RecordingOptions);
                this.recording = recording;
                await this.recording.startAsync();
                // setting a time out for 8 seconds to stop recording
                this.timeOut = setInterval(this.stopRecording, 8000);
                console.log('Recording...')
                // You are now recording!
              } catch (error) {
                console.log(error);
                console.log('Could not Record');
                // An error occurred!
              }

        }
    }

    stopRecording = async ()=>{
        this.setState({isRecording:false})
        clearInterval(this.timeOut);
        try {
            // getting  the url of the audio
            const uri  = await FileSystem.readAsStringAsync(this.recording.getURI(),{encoding:FileSystem.EncodingType.Base64});
            //setting the audio file
            const audio = {
              content:uri
            };

            //setting the audio configuration to send to google speech api
            const config = {
              encoding: "AMR_WB",
              sampleRateHertz: 16000,
              languageCode: "ar-MA",
            };

            const request = {
              config: config,
              audio: audio
            }

            try {
              playSound = async () => {
              const urlSound = await FileSystem.getInfoAsync(this.recording.getURI());
              await Audio.setIsEnabledAsync(true);
              const sound = new Audio.Sound();
              await sound.loadAsync(urlSound);
              await sound.setPositionAsync(0);
              await sound.playAsync();
              // Your sound is playing!
              }
              //playSound();
            } catch (error) {
              console.log(error);
            }
            
            // url of google speech api 
            const url = "https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyD-o08CQL91vezbKziBXYn9BuC7tL9wrMk";

            if (this.recording._canRecord) {
              axios.request({
                url,
                method: "POST",
                data: request
              }).then(response => {
                this.setState({transcription:response.data.results.map(result => result.alternatives[0].transcript).join("\n")});
                console.log(`Transcription: ${this.state.transcription}`);
  
                // sending the transcript to python server
                if (this.state.transcription != null) {
                  serverUrl = "http://192.168.1.59:5000/takeDecision?text="+this.state.transcription;
                  axios.request({
                    url: serverUrl,
                    method:"POST"
                  }).then(response =>{
                    console.log("transcript send succesfull");
                    this.setState({respForSteps: response.data.properties});
                    resp = response.data.properties;
                    if (!response.data.valid){
                      this.props.navigation.navigate("Steps",{
                        respForSteps : resp,
                        action: response.data.action
                      })
                    }
                    else {
                      this.props.navigation.navigate("Summary",{
                        action: response.data.action,
                        response: resp
                      })
                    }
                  }).catch(err => {
                    console.log("err :", err);
                  });
                }
                
              }).catch(err => {
                console.log("err :", err);
              });
               // stop recording
              await this.recording.stopAndUnloadAsync();
              console.log('Recording stopped');
            }

   
          } catch (error) {
            // noop
            console.log('Recording could not be stopped');
            console.log(error)
          }
    }
    render(){
        return (
            <View style={styles.container}>
              <Text style={styles.transciption}>{this.state.transcription}</Text>
              <TouchableOpacity  onPressIn={this.startRecording} onPressOut={this.stopRecording}>
                  <Image source={require('./button.png')} />
                </TouchableOpacity>
            </View>
          );
    }
    

}

const appNavigator = createStackNavigator({
  Speech,
  Steps,
  Summary,
});

const styles = StyleSheet.create({
    start:{
        fontSize:20,
    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transciption:{
    fontSize:20,
    marginBottom:70
  }
});

export default createAppContainer(appNavigator);