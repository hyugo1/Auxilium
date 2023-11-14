const navBarNames = ["Home", "Organisers", "About"];
let activePage = "Home";

async function DisplayNavbar() {

  var iconstyle = document.createElement('script');

  if(window.location.pathname == '/signuppage' || window.location.pathname == '/loginpage' ) activePage = 'Organisers';
  if(window.location.pathname == '/aboutus') activePage = 'About';

  iconstyle.setAttribute('src', "https://kit.fontawesome.com/82011235a2.js");
  iconstyle.setAttribute('crossorigin', "anonymous");

  document.head.appendChild(iconstyle);

  //Nav bar elements from left to right

  let logged = false;
  await isLoggedIn().then((value) => logged = value.logged_in);
  if (logged) navBarNames.push('Logout');

  //The page you are on TODO: use it lol

  let navbar = document.createElement('div');
  navbar.setAttribute('id', 'navbar');
  navbar.setAttribute('class', 'navbar');

  //Create div for right nav bar buttons
  let navbarElements = document.createElement('div')
  navbarElements.setAttribute('class', 'navbar-elements');

  //Search bar
  let searchContainer = document.createElement('form')
  searchContainer.setAttribute('class', 'search-container');
  searchContainer.setAttribute("id", "search-container");

  //This search bar invokes search() in index.py
  //Also implements the search submit magnifying glass
  searchContainer.innerHTML += "<input submit='text' placeholder='Find Listing' id = 'searchBar' class = 'searchBar'>";
  searchContainer.innerHTML += '<a class="searchButton"><i class="fas fa-search"></i></a>';

  searchContainer.onsubmit = () => {
    let url = AddQueryParameter('/listingspage', 'search', document.getElementById('searchBar').value);
    window.location = url;
    return false;
  }

  navbar.appendChild(searchContainer);


  //Create buttons based on navBarNames
  for (const name of navBarNames) {
    let navButton = document.createElement('a');
    navButton.setAttribute('id', name+'Bar');

    navButton.innerHTML += name;

    if (name == activePage) navButton.setAttribute('class', 'active');
    if (name == "Organisers") navButton.setAttribute('href', '/signuppage');
    if (name == "About") navButton.setAttribute('href', "/aboutus");
    if (name == "Home") navButton.setAttribute('href', "/");
    if (name == "Help us") navButton.setAttribute('href', "https://www.gofundme.com/manage/help-maintain-our-website")
    if (name == "Logout") {
      navButton.setAttribute('href', "/");
      navButton.setAttribute('onclick', "Logout();");
    }

    navButton.setAttribute('style', "text-decoration: none");

    navbarElements.appendChild(navButton);
  }
  navbar.appendChild(navbarElements);

  document.addEventListener("DOMContentLoaded", () => {
    // Check if we are on internet explorer 11
    const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    // get all the links with an ID that starts with 'sectionLink'
    const listOfLinks = document.querySelectorAll("a[href^='#sectionLink");
    // loop over all the links
    listOfLinks.forEach(function (link) {
      // listen for a click
      link.addEventListener('click', () => {

        // toggle highlight on and off when we click a link
        listOfLinks.forEach((link) => {
          if (link.classList.contains('highlighted')) {
            link.classList.remove('highlighted');
          }
        });
        link.classList.add('highlighted');
        // get the element where to scroll
        let ref = link.href.split('#sectionLink');
        ref = "#section" + ref[1];
        // ie 11 does not support smooth scroll, so we will simply scroll
        if (isIE11) {
          window.scrollTo(0, document.querySelector(ref).offsetTop);
        } else {
          window.scroll({
            behavior: 'smooth',
            left: 0,
            // top gets the distance from the top of the page of our target element
            top: document.querySelector(ref).offsetTop
          });
        }
      })
    })
  });

  document.body.appendChild(navbar);
}

DisplayNavbar();