class AnimatedForm {

    constructor(generateInputs, document, messageBoxID, 
        topRightMessage = 'Welcome Back!',
        bottomRightMessage = 'Join our chartible organisations to help people help others.') {
        this.generateInputs = generateInputs;
        this.document = document;
        this.messageBoxID = messageBoxID;
        this.bottomRightMessage = bottomRightMessage;
        this.topRightMessage = topRightMessage;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    generateHTML() {

        let formContainer = this.document.getElementById("login-container");
        let formMessage = this.document.getElementById(this.messageBoxID);

        formContainer.appendChild(this.generateInputs(this.document.createElement("form")));

        let seed = this.getRandomInt(4);
        let ys = [35, 65, 47, 63];
        let images = ["'../../static/images/v1.png'",
            "'../../static/images/v2.png'",
            "'../../static/images/v3.png'",
            "'../../static/images/v4.png'",
            "'../../static/images/v5.png'"];

        for (let i = 0; i < 4; i++) {

            let size = (this.getRandomInt(30) + 60);
            let x = 0;
            let y = 0;

            switch ((i + seed) % 4) {
                case 0:
                    x = 30;
                    y = ys[i];
                    break;
                case 1:
                    x = 35;
                    y = ys[i];
                    break;
                case 2:
                    x = 70;
                    y = ys[i];
                    break;
                case 3:
                    x = 75;
                    y = ys[i];
                    break;
            }

            formMessage.innerHTML +=
                "<img" +
                " width=" + size.toString() + "px" +
                " height=" + size.toString() + "px" +
                " style='position: absolute;" +
                "        left:" + x.toString() + "%;" +
                "        top:" + y.toString() + "%;" +
                "animation: scaleUp " + (i + 1) / 2 + "s; animation-delay: " + i/5 + "s; animation-fill-mode: forwards;' src =" + images[(i + seed) % 5] + ">";
        }

        formMessage.innerHTML += "<h1>" + this.topRightMessage + "</h1>";
        formMessage.innerHTML += "<a>" + this.bottomRightMessage + "</a>";
    }


    isInput() {

        // Validate input

        let textInput = this.document.getElementById('orgname').value;
        let passInput = this.document.getElementById('password').value;

        if (textInput == "" || passInput == "") {
            alert("Enter your Organisation's name and password to continue");
            return false;
        }

        return true;
    }
}

