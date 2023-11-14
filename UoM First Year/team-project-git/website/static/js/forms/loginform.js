var error = '';
let errorText = document.createElement('p');
errorText.setAttribute('id', 'errorText');

let loginForm = new AnimatedForm((form) => {
    let path = "/signuppage";
    let forgotpasswordpath="/forgot_password_email_page"

    form.setAttribute("enctype", "multipart/form-data");
    //form.setAttribute("method", "POST");
    form.setAttribute("onsubmit", "return login(this.form);");
    //form.setAttribute("action", action = "/authentication/login");

    form.innerHTML += "<h1>Login</h1>";
    form.addEventListener('submit', (e) => e.preventDefault() );

    let inputContainer = document.createElement('div')
    inputContainer.setAttribute('class', 'input-container')

    inputContainer.innerHTML += "<label for='orgname'>Orgnaisation Email</label>";
    inputContainer.innerHTML += "<input type='text' id='orgname' name='orgname' placeholder='Type your organisation name'>";
    inputContainer.innerHTML += "<label for='password'>Password</label>";
    inputContainer.innerHTML += "<input type='password' id='password' name='password' placeholder='Type your password'>";
    inputContainer.innerHTML += "<input type='submit' value='Login'>";

    form.appendChild(inputContainer);

    errorText.setAttribute('style', 'color:red');
    form.appendChild(errorText);

    form.innerHTML += "<a" + ' onclick="window.location=\'' + forgotpasswordpath + '\' ; ">Forgot Password?</a>';
    form.innerHTML +="<br>";
    form.innerHTML += "<a" + ' onclick="window.location=\'' + path + '\';">Dont have an account? Sign up.</a>';

    return form;
}, document, "login-message");

loginForm.generateHTML();

async function login(){
    let formusername=document.getElementById("orgname").value;
    let formpassword=document.getElementById("password").value;

    let json={"email":formusername, "password":formpassword}

    let status = await Login(json);

    if(status.status=="error"){
        document.getElementById('errorText').innerHTML = status.error;
        console.log(error);
    } else{
        window.location = "/organisationpage"
    }   
}