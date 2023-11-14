from flask import Blueprint,request,render_template, current_app, session, url_for
import json

import website.databaseHandler as db
from .ErrorHandler import HandleError
from functools import wraps
from .Utilities import *


authentication= Blueprint("authentication", __name__)
to_be_verified=[]

@authentication.route("/login",methods=["POST"])
@HandleError
def login():
    
    
    ## checks user is not already logged in 
    if not session.get("logged_in"):

        email = request.json["email"] 

        hashedpassword=Hash(request.json["password"])

        ## gets all organisations 
        organisations = json.loads(db.GetAllPrivateOrganisationData())["Content"]

        ## returns list of organisations that match email given 
        org = Filter({"Email":email},organisations) 

        ## if no organisation that matches email
        if(len(org)==0):
            return {"status":"error",
                    "error":"User Does Not Exist"}
        
        ## from list of accounts that match email picks first 
        ## NOTE there should only be one that matches
        org = org[0]
        
        # Check if username and password matches
        if org["SshPassword"] == hashedpassword:

            session["logged_in"] = org["OrganisationID"]  ## Save organisation id in database to logged_in 

            return {"status":"success",
                    "OrganisationID":org["OrganisationID"]}
        else:
            return {"status":"error",
                    "error":"The username or password entered were incorrect"}
        
    else:
        return {"status":"error",
                "error":"Already Logged In"}
    


@authentication.route("/org_signup", methods=["POST"])
@HandleError
def org_signup():

    ## checks user not already logged in 
    if not (session.get("logged_in")):

        ## get data from json 
        orgname=request.json["username"]
        password= request.json["password"]
        confirmpassword = request.json["confirmpassword"]
        email =request.json["email"]

        
        
        ## Validation Checks
        ## if one of the validation checks fails 
        ## return the sign up page with appropriate error message

        if not ValidOrgName(orgname):
            return {"status":"error",
                    "error":"Username Invalid"}
        
        if not ValidPassword(password):
            return {"status":"error",
                    "error":"Password Invalid"}
        
        if password!=confirmpassword:
            return {"status":"error",
                "error":"Passwords do not match"}  
        
        if not ValidEmail(email):
            return {"status":"error",
                "error":"Email is not valid"}
        
        if not UniqueEmail(email):
            return {"status":"error",
                "error":"Email is not unique"} 
        

        hashedpassword=Hash(password)  
        pin = GeneratePin(6)
        
        org ={"VerficationStatusID":1,
          "Name":orgname,
          "SshPassword":hashedpassword,
          "Email":email,
          "PhoneNumber":"",
          "Address":"",
          "Description":"",
          "pin":pin}

        ## store data to later verify account using email
        session["validations"]=email
        to_be_verified.append(org)

        ## send email
        verificationemail= ReadTextFile("website/templates/Emails/TEXT/verifyemail.txt")##"Dear "+ orgname + " here is your pin to verify your account: "+ org["pin"] 
        verificationemail=verificationemail.replace("{{pin}}",str(org["pin"]))
        SendEmail("Auxilium Verification", verificationemail,[org["Email"]],
                  html=render_template("Emails/HTML/verifyemail.html",pin=org["pin"]))

        return {"status":"success"}
    
    else:
        return {"status":"error",
                "error":"Already Logged In"}


@authentication.route("/verify_email",methods=["POST"])
@HandleError
def verifyemail():

    ## get account that matches email in session data
    accounts = [acc for acc in to_be_verified if acc["Email"]==session.get("validations")]

     ## the case where there is no account to be verified with that email, using that computer
    if len(accounts)==0:
        return {"status":"error",
                "error":"No account to verify, trying to verify an account that hasnt been created"}
    
    ## get first account that matches that email 
    ## there should only be one
    account=accounts[0]

    ## get pin sent in post request
    pin_given = request.json["pin"]

    ## actual pin
    pin=account["pin"]

   
    
    if(pin_given == pin):

        ## add account to database
        CreateNewAccount(account)

        ## set logged in session variable
        print(account["Email"])
        orgid = GetOrgFromEmail(account["Email"])["OrganisationID"]
        session["logged_in"]=orgid

        ## reset session variable and to_be_verified list
        to_be_verified.remove(account)
        session["validations"]=None
        
        return {"status":"success"}

    else:
        return {"status":"error",
                "error":"Incorrect Pin"}
    
@authentication.route("/resend_email_verification",methods=["GET"])
@HandleError
def resend_email_verification():
    accounts = [acc for acc in to_be_verified if acc["Email"]==session.get("validations")]

    if(session.get("validations")==None or len(accounts)==0):
        return {"status":"error",
                "error":"Have not tried to create an account from this computer"}
    
    else:
        account=accounts[0]

        ## send email
        verificationemail= ReadTextFile("website/templates/Emails/TEXT/verifyemail.txt")##"Dear "+ orgname + " here is your pin to verify your account: "+ org["pin"] 
        verificationemail=verificationemail.replace("{{pin}}",str(account["pin"]))
        
        SendEmail("Auxilium Verification", verificationemail,[account["Email"]],
                  html=render_template("Emails/HTML/verifyemail.html",pin=account["pin"]))
        
        return {"status":"success"}



@authentication.route("/loggedinjson",methods=["GET"])
@HandleError
def loggedinjson():
    if(session.get('logged_in')):
        return {'logged_in' : True,
                "OrganisationID":session.get("logged_in")
            }
    else:
        return {'logged_in' : False}



@authentication.route("/logoutjson",methods=["GET"])
@HandleError
def logoutjson():
    try:
        session['logged_in'] = None
        return {'status' : 'success'}
    except Exception as e:
        return {'status' : "error",
                "error":str(e)}
    
    
@authentication.route("/forgot_password_email", methods=["POST"])
@HandleError
def forgot_password_email():
    if session.get("logged_in")!=None:
        return {"status":"error",
                "error":"Already Logged In"}
    elif (not ValidEmail(request.json["email"])):
        return {"status":"error",
                "error":"Invalid Email"}
    else:
        from website.pages import forgot_password_page

        token = Hash (request.json["email"] + GeneratePin(10))
        session["forgot_password"]={"email":request.json["email"],
                                    "token":token}
        link = url_for("pages.forgot_password_page",_external=True)+"?token="+token

        body= ReadTextFile("website/templates/Emails/TEXT/forgotpasswordemail.txt")
        body=body.replace("{{link}}",link)

        SendEmail("Auxilium Forgot Password",body,
                  [request.json["email"]],
                    html=render_template("Emails/HTML/forgotpasswordemail.html",link=link))
        return {"status":"success"}       



@authentication.route("/forgot_password_change",methods=["POST"])
@HandleError
def forgot_password_change():

    ## cant reset if already logged in 
    if session.get("logged_in")!=None:
        return {"status":"error",
                "error":"Already Logged In"}
    elif session.get("forgot_password")==None:
        return {"status":"error",
                "error":"Have not requested a password change"}
    else:

        token =request.json["token"]
        givenpassword = request.json["password"]

        ## check tokens are the same
        if token == session["forgot_password"]["token"]:


            org=GetOrgFromEmail(session["forgot_password"]["email"])
           
            if not ValidPassword(givenpassword):
                return {"status":"error",
                        "error":"Password does not meet requirements"}
            
            hashedpassword= Hash(givenpassword)

            ## update db 
            status=json.loads(db.UpdateOrganisation(org["OrganisationID"],json.dumps({"SshPassword":hashedpassword})))
            print(status)
            print(org["OrganisationID"])
            if status["Success"]!=True:
                return {"status":"error",
                        "error":"Database Error"}
            else:
                session["forgot_password"]=None
                return {"status":"success"}
            
        else:
            return {"status":"error",
                    "error":"Incorrect Token"}


def RequiresLogin(function):
    @wraps(function)
    def isLoggedIn(*args,**kwargs):
        if session.get("logged_in")==None:
            return {"status":"error",
                    "error":"Unauthorised Access"}
        else:
            return function(*args,**kwargs)
    return isLoggedIn







def CreateNewAccount(accountdetails):
    
    """adds the username and account to our records of existing users"""
    db.InsertOrganisation(accountdetails)
    

def UniqueEmail(email):
    
    ## searches for email in database
    if GetOrgFromEmail(email)==True:
        return False

    ## searches for email in accounts that are yet to be verified
    for acc in to_be_verified:
        if acc["Email"]==email:
            return False
        
    return True


        
    



