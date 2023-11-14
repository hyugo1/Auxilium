from flask import Flask,Blueprint,request,render_template,json,jsonify,session,send_file,send_from_directory
import website.databaseHandler as db 
import json
from .ErrorHandler import HandleError
import base64
import random
import os
from website.Utilities import *



data= Blueprint("data", __name__)

@data.route("/search/<searchterm>")
@HandleError
def search(searchterm):
    
    listings=db.SearchListings(searchTerm=searchterm)
    return listings[1]
    

@data.route("/filter_organisations", methods=["POST"])
@HandleError
def filter_organisations():
    """Given a search term, returns all listings that match the search term"""
    
    allOrganisations=json.loads(db.GetAllPrivateOrganisationData())["Content"]

    organisations={"Organisations":Filter(request.json,allOrganisations)}

    return organisations



@data.route("/filter_listings", methods=["POST"])
@HandleError
def filter_listings():
    """Given a search term, returns all listings that match the search term"""
    listings={"Listings":Filter(request.json,json.loads(db.GetAllListings())["Content"])}
    return listings   



@data.route("/get_listings", methods=["GET"])
@HandleError
def get_listings():
    """Returns a json string containing all the listings"""
    
    allListings=json.loads(db.GetAllListings())["Content"]

    return {"Listings":allListings}
    


@data.route("/get_listing/<listingid>",methods=["GET"])
@HandleError
def get_listing(listingid):
    ## returns a listing by searching using listing id

    ## filter to find listings by id
    filter={"ListingID":int(listingid)}

    ## get listings that match id
    listings=Filter(filter,json.loads(db.GetAllListings())["Content"])
    
    ## check for no listings
    if(len(listings)==0):
        return {"status":"error",
                "error":"No listings match ID"}
    else:
        ## return the one listing that matches
        return listings[0]

    

@data.route("/get_organisations",methods=["GET"])
@HandleError
def get_organisations():
    ## returns a list of all organisations
    allOrganisations=json.loads(db.GetAllPrivateOrganisationData())["Content"]

    return {"Organisations":allOrganisations}
    
@data.route("/get_organisation_json/<orgID>",methods=["GET"])
@HandleError
def get_organisation(orgID):
    """Queries database, and finds organisation ,returns string which can be parsed as a JSON"""
    
    dbresponse=json.loads(db.GetPublicOrganisationData(orgID))

    if dbresponse["Success"]==True:
        return dbresponse["Content"][0]
    return {"status":"error",
            "error":"Organisation Not Found"}


@data.route("/get_listing_images/<lid>/<iorl>")
@HandleError
def get_listing_images(lid,iorl):
    lid = int(lid)
    print(db.GetAllListingDocuments())

    listing_image_urls = []
    icon_image_url = None
    
    filter={"ListingID":lid}

    documents=Filter(filter,json.loads(db.GetAllListingDocuments())["Content"])
    print(documents)

    if iorl == 'i':
        documents = [documents[-1]]
    elif iorl == 'l':
        del documents[-1]

    for i in documents:
        
        store_name = 'website/static/temp-images/' + 'listingid-' + str(lid) + '-' + str(random.randint(0,100000000)) + '.png'
        file_path = json.loads(db.DownloadFileViaID(i['DocumentID'],store_name))['Content'].split('/')[-1]
        
        with open(store_name, "rb") as image_file:
            encoded_string = "data:image/png;base64," + str(base64.b64encode(image_file.read()).decode('utf-8'))
            #print(encoded_string[:1000])
            if 'icon' in file_path:
                icon_image_url = encoded_string
            elif 'listing' in file_path:
                listing_image_urls.append(encoded_string)

        os.remove(store_name)

    return {'icon_image_url' : icon_image_url, 'listing_image_urls' : listing_image_urls }


@data.route("/add_listing",methods=["POST", "GET"])
@HandleError
def add_listing():
    
    if (session.get("logged_in")!=None ):

        request.json["OrganisationID"]=session.get("logged_in")
        #print(request.json)

        listing_image_urls = request.json['ListingImages']
        icon_image_url = request.json['IconImage']

        names = []

        for i in listing_image_urls:
            names.append("website/static/temp-images/listing-" + str(random.randint(0,100000000)) + ".png")

        names.append("website/static/temp-images/icon-" + str(random.randint(0,100000000)) + ".png")

        for i in range(len(listing_image_urls)):
            with open(names[i], 'wb') as fh:
                fh.write(base64.b64decode(listing_image_urls[i].split('base64,')[1]))

        with open(names[-1], 'wb') as fh:
            fh.write(base64.b64decode(icon_image_url.split('base64,')[1]))

     
        del request.json['ListingImages']
        del request.json['IconImage']

        lid=json.loads(AddListing(request.json))['Content']#request.json)

        print('Here')

        # Call database
        for i in names:
            db.UploadDocument(i, '/AuxiliumVolunteering/' + i.split('/')[-1], '/AuxiliumVolunteering/' + i.split('/')[-1], 1, listingID = lid)

        print('Uploaded')

        for i in names:
            os.remove(i)
        
        print('Deleted')

        return jsonify({"status":"success"})
    
    else:
        ## not logged in 
        return jsonify({"status":"error",
                        "error":"Unauthorised Access"})


@data.route("/get_organisation_images/<oid>")
@HandleError
def get_organisation_images(oid):
    try:
        oid = int(oid)
        print(db.GetAllOrganisationDocuments())

        org_image_url = None
        
        filter={"OrganisationID":oid}

        documents=Filter(filter,json.loads(db.GetAllOrganisationDocuments())["Content"])
        print(documents)

        documents = [documents[-1]]

        for i in documents:
            
            store_name = 'website/static/temp-images/' + 'orgid-' + str(oid) + '-' + str(random.randint(0,100000000)) + '.png'
            file_path = json.loads(db.DownloadFileViaID(i['DocumentID'],store_name))['Content'].split('/')[-1]
            
            with open(store_name, "rb") as image_file:
                encoded_string = "data:image/png;base64," + str(base64.b64encode(image_file.read()).decode('utf-8'))
                #print(encoded_string[:1000])
                if 'org' in file_path:
                    org_image_url = encoded_string

            os.remove(store_name)

        return {'org_image_url' : org_image_url}
    except Exception as e:
        return {'org_image_url' : None}
    


@data.route("/change_organisation_data", methods=["POST"])
@HandleError
def change_organisation_data():

   
    if(session.get("logged_in")!=None ):

        print('hehe')

        try:
            if 'OrgImage' in request.json:
                print('hehe')

                org_image_url = request.json['OrgImage']
                print(org_image_url)

                del request.json['OrgImage']

                name = "website/static/temp-images/org-" + str(random.randint(0,100000000)) + ".png"
                print(name)

                with open(name, 'wb') as fh:
                    fh.write(base64.b64decode(org_image_url.split('base64,')[1]))

                db.UploadDocument(name, '/AuxiliumVolunteering/' + name.split('/')[-1], '/AuxiliumVolunteering/' + name.split('/')[-1], 1, organisationID = session.get('logged_in'))

                os.remove(name)

            db.UpdateOrganisation(session.get("logged_in"), json.dumps(request.json))
            return {"status":"success"}
        
        except Exception as e:
            print(e)
            return {"status":"error",
                    "error":str(e)}
    
    else:
        return {"status":"error",
                "error":"Unauthorised Access"}
    

@data.route("/get_my_organisation_json", methods=["GET"])
@HandleError
def get_my_organisation():
  
    if session.get('logged_in')!=None :

        orgID=session["logged_in"]
        dbresponse=json.loads(db.GetPrivateOrganisationData(orgID))

        print(dbresponse)

        if dbresponse["Success"]==True:
            return dbresponse["Content"][0]
        
        return {"status":"error",
                "error":"Organisation Not Found"}

    else:
        return {"status":"error",
                "error":"unauthorised access"}


@data.route("/delete_listing/<listingid>")
def DeleteListing(listingid):
    if session.get("logged_in")!=None:
        listingid=int(listingid)
        print(json.loads(db.GetAllListings())["Content"])
        listings=Filter({"ListingID":listingid},json.loads(db.GetAllListings())["Content"])
        if len(listings)<=0 :
            return {"status":"error",
                    "error":"Listing Does Not Exist"}
        else:
            listing=listings[0]
            if listing["OrganisationID"]!= session.get("logged_in"):
                return {"status":"error",
                        "error":"Unauthorised Access, you do not have permission to delete this listing"}
            else:
                db.DeleteListing(listingid)
                return{"status":"success"}
    





def AddListing(listing):
    """Adds a listing to database"""

    ## should return a message detailing whether listing was added succesfully or
    ## if an error occurred what that error was
    
    status = "success"
    
    if len(listing["Title"])<=0:
        status="error"
        error= "Invalid Title"
    if len(listing["Description"])<=0:
        status="error"
        error= "Invalid Description"
    if not isValidDate(listing["PostingDate"]):
        status="error"
        error= "Invalid Posting Date"
    if not isValidDate(listing["VolounteeringDate"]):
        status="error"
        error= "Invalid Volunteering Date"
    
    if status=="success":
        return db.InsertLisiting(json.dumps(listing))
    else:
        return {"status":status,
                "error":error}





def OrganisationExists(organisationID):
    ##try get organisation
    dbresponse = json.loads( db.GetPublicOrganisationData(organisationID)) 
    return dbresponse["Success"]



def isValidListing(listing):
    if(
        len(listing["Title"])>0 and 
        len(listing["Description"])>0  and 
        isValidDate(listing["PostingDate"]) and 
        isValidDate(listing["VolunteeringDate"])
        # and posting date is less than volunteering date 
    ):
        return True
    else:
        return False


def isValidDate(dateString):
    dateParts= dateString.split("/")

    for i in range(0,len(dateParts)):
        if( dateParts[i].isdigit()):
            dateParts[i]=int(dateParts[i]) 
        else:
            return False
        
    if(len(dateParts)==3):
        
        if(  dateParts[0]>0 and dateParts[0]<32  and  ##date between 1 and 31
             dateParts[1]>0 and dateParts[1]<13 and ## month between 1 and 12
             dateParts[2]>0 ):              ## year is a number larger than 0 
            return True
    else:
        return False


# @app.route('/geocode', methods=['POST'])
# def geocode_address():
#     geolocator = Nominatim(user_agent="uk_address_geocoder")
#     address = request.json.get('address')
    
#     try:
#         location = geolocator.geocode(address)
#         if location:
#             latitude = location.latitude
#             longitude = location.longitude
#             return jsonify({'latitude': latitude, 'longitude': longitude})
#         else:
#             return jsonify({'error': 'Location not found.'}), 404
#     except GeocoderTimedOut:
#         return jsonify({'error': 'Geocoding timed out.'}), 500

