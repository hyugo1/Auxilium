# imports
import mysql.connector
import json
import keyring

try:
    import fileHandler
    import environmentVars
except:
    from website import fileHandler
    from website import environmentVars


from fuzzywuzzy import fuzz
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Stores USERNAME and PASSWORD securely in the keyring
USERNAME = environmentVars.ReadEnvironmentVar(environmentVars.USERNAME_PATH)
PASSWORD = environmentVars.ReadEnvironmentVar(environmentVars.PASSWORD_PATH)

HOST_NAME = environmentVars.ReadEnvironmentVar(environmentVars.HOST_NAME_PATH)
DATABASE_NAME = environmentVars.ReadEnvironmentVar(environmentVars.DATABASE_NAME_PATH)

LISTINGS_TABLE = "Listings"
ORGANISATION_TABLE = "Organisation"
DOCUMENTS_TABLE = "Documents"
LISTING_DOCUMENTS_LINK_TABLE = "ListingDocuments"
ORGANISATION_DOCUMENTS_LINK_TABLE = "OrganisationDocuments"


ORGANISATION_TABLE_COLS = ["OrganisationID", "VerficationStatusID", "Name", "SshPassword", "Email", "PhoneNumber", "Address", "Description"]
ORGANISATION_PUBLIC_COLS = ["Name", "Email", "PhoneNumber", "Description","OrganisationID"]
LISTING_TABLE_COLS = ["ListingID", "OrganisationID", "Title", "Description", "PostingDate", "VolounteeringDate", "Address", "Latitude", "Longitude"]

DOCUMENTS_TABLE_COLS = ["DocumentID", "TypeID", "FilePath", "Name"]
LISTING_DOCUMENTS_LINK_TABLE_COLS = ["ListingID", "DocumentID", "LoadOrder"]
ORGANISATION_DOCUMENTS_LINK_TABLE_COLS = ["OrganisationID", "DocumentID", "LoadOrder"]

# Connecting to the database.
databaseConnection = mysql.connector.connect(
    host=HOST_NAME, # can be other hosts
    user=USERNAME,
    password=PASSWORD,
    database=DATABASE_NAME,
    use_pure=True
)

cursor = databaseConnection.cursor()

def JsonWrapper(function):
    def Wrapper(*args, **kwargs):

        dctWrapper = {}

        try:
            modifiedRows, dctResult = function(*args, **kwargs)

            if modifiedRows == 0:
                dctWrapper['Success'] = False
            else:
                dctWrapper['Success'] = True

            dctWrapper['ModifedRows'] = modifiedRows
            dctWrapper['Content'] = dctResult
        except Exception as e:
            dctWrapper['Success'] = False
            dctWrapper['Error'] = str(e)
        
        return json.dumps(dctWrapper, indent=4, default=str) ## set default to str
                                                            ## this tells python to automatically convert 
                                                            ## any non-serialisable data to a string
    
    return Wrapper


#Inserts a row into a table
def __Insert(table, columns, *values):
    colStr = ','.join(columns)
    valTmp = ','.join(['%s'] * len(values))

    command = f"INSERT INTO {table} ({colStr}) VALUES ({valTmp})"

    cursor.execute(command, tuple(values))
    databaseConnection.commit()

    #Returns number of rows modified (1 or 0)
    return cursor.rowcount, None

#Selects row/s from a table with optional conditions and columns
def __Select(table, columns = "*", condition = None):
    if columns != '*':
        columns = ','.join(columns)

    command = f"SELECT {columns} FROM {table}"
    if condition:
        command += f" WHERE {condition}"

    cursor.execute(command)

    results = cursor.fetchall()
    headers = [col[0] for col in cursor.description]

    #Returns selected rows in dictonary 
    return cursor.rowcount, [dict(zip(headers, row)) for row in results]

#Updates a record in a table using values in dictionary
def __Update(table, newValuesDict, condition):
    #Moves the cursor to the correct table (make efficient later)
    __Select(table)
    headers = [col[0] for col in cursor.description]

    validVars = [col for col in list(newValuesDict.keys()) if col in headers]
    updatedVarsStr = ", ".join([f"{key} = %s" for key in newValuesDict if key in validVars])

    command = f"UPDATE {table} SET {updatedVarsStr} WHERE {condition}"

    cursor.execute(command, list(newValuesDict.values()))
    databaseConnection.commit()

    return cursor.rowcount, None

#Deletes a record from a table
def __Delete(table, condition = None):
    command = f"DELETE FROM {table}"
    if condition:
        command += f" WHERE {condition}"

    cursor.execute(command)
    databaseConnection.commit()

    #Returns number of rows modified 
    return cursor.rowcount, None

#----------------------------------------------------- INSERT -------------------------------------------------------------------------

@JsonWrapper
def InsertOrganisation(dict):
    ##dict = json.loads(jsonFile)

    #Kinda hacky rn, will optmise later
    verfication = dict[ORGANISATION_TABLE_COLS[1]]
    name = dict[ORGANISATION_TABLE_COLS[2]]
    sshPassword = dict[ORGANISATION_TABLE_COLS[3]]
    email = dict[ORGANISATION_TABLE_COLS[4]]
    phoneNumber = dict[ORGANISATION_TABLE_COLS[5]]
    address = dict[ORGANISATION_TABLE_COLS[6]]
    dscrp = dict[ORGANISATION_TABLE_COLS[7]]

    return __Insert(ORGANISATION_TABLE, ORGANISATION_TABLE_COLS[1:],  verfication, name, sshPassword, email, phoneNumber, address, dscrp)


@JsonWrapper
def InsertLisiting(jsonfile):
    dict = json.loads(jsonfile)

    #Kinda hacky rn, will optmise later
    organisationID = dict[LISTING_TABLE_COLS[1]]
    title = dict[LISTING_TABLE_COLS[2]]
    desciption = dict[LISTING_TABLE_COLS[3]]
    postingDate = str(dict[LISTING_TABLE_COLS[4]]).replace("/", "")
    volunteeringDate = str(dict[LISTING_TABLE_COLS[5]]).replace("/", "")
    address = dict[LISTING_TABLE_COLS[6]]

    lat, long = GeocodeAddress(address)

    result = __Insert(LISTINGS_TABLE, LISTING_TABLE_COLS[1:], organisationID, title, desciption, postingDate, volunteeringDate, address, lat, long)

    return result[0], cursor.lastrowid

#----------------------------------------------------- GETTING -------------------------------------------------------------------------

@JsonWrapper
def GetPublicOrganisationData(organisationID):
    publicCols = [col for col in ORGANISATION_TABLE_COLS if col in ORGANISATION_PUBLIC_COLS]
    return __Select(ORGANISATION_TABLE, publicCols, f"{ORGANISATION_TABLE_COLS[0]}={organisationID}")

@JsonWrapper
def GetAllPublicOrganisationData():
    publicCols = [col for col in ORGANISATION_TABLE_COLS if col in ORGANISATION_PUBLIC_COLS]
    return __Select(ORGANISATION_TABLE, publicCols)

@JsonWrapper
def GetPrivateOrganisationData(organisationID):
    return __Select(ORGANISATION_TABLE, condition=f"{ORGANISATION_TABLE_COLS[0]}={organisationID}")

@JsonWrapper
def GetAllPrivateOrganisationData():
    return __Select(ORGANISATION_TABLE)

@JsonWrapper
def GetAllListings():
    return __Select(LISTINGS_TABLE)

@JsonWrapper
def GetAllListingDocuments():
    return __Select(LISTING_DOCUMENTS_LINK_TABLE)

@JsonWrapper
def GetAllOrganisationDocuments():
    return __Select(ORGANISATION_DOCUMENTS_LINK_TABLE)

#----------------------------------------------------- UPDATING -------------------------------------------------------------------------

@JsonWrapper
def UpdateOrganisation(organisationID, jsonChanges):
    return __Update(ORGANISATION_TABLE, json.loads(jsonChanges), f"{ORGANISATION_TABLE_COLS[0]}={organisationID}")

@JsonWrapper
def UpdateListing(listingID, jsonChanges):
    return __Update(LISTINGS_TABLE, json.loads(jsonChanges), f"{LISTING_TABLE_COLS[0]}={listingID}")

#----------------------------------------------------- DELETING --------------------------------------------------------------------------

def DeleteOrganisation(organisationID):
    return __Delete(ORGANISATION_TABLE, f"{ORGANISATION_TABLE_COLS[0]}={organisationID}")

def DeleteListing(listingID):
    return __Delete(LISTINGS_TABLE, f"{LISTING_TABLE_COLS[0]}={listingID}")

#----------------------------------------------------- SEARCHING -------------------------------------------------------------------------

@JsonWrapper
def SearchListings(searchTerm, searchByName = True, searchByDescription = True):
    rowCount, listings = __Select(LISTINGS_TABLE)
    validListings = []

    for i in range(len(listings)):
        listing = listings[i]

        if searchByName and IsFuzzyMatch(searchTerm, listing[LISTING_TABLE_COLS[2]]):
            validListings.append(listings)
        elif searchByDescription and IsFuzzyMatch(searchTerm, listing[LISTING_TABLE_COLS[3]]):
            validListings.append(listings)

    return len(validListings), validListings
            
@JsonWrapper
def SearchOrganisations(searchTerm, searchByName=True, searchByDescription=True):
    rowCount, organisations = __Select(ORGANISATION_TABLE)
    validOrganisations = []

    for org in organisations:
        if searchByName and IsFuzzyMatch(searchTerm, org[ORGANISATION_TABLE_COLS[2]]):
            validOrganisations.append(org)
        elif searchByDescription and IsFuzzyMatch(searchTerm, org[ORGANISATION_TABLE_COLS[7]]):
            validOrganisations.append(org)

    return len(validOrganisations), validOrganisations

#----------------------------------------------------- UPLOADING FILES -------------------------------------------------------------------------

@JsonWrapper
def UploadDocument(filePath, dropboxFilePath, fileName, typeID, organisationID = None, listingID = None, loadOrder = 0):
    result = __Insert(DOCUMENTS_TABLE, DOCUMENTS_TABLE_COLS[1:], typeID, dropboxFilePath, fileName)
    fileHandler.UploadFile(filePath, dropboxFilePath)

    #Sets up link table rows
    documentID = cursor.lastrowid
    
    if organisationID != None:
        __Insert(ORGANISATION_DOCUMENTS_LINK_TABLE, ORGANISATION_DOCUMENTS_LINK_TABLE_COLS, organisationID, documentID, loadOrder)

    if listingID != None:
        __Insert(LISTING_DOCUMENTS_LINK_TABLE, LISTING_DOCUMENTS_LINK_TABLE_COLS, listingID, documentID, loadOrder)

    return result

@JsonWrapper
def DeleteDocumentViaID(documentID):
    dctResult = __Select(DOCUMENTS_TABLE, [DOCUMENTS_TABLE_COLS[2]], f"{DOCUMENTS_TABLE_COLS[0]} = '{documentID}'")[1][0]
    filePath = dctResult[DOCUMENTS_TABLE_COLS[2]]

    return DeleteDocumentViaFilePath(filePath)[0], None

@JsonWrapper
def DeleteDocumentViaFilePath(filePath):
    fileHandler.DeleteFile(filePath)

    return __Delete(DOCUMENTS_TABLE, f"{DOCUMENTS_TABLE_COLS[2]} = '{filePath}'")[0], None

@JsonWrapper
def DownloadFileViaID(documentID, localFilePath):
    dctResult = __Select(DOCUMENTS_TABLE, [DOCUMENTS_TABLE_COLS[2]], f"{DOCUMENTS_TABLE_COLS[0]} = '{documentID}'")[1][0]
    filePath = dctResult[DOCUMENTS_TABLE_COLS[2]]

    return DonwloadFileViaFilePath(filePath, localFilePath), filePath

@JsonWrapper
def DonwloadFileViaFilePath(filePath, localFilePath):
    fileHandler.GetFile(filePath, localFilePath)

    return 1, localFilePath

#----------------------------------------------------- UTILITIES -------------------------------------------------------------------------

def IsFuzzyMatch(searchTerm, text, threshold=50):
    score = fuzz.ratio(searchTerm.lower(), text.lower())
    return score >= threshold

def GeocodeAddress(address):
    geolocator = Nominatim(user_agent="uk_address_geocoder")
    
    try:
        location = geolocator.geocode(address)
        if location:
            return location.latitude, location.longitude
        else:
            return 0, 0
    except GeocoderTimedOut:
        return GeocodeAddress(address)