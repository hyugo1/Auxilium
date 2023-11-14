let count = 100;
//This could be fake, but is supposed to represent the amount of volunteers
//Logged in when we get to it
//Can change if we never implement this feature
let volunteerAmount = 16;
//Easing on volunteerAmount counter for welcome text, the higher the slwoer
let easing = 64;

let mainBody = document.getElementById("main-body");

//Encpompases the welcome image and the welcome text
let welcomeImageParallax = document.createElement("div");
welcomeImageParallax.setAttribute("class", "welcome-container");

//Just the welcome text
let welcomeImageText = document.createElement("div");
welcomeImageText.setAttribute("class", "welcome-text");

welcomeImageParallax.innerHTML += "<img src = '../../static/images/welcomeImage-1.jpg'>";
welcomeImageText.innerHTML += "<p id='participation'></p>";
welcomeImageText.innerHTML += "<button id='get-started'>Get Started</button>";
welcomeImageText.innerHTML += "<p id='sub-participation'></p>";



let y = window.pageYOffset;

//This handles the mouse image movement
function  parallax(){
    document.querySelectorAll(".welcome-container img").forEach(function (move){
        
        let x = 0;
        y += (window.pageYOffset / 2 - y) / 16;

        move.style.transform = "translateX(" + x + "px) translateY(" + y + "px) translateX(-10%) translateY(-10%)" ;
    })
}

//Handles the count up for volunteering amount
setInterval(function() {
    count += (volunteerAmount - count) / easing;
    let participation = document.getElementById("participation");
    // let getstarted = document.getElementById("get-started");
    let subtext = document.getElementById("sub-participation");

    participation.innerHTML = "Only " + Math.ceil(count) + "% of people volunteer at least once a month";
    // getstarted.innerHTML = "<a href='/listingspage'>GET STARTED</a>";
    subtext.innerHTML = "and help to change the world." + "<a href='/listingspage'></a>";

    parallax();
}, 5);

//add elements to html
welcomeImageParallax.appendChild(welcomeImageText);
mainBody.appendChild(welcomeImageParallax);

let requirements = document.createElement("div");
requirements.setAttribute("class", "requirements-row");
requirements.setAttribute("id", "section1");

//The requirements row after the welcome text
requirements.innerHTML += "<figure><img src = '../../static/images/speed.png'><h1>FAST</h1><p>The new fast way to connect volunteers to charitable organisations</p></figure>";
requirements.innerHTML += "<figure><img src = '../../static/images/simple.png'><h1>SIMPLE</h1><p>Contacting with organisations simple and handled the way you want</p></figure>";
requirements.innerHTML += "<figure><img src = '../../static/images/access.png'><h1>ACCESS</h1><p>Connect with thousands of charitable organisations across the globe</p></figure>";

mainBody.appendChild(requirements);

document.body.scrollTo(0,0);


let getStartedButton = document.getElementById("get-started");
    getStartedButton.addEventListener("click", function() {
    window.location.href = AddQueryParameter("/listingspage", "search", "");
    });
