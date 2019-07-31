import speech_recognition as sr
import arabic_reshaper
from bidi.algorithm import get_display
# obtain path to "english.wav" in the same folder as this script
from os import path

class speech():
    def __init__(self,):
        self.r = sr.Recognizer()
        return super().__init__()

    def audioFileReader(self):
        AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "sound\\recharge.wav")
        # use the audio file as the audio source
        with sr.AudioFile(AUDIO_FILE) as source:
            audio = self.r.record(source)  # read the entire audio file
        return audio

    def microphoneReader(self):
        with sr.Microphone() as source:
            print('Say Something:') 
            audio = self.r.listen(source)
            print ('Done!')
        return audio 
    
    def getSpeech(self):
            try:
                # for testing purposes, we're just using the default API key
                # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
                # instead of `r.recognize_google(audio)`
                audio = self.audioFileReader()
                reshaped_text = get_display(arabic_reshaper.reshape(self.r.recognize_google(audio,language="ar-MA")))
                print("Google Speech Recognition thinks you said: " +reshaped_text )
                #return self.r.recognize_google(audio,language="ar-MA")
                return "شارجي"
            except sr.UnknownValueError as e:
                print("Google Speech Recognition could not understand audio")
                return e
            except sr.RequestError as e:
                print("Could not request results from Google Speech Recognition service; {0}".format(e))
                return e

'''             
if __name__ == "__main__":
    # recognize speech using Google Speech Recognition
    try:
        # for testing purposes, we're just using the default API key
        # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
        # instead of `r.recognize_google(audio)`
        r = sr.Recognizer()
        speech = speech()
        audio = speech.microphoneReader()
        text = r.recognize_google(audio,language="ar-MA")
        reshaped_text = get_display(arabic_reshaper.reshape(text))
        print("Google Speech Recognition thinks you said:" +reshaped_text )
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
'''



