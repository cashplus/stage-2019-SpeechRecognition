import nltk
import matplotlib.pyplot as plt
import arabic_reshaper
from bidi.algorithm import get_display
import re
from speech import *
import json
from flask import *
import uuid


class analyse():
    def __init__(self,text):
        self.text = text
        self.testCases = json.load(open('testCases.json','r',encoding='utf-8'))
        return super().__init__()
        
    
    def onVirement(self):
        virement = json.load(open('virement.json','r'))
        if not virement['valid']:
            missing = ''
            if virement["properties"]['montant'] == '':
                if re.search('\d+', self.text):
                    montant = [int(s) for s in str.split(self.text) if s.isdigit()]
                    virement["properties"]['montant'] = montant[0]
                else:
                    missing = missing+"montant " 

            if virement["properties"]['type'] == '':
                print("yes")
                if "درهم" in self.text :
                    virement["properties"]['type'] = 'DH'
                elif "ﺭﻳﺎﻝ" in self.text:
                    viremet["properties"]['type'] = 'CENTIME'
                else:
                    missing = missing+"type "
            
            if virement["properties"]['destinataire'] == '':
                missing = missing+"destinataire"
            
            if missing == '':
                virement['valid'] = True
            else: 
                virement["message"] = "the "+missing+" is missing"

        return virement
                

            
            


        

    def onRechargeTelephonique(self):
        def etape1():
            print("étape actuelle 0: -->étape suivante demande de la somme à rechargé")
            somme = int(input("entrer la somme souhaitée recharger: "))
            if somme % 10 == 0 or somme == 5:
                return etape2(somme)
            else:
                print("entrer un nombre valid.")
                return etape1()

        def etape2(somme):
            print("étape actuelle: 1 --> étape suivante demande d'opérateur")
            op =  int(input("Orange--> 0, IAM--> 1, INWI--> 2 :"))
            operateur = {
                0 : "Orange",
                1 : "IAM",
                2 : "INWI"
            }
            if op >= 0 and op <= 2:
                return etape3(operateur.get(op),somme)
            else:
                return etape2(somme)
        
        def etape3(operateur,somme):
            print("étape actuelle 2: -->étape suivante demande du numéro telephonique")
            numTele = int(input("entrer votre numéro telephonique: "))
            return "recharge telephonique de "+str(somme)+" dhs pour le numéro "+str(numTele)+ ", l'operateur "+operateur

        if re.search('\d+',self.text):
            somme = [int(s) for s in str.split(self.text) if s.isdigit()]
            if somme[0] % 10 == 0 or somme[0] == 5:
                return etape2(somme[0])
            else:
                print("entrer un nombre valid.")
                return etape1()
        else:
            return etape1()

    def onConsultationPoint(self):
        pass
    
    def onConversionPoint(self):
        pass
    
    def onLocalisationAgence(self):
        pass
    
    def onHistoriqueTrans(self):
        pass

    def takeDecision(self):
        for i in self.testCases["virement"]:
            if i in self.text:
                return self.onVirement()
        for i in self.testCases["rechargeTelephonique"]:
            if i in self.text:
                return self.onRechargeTelephonique()
        for i in self.testCases["consultationPoint"]:
            if i in self.text:
                return self.onConsultationPoint()
        for i in self.testCases["conversionPoint"]:
            if i in self.text:
                return self.onConversionPoint()
        for i in self.testCases["localisationAgence"]:
            if i in self.text:
                return self.onLocalisationAgence()
        for i in self.testCases["historiqueTrans"]:
            if i in self.text:
                return self.onHistoriqueTrans()
        return "command non valid."


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



