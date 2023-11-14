let signUpForm = new AnimatedForm((form) => {
    form.setAttribute("enctype", "text/plain");
    form.setAttribute("method", "post");
    form.setAttribute("action", "mailto:volunteerauxilium@gmail.com");
    
    form.innerHTML += "<h1>Contact Us</h1>";

    let inputContainer = document.createElement('div')
    inputContainer.setAttribute('class', 'input-container')

    inputContainer.innerHTML += "<label for='name'>Username </label>";
    inputContainer.innerHTML += "<input type='text' id='name' name='name' placeholder='Type your name'>";

    inputContainer.innerHTML += "<label for='email'>Email</label>";
    inputContainer.innerHTML += "<input type='email' id='email' name='email' placeholder='Type your email'>";
    
    inputContainer.innerHTML += "<label for='message'>Message</label>";
    inputContainer.innerHTML += "<textarea type='text' id='message' name='message' placeholder='What do you have to say?'>";
    
    inputContainer.innerHTML += "<input type='submit' value='Submit'>";
    form.appendChild(inputContainer);
    
    return form;
}, document, "login-message", 'Have an issue?', 'We value your feedback and strive to enhance your experience.');

signUpForm.generateHTML();