let slideIndex = -1;
let listingSlideElements = [];
const listingslideimages = [];

function subtractMonths(date, months) {
  date.setMonth(date.getMonth() - months);
  return date;
}

function convertDateBack(s) {
  const dateSplit = s.split("-");
  return dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0].substring(2, 4);
}

function intToDate(d) {
  return subtractMonths(new Date('20' + d.substring(0, 2), d.substring(2, 4), d.substring(4, 6)), 1);
}

async function CreateIcon(element, orgID){
  let iconDiv = document.createElement("div");
  iconDiv.setAttribute("class", "iconcontainer");
  iconDiv.setAttribute("id", "iconcontainer");
  iconDiv.setAttribute("title", "Go To Organisation Page");

  let src = '';
  await GetOrganisationImages(orgID).then(value => src = value.org_image_url);
  if(src == null)  src = '../../static/images/defaultIcon.jpg';
  iconDiv.innerHTML += "<img class = 'icon' id = 'icon' src = '" + src + "'>";

  iconDiv.innerHTML += '<svg preserveAspectRatio="none" id="svgCircle">' +
    '<linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="5%" stop-color="#01E400"></stop>' +
    '<stop offset="25%" stop-color="#FEFF01"></stop>' +
    '<stop offset="40%" stop-color="#FF7E00"></stop>' +
    '<stop offset="60%" stop-color="#FB0300"></stop>' +
    '<stop offset="80%" stop-color="#9B004A"></stop>' +
    '<stop offset="100%" stop-color="#7D0022"></stop>' +
    '</linearGradient>' +
    '<circle class="circle" id="circle" r = 52% cx = 50% cy = 50% stroke="url(#linearColors)" stroke-width="1" fill-opacity="0" />' +
    '</svg>';

    element.appendChild(iconDiv);
}

async function LoadSlides(element, listing) {
  let listingimages = document.createElement("div");
  listingimages.setAttribute("class", "listingslides");
  listingimages.setAttribute("id", "listingslides");

  let src = [];
  await GetListingListingImages(listing.ListingID).then(value => src = value.listing_image_urls);
  console.log(src);
  for (let srcs of src) {
    listingslideimages.push(srcs);
  }

  let leftchev = document.createElement('i');
  leftchev.setAttribute('class', 'fa fa-chevron-left');
  leftchev.setAttribute('id', 'lSlide');
  leftchev.setAttribute('aria-hidden', 'true');
  leftchev.setAttribute('style', 'position:absolute; z-index:500; left: 0; cursor:pointer; color: #555555; margin: 1rem');

  let rightchev = document.createElement('i');
  rightchev.setAttribute('class', 'fa fa-chevron-right');
  rightchev.setAttribute('id', 'rSlide');
  rightchev.setAttribute('aria-hidden', 'true');
  rightchev.setAttribute('style', 'position:absolute; z-index:500; right: 0; cursor:pointer; color: #555555;  margin: 1rem');

  if (listingslideimages.length != 0) {
    element.appendChild(leftchev);
    element.appendChild(rightchev);
  }
  var i = 0;
  for (image of listingslideimages) {
    let fig = document.createElement('figure');
    fig.setAttribute('id','fig'+i)
    const img = document.createElement('img');
    img.setAttribute('src', image);
    img.setAttribute('width', '120px');

    fig.appendChild(img);
    listingSlideElements.push(fig);

    listingimages.appendChild(fig);

    if (i == slideIndex) {
      fig.setAttribute('style', 'z-index: 11');
    }
    else {
      let difference = 1.05 - Math.abs(slideIndex - i) / 12;
      fig.setAttribute('class', '');
    }
    i++;
  }
  element.appendChild(listingimages);

  // loadingElement.innerHTML = '';
  // loadingElement.setAttribute('style', 'display:none')
}

async function DisplayNav() {

  const eventID = GetQueryParameter(window.location.href, 'id');

  let sideBarHost = document.createElement('div', 'sideBarHost');
  sideBarHost.setAttribute('class', 'sideBarHost');
  sideBarHost.setAttribute('id', 'sideBarHost');

  let sideBar = document.createElement('div', 'sideBar');
  sideBar.setAttribute('class', 'sideBar');

  let listing;
  await GetListing(eventID).then(value => listing = value);
  let org;
  await GetOrganisation(listing.OrganisationID).then(value => org = value);

  await CreateIcon(sideBar, org.OrganisationID);

  let src = '';
  await GetListingIconImages(eventID).then(value => src = value.icon_image_url);
  let icon = document.createElement('img');
  icon.setAttribute('src', src);
  icon.setAttribute('id', 'listing-icon');

  let listingInfoDiv = document.createElement('div');
  listingInfoDiv.setAttribute('class', 'info-div')

  listingInfoDiv.innerHTML += '<h1>' + listing.Title + '</h1>';
  listingInfoDiv.innerHTML += '<h2><i class="fa fa-map-marker" aria-hidden="true"></i> ' + listing.Address + '</h2>';

  let dates = document.createElement('div');
  dates.setAttribute('class', 'date-div')
  dates.setAttribute('style', 'display: flex; justify-content: space-between; ')

  let posting = intToDate(listing.PostingDate);
  let ending = intToDate(listing.VolounteeringDate);

  dates.innerHTML += '<h2><b>Posted:</b> ' + posting.toLocaleDateString("en-US") + '</h2>';
  dates.innerHTML += '<h2><b>Event Starting At:</b> ' + ending.toLocaleDateString("en-US") + '</h2>';

  listingInfoDiv.appendChild(dates);

  listingInfoDiv.innerHTML += '<h2><i class="fa fa-envelope" aria-hidden="true"></i> ' + org.Email + '</h2>';
  listingInfoDiv.innerHTML += '<h2><i class="fa fa-phone" aria-hidden="true"></i> ' + org.PhoneNumber + '</h2>';

  let listingDescription = document.createElement('div');
  listingDescription.setAttribute('class', 'desc-div')

  sideBar.appendChild(icon);
  sideBar.appendChild(listingInfoDiv);

  let slides = document.createElement('div');
  slides.setAttribute("class", "listingslides-container");
  slides.setAttribute("id", "listingslides-container");

  await LoadSlides(slides, listing);
  sideBar.appendChild(slides);

  listingDescription.innerHTML += '<h1>Description</h1>';
  listingDescription.innerHTML += '<h2>' + listing.Description + '</h2>';
  
  sideBar.appendChild(listingDescription);
  sideBarHost.appendChild(sideBar);

  sideBarHost.innerHTML += '<button class="sidebar-toggle"><i class="fa-solid fa-plus"></i></button>';

  document.body.appendChild(sideBarHost);
  configureOrganisationRedirect(document.getElementById('iconcontainer'), org.OrganisationID);

  moveSlideShow(1);

  if (listingslideimages.length != 0) {
    document.getElementById('rSlide').addEventListener("click", () => { moveSlideShow(1) });
    document.getElementById('lSlide').addEventListener("click", () => { moveSlideShow(-1) });
  }

  var toggleBtn = document.querySelector('.sidebar-toggle');

  toggleBtn.addEventListener('click', function () {
    toggleBtn.classList.toggle('is-closed');
    sideBarHost.classList.toggle('is-closed');
  })
}


function moveSlideShow(amount) {
  console.log(listingSlideElements);
  slideIndex += amount;

  slideIndex = slideIndex <= listingSlideElements.length - 1 ? slideIndex : 0;
  slideIndex = slideIndex >= 0 ? slideIndex : listingSlideElements.length - 1;

  var i = 0;
  for (image of listingSlideElements) {
    if (i == slideIndex) {
      document.getElementById('fig'+i).setAttribute('class', 'active-slide');
      document.getElementById('fig'+i).setAttribute('style', 'z-index: 11');
    }
    else {
      let difference = 1.08 - Math.abs(slideIndex - i) / 15;
      document.getElementById('fig'+i).setAttribute('class', '');
      document.getElementById('fig'+i).setAttribute('style', 'transform: scale(' + difference + '); z-index: 0;')
    }
    i++;
  }

  this.document.getElementById('listingslides').scrollTo({
    left: document.getElementById('fig'+slideIndex).offsetLeft - document.getElementById('fig'+slideIndex).clientWidth,
    behavior: 'smooth'
  });
}

function configureOrganisationRedirect(element, id) {
  element.onclick = () => {
      window.location = AddQueryParameter('/organisationpage', 'OrganisationID', id);
      console.log(id);
  }
}
