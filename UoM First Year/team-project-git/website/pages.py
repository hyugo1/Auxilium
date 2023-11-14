from flask import Flask,Blueprint,request,render_template,json,jsonify,current_app, session, redirect
from .ErrorHandler import RedirectOnError
#from website import databaseHandler as db

pages = Blueprint("pages", __name__)


@pages.route("/",methods=["GET"])
@RedirectOnError
def home():    
    #print(db.UploadDocument('/home/madhav/Pictures/mysql.png', '/AuxiliumVolunteering/yoursql.png', '/AuxiliumVolunteering/yoursql.png', 1, organisationID = 44, listingID = 50))
    #print(db.DonwloadFileViaFilePath('/AuxiliumVolunteering/yoursql.png','website/static/temp-images/mysql.png'))
    return render_template('homepage.html')


@pages.route("/organisationpage",methods=["GET"])
@RedirectOnError
def organisation_page():
    return render_template('organisationpage.html')


@pages.route("/verifyemail",methods=["GET"])
@RedirectOnError
def verifyemail():
    return render_template('temp/verifyemail.html')


@pages.route("/listingspage",methods=["GET"])
@RedirectOnError
def listings_page():
    return render_template('listingspage.html')

@pages.route("/addlisting",methods=["GET"])
@RedirectOnError
def add_listings_page():
    return render_template('temp/addlistingpage.html')

@pages.route("/termspage",methods=["GET"])
@RedirectOnError
def terms():
    return render_template('terms.html')

@pages.route("/privacypage",methods=["GET"])
@RedirectOnError
def privacy():
    return render_template('policy.html')

@pages.route("/contactus",methods=["GET"])
@RedirectOnError
def contactus():
    return render_template('contact.html')

@pages.route("/aboutus",methods=["GET"])
@RedirectOnError
def about():
    return render_template('aboutus.html')


@pages.route("/loginpage", methods =["GET"])
@RedirectOnError
def loginpage():
    ## if user not logged in returns login page 
    ## otherwise returns their org page

    if(not session.get("logged_in")):
        return render_template("organisationloginpage.html")
    else:
        return redirect("/organisationpage")

@pages.route("/signuppage", methods=["GET"])
@RedirectOnError
def signuppage():
    ## if user not logged in returns signup page 
    ## otherwise returns their org page 

    if(not session.get("logged_in")):
        return render_template("organisationsignuppage.html")
    else:
        return redirect("/organisationpage")





@pages.route("/organisations/<n>",methods=["GET"])
@RedirectOnError
def organisation(n):

    return render_template('organisationpage.html',x=int(n))


@pages.route("/listings/<n>",methods=["GET"])
@RedirectOnError
def listing(n):
    return render_template('volunteeringpage.html', i=int(n))


@pages.route("/listingpage",methods=["GET"])
@RedirectOnError
def listing_page():
    return render_template('temp/listingpage.html')


@pages.route("/errorpage")
def error_page():
    return render_template("temp/errorpage.html")

@pages.route("/addlistingsuccessful")
def listing_add_success_page():
    return render_template("temp/listingsuccess.html")

@pages.route("/termsofservicepage")
@RedirectOnError
def terms_of_service():
    return render_template("terms.html")

@pages.route("/privacypolicypage")
@RedirectOnError
def privacy_policy_page():
    return render_template("policy.html")
    

@pages.route("/forgot_password_page")
@RedirectOnError
def forgot_password_page():
    return render_template("temp/forgotpasswordchange.html")

@pages.route("/forgot_password_email_page")
@RedirectOnError
def forgot_password_email_page():
        return render_template("temp/forgotpasswordemail.html")




## for testing
@pages.route("/fetchtest",methods=["GET"])
@RedirectOnError
def fetchtest():    
    return render_template('fetchtest.html')