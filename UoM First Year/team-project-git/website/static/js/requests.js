async function PostData(url,data){
                
    //create object to store data, and important meta data, such as type of data sent
    // and type of request being made (POST)
    let obj={method:"POST",
            headers:{
                        'Content-Type':'application/json'
                    },
            body: JSON.stringify(data)
        }
    
    // make POST request, and store the response
    let response = await fetch(url,obj).catch(error => {console.error(error);console.log("AAAA")});
    // convert response to JSON
    let json = await response.json();
    // return outcome of POST request 

    if (json.status=="error" && json.error=="Internal Server Error"){
        window.location.href="/errorpage";
    }
    else{
        return json;
    }
}

async function GetData(url){
    // store response from GET request
    let response= await fetch(url).catch(error => console.log(error));
    // convert response to JSON 
    let json = await response.json();

    if (json.status=="error" && json.error=="Internal Server Error"){
        window.location.href="/errorpage";
    }
    else{
        return json;
    }
}

async function GetListings(){
    return GetData("/get_listings");
}

async function GetListing(listingid){
    return GetData("/get_listing/" + listingid);
}


async function AddListing(listing){
    return PostData("/add_listing",listing);
}

async function DeleteListing(listingid){
    let response= await GetData("/delete_listing/"+listingid);
    return response
}

async function SearchListings(searchterm){
    return GetData("/search/"+searchterm);
}

async function GetOrganisations() {
    return GetData("/get_all_organisations");
}

async function GetOrganisation(orgID) {
    return GetData("/get_organisation_json/"+orgID);
}

async function GetMyOrganisation() {
    response= await GetData("/get_my_organisation_json");
    
    return response;
    
}

async function GetListingIconImages(lisID) {
    return GetData("/get_listing_images/"+lisID+'/i');
}

async function GetListingListingImages(lisID) {
    return GetData("/get_listing_images/"+lisID+'/l');
}

async function GetOrganisationImages(orgID) {
    return GetData("/get_organisation_images/"+orgID);
}

async function FilterListings(filter){
    response= await PostData("/filter_listings",filter);
    return response;
}

async function FilterOrganisations(filter){
    response= await PostData("/filter_organisations",filter);
    return response;
}

async function isLoggedIn(){
    loggedin= await GetData("/authentication/loggedinjson");
    return loggedin;
}

async function Login(logindata){
    response= await PostData("/authentication/login",logindata);
    return response;
}

async function SignUp(account){
    response = await PostData("authentication/org_signup",account);
    return response;
}

async function EditOrganisation(orgchanges){
    response = await PostData("/change_organisation_data",orgchanges);
    return response;
}

async function Logout(){
    response=await GetData("/authentication/logoutjson");
    console.log(response);
    return response;
}

async function VerifyEmail(givenpin){
    obj={pin:givenpin}
    response= await PostData("/authentication/verify_email", obj);
    return response;
}

async function ResendEmailVerification(){
    response = await GetData("/authentication/resend_email_verification");
    return response;
}

async function Search(searchterm){
    // not working cannot currently retrieve data from db
    response = await GetData("/search/"+searchterm)
    return response;
}

async function ForgotPasswordEmail(useremail){
    obj={'email':useremail};
    
    response = await PostData("/authentication/forgot_password_email",obj);
    return response;
}

async function ForgotPasswordChange(password){
    token = GetQueryParameter(window.location.href,"token")
    console.log(token)
    obj={"password":password,
        "token":token};
    response=await PostData("/authentication/forgot_password_change",obj);
    return response;
}

function GetQueryParameter(url,parameter){
    // gets query parameters from url, requires full url
     
     url=new URL(url, window.location.origin);

    // creates object to search params using current url 
    const params = new URLSearchParams(url.search);
 
    return params.get(parameter);
}



function AddQueryParameter(url,parameter_name,parameter){
    //adds a parameter to a url

    // splits url into before query params, and after query parameters

    // parameter already in url
    if(url.split("?").length>1){  
        return url+"&"+parameter_name+"="+parameter;
    }
    
    // first parameter to be added to url
    return url+"?"+parameter_name+"="+parameter;
    
}




