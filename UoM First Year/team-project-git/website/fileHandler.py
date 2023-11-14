import dropbox
import keyring
import base64
import requests

from dropbox.exceptions import AuthError, ApiError

try:
    from website import environmentVars
except:
    import environmentVars

APP_KEY = environmentVars.ReadEnvironmentVar(environmentVars.APP_KEY_PATH)
APP_SECRET = environmentVars.ReadEnvironmentVar(environmentVars.APP_SECRET_PATH)
REFRESH_TOKEN = environmentVars.ReadEnvironmentVar(environmentVars.REFRESH_TOKEN_PATH)
ACCESS_CODE = environmentVars.ReadEnvironmentVar(environmentVars.ACCESS_CODE_PATH)

DBX_CONNECTION  = dropbox.Dropbox(
    oauth2_refresh_token=REFRESH_TOKEN,
    app_key=APP_KEY,
    app_secret=APP_SECRET
)

def __GetRefreshToken():
    #https://www.dropbox.com/oauth2/authorize?client_id=9vw8dfin90w3ww8&token_access_type=offline&response_type=code
   
    auth_string = f"{APP_KEY}:{APP_SECRET}"
    auth_header = f"Basic {base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')}"

    payload = {
        "code": ACCESS_CODE,
        "grant_type": "authorization_code"
    }

    headers = {
        "Authorization": auth_header,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = requests.post("https://api.dropboxapi.com/oauth2/token", data=payload, headers=headers)

    if response.ok:
        data = response.json()
        refresh_token = data.get("refresh_token")
        print(f"refresh_token: {refresh_token}")
    else:
        print(f"Error: {response.status_code}")


def ResponseWrapper(function):
    def Wrapper(*args, **kwargs):

        dctWrapper = {}
        try:
            function(*args, **kwargs)
            dctWrapper['Success'] = True

        except AuthError as e:
            dctWrapper['Success'] = False
            dctWrapper['Error'] = f"{e}. Check your access token."

        except ApiError as e:
            dctWrapper['Success'] = False

            if e.user_message_text:
                dctWrapper['Error'] = str(e.user_message_text)
            else:
                dctWrapper['Error'] = str(e)

        return dctWrapper

    return Wrapper

@ResponseWrapper
def UploadFile(filePath, dropboxFilePath):
    with open(filePath, "rb") as file:
        DBX_CONNECTION.files_upload(file.read(), dropboxFilePath, mode=dropbox.files.WriteMode.overwrite)

@ResponseWrapper
def DeleteFile(dropboxFilePath):
    DBX_CONNECTION.files_delete_v2(dropboxFilePath)

@ResponseWrapper
def GetFile(dropboxFilePath, localFilePath):
    metaData, response = DBX_CONNECTION.files_download(dropboxFilePath)

    with open(localFilePath, "wb") as f:
        f.write(response.content)

    return localFilePath



#UploadFile("website\databaseHandler.py", "/AuxiliumVolunteering/test.py")
#DeleteFile("/AuxiliumVolunteering/file.py")
