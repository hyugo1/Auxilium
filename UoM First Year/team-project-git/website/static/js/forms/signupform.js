
async function DisplayContents() {
    let errorText = document.createElement('p');
    errorText.setAttribute('id', 'errorText');
    
    let signUpForm = new AnimatedForm((form) => {
        let path = "/loginpage";

        form.setAttribute("enctype", "multipart/form-data");
        //form.setAttribute("method", "POST");
        form.setAttribute("onsubmit", "return signup(this.form);");
        //form.setAttribute("action", action = "/authentication/login");

        form.innerHTML += "<h1>Sign Up</h1>";
        form.addEventListener('submit', (e) => e.preventDefault());

        let inputContainer = document.createElement('div')
        inputContainer.setAttribute('class', 'input-container')

        inputContainer.innerHTML += "<label for='email'>Organisation Email</label>";
        inputContainer.innerHTML += "<input type='email' id='email' name='email' placeholder='Type your email'>";

        inputContainer.innerHTML += "<label for='orgname'>Username</label>";
        inputContainer.innerHTML += "<input type='text' id='username' name='username' placeholder='Type your username'>";

        inputContainer.innerHTML += "<label for='password'>Password</label>";
        inputContainer.innerHTML += "<input type='password' id='password' name='password' placeholder='Type your password'>";

        inputContainer.innerHTML += "<label for='confirmpassword'>Confirm Password</label>";
        inputContainer.innerHTML += "<input type='password' id='confirmpassword' name='confirmpassword' placeholder='Confirm your password'>";

        inputContainer.innerHTML += "<input type='submit' value='Sign Up'>";
        form.appendChild(inputContainer);

        errorText.setAttribute('style', 'color:red');
        form.appendChild(errorText);

        form.innerHTML += "<a" + ' onclick="window.location=\'' + mainUrl + path + '\';">Already have an account? Log in.</a>';

        return form;
    }, document, "login-message-signup",
        'Welcome');

    signUpForm.generateHTML();
}

DisplayContents();

async function signup() {

    let formemail = document.getElementById("email").value;
    let formusername = document.getElementById("username").value;
    let formpassword = document.getElementById("password").value;
    let formconfirmpassword = document.getElementById("confirmpassword").value;

    let json = {
        "email": formemail,
        "username": formusername,
        "password": formpassword,
        "confirmpassword": formconfirmpassword
    };

    let status = await SignUp(json);

    if (status.status == "error") {
        document.getElementById('errorText').innerHTML = status.error;
        console.log(error);
    } else {
        window.location = "/verifyemail"
    }
}