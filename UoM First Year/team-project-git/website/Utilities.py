from flask import current_app,render_template
from flask_mail import Mail,Message
from random import randint
from hashlib import sha256
import json
import website.databaseHandler as db
import re

def ValidOrgName(orgname):
    """returns True if username is valid"""
    if len(orgname)>0:
        return True 
    return False

def ValidPassword(password):
    """returns True if password is valid"""
    ## password must contain   one lower case letter
                            ## one upper case letter
                            ## one digit
    pattern = re.compile( r"((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,})")

    if(pattern.fullmatch(password)):
        return True
    else:
        return False
  



def ValidEmail(email):
    ## email format: 
            ## at least one letter or number 
            ## any number of special characters
            ## at least one letter or number
            ## an @ symbol
            ## at least on letter or numbers 
            ## a . symbol
            ## at least one letter or number
              
    pattern=re.compile(r"([a-zA-Z0-9]+[.-_*\/;:'#+]*[a-zA-Z0-9]+@[a-zA-z0-9]+[.]+[a-zA-Z0-9]+)")
    if(pattern.fullmatch(email)):
        return True
    else:
        return False




def isMatch(filterdata,values):
    for field in filterdata.keys():
        if not field in values.keys():
            return False
        if isinstance(values[field], int):
            values[field] = [values[field]]
        if not filterdata[field] in values[field]:
            return False
    return True


def Filter(filter,table):

    matches=[]

    for record in table:

        ## adds a record if it matches our filter     
        if(isMatch(filter,record)):
            matches.append(record)
                
    return matches


def JSONtostring(filename):
    with open(filename ,"r") as file:
     data= file.read()
    return data  

def Hash(string):
    return sha256(string.encode()).hexdigest()



def GetOrgFromEmail(email):

    ## get list of org from db 
    organisations = json.loads(db.GetAllPrivateOrganisationData())["Content"]
    
    ## filter orgs using email
    organisations = Filter({"Email":email},organisations)

    ## if no orgs matching email return False
    if(len(organisations)==0):
        return False
    
    ## otherwise return the org matching email, there should only be one
    return organisations[0]



def GeneratePin(length):
    pin=""
    for i in range(length):
        pin+= str(randint(0,9))
    return pin




def SendEmail(subject,body, recipients,html=None):
    mail = Mail(current_app)

    message= Message(subject,sender=current_app.config["MAIL_USERNAME"],recipients=recipients)
        
    message.body=body
    if html:
        message.html=html
    mail.send(message)
    return "success"


def ReadTextFile(filename):
    with open(filename,"r") as file:
        text=file.read()

    return text







