from flask import Flask 
from flask_mail import Mail,Message
## xldgldiksgclyipj

def CreateApp():

   

    app=Flask(__name__)
    app.secret_key = "y9"

    app.config["MAIL_SERVER"] =  "smtp.gmail.com"
    app.config["MAIL_USERNAME"] ="volunteerauxilium@gmail.com" ## our email
    app.config["MAIL_PASSWORD"]="xldgldiksgclyipj"  ## password from Google Account App Password
    app.config["MAIL_PORT"]=465 
    app.config["MAIL_USE_SSL"]= True



    

    from .authentication import authentication
    from .data import data
    from .pages import pages


    app.register_blueprint(authentication,url_prefix="/authentication")
    app.register_blueprint(data,url_prefix="/")
    app.register_blueprint(pages,url_prefix="/")

    return app

