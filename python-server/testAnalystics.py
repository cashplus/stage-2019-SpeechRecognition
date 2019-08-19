import nltk
import matplotlib.pyplot as plt
import arabic_reshaper
from bidi.algorithm import get_display
import re
import json
from flask import *
import uuid


class analyse():
    def __init__(self,text):
        self.text = text
        self.actions = json.load(open('actions.json','r',encoding='utf-8'))
        return super().__init__()

    def onAction(self,n):
        action = self.actions["modules"][n]
        valid = True
        if not action["valid"]:      
            for key in action["properties"]:
                prop = re.search(action["properties"][key]["rex"], self.text)
                if prop :
                      action["properties"][key]["value"] = prop.group()
                else: 
                    valid = False
        action["valid"] = valid
        
        return action
                

    def takeDecision(self):
        for i in range(0,len(self.actions["modules"])):
            for j in self.actions["modules"][i]["keyWords"]:
                if j in self.text:
                    return self.onAction(i)
        return "command non valid"


if __name__ == "__main__":
    app = Flask(__name__)
    @app.route('/takeDecision', methods=['post'])

    def takeDecision():
        text = request.args.get('text')
        print(text)
        analys = analyse(text)
        print(analys.takeDecision())
        return Response(response=json.dumps(analys.takeDecision()),status = 200,mimetype="application/json")
    


    app.run(host='0.0.0.0',port='5000') 



