//Nav bar elements from left to right
const navBarNames = ["Home", "Organisers", "About", "Logout"];
//The page you are on TODO: use it lol
const activePage = "Organisers";

var iconstyle = document.createElement('script');

iconstyle.setAttribute('src', "https://kit.fontawesome.com/82011235a2.js");
iconstyle.setAttribute('crossorigin', "anonymous");

document.head.appendChild(iconstyle);

let navbar = document.createElement('div');
navbar.setAttribute('id', 'navbar');
navbar.setAttribute('class', 'navbar is-closed');

//Create div for right nav bar buttons
let navbarElements = document.createElement('div')
navbarElements.setAttribute('class', 'navbar-elements');

//Create buttons based on navBarNames
for(const name of navBarNames)
{
    let navButton = document.createElement('a');
    navButton.innerHTML += name;

    if(name == activePage) navButton.setAttribute('class', 'active');
    if(name=="Organisers") navButton.setAttribute('href', '/signuppage');
    if(name=="About") navButton.setAttribute('href', "/aboutus");
    if(name=="Home") navButton.setAttribute('href', "/");
    if(name=="Logout") 
    {
      navButton.setAttribute('href', "/");
      navButton.setAttribute('onclick', "Logout();");
    }
    
    navButton.setAttribute('style', "text-decoration: none");

    navbarElements.appendChild(navButton); 
}

navbar.appendChild(navbarElements);

navbar.innerHTML += '<button class="sidebar-toggle is-closed"><i class="fa-solid fa-plus"></i></button>';

document.body.appendChild(navbar);

var toggleBtn = document.querySelector('.sidebar-toggle');

toggleBtn.addEventListener('click', function() {
  toggleBtn.classList.toggle('is-closed');
  navbar.classList.toggle('is-closed');
})
