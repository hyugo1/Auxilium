// Get the button:
let topbutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topbutton.style.display = "block";
  } else {
    topbutton.style.display = "none";
  }
}


function topFunction() {
  let nowposition = document.documentElement.scrollTop || document.body.scrollTop; // for chrome, firefox, IE and opera || for safari
  if (nowposition > 0) {
    // Calculate the distance to scroll based on the current position
    window.requestAnimationFrame(topFunction);
    window.scrollTo(0, nowposition - nowposition / 7);
  }
}


async function initMap() {

  await DisplayNav();

  const eventID = GetQueryParameter(window.location.href, 'id');
  var listing = await GetListing(eventID);

  var options = {
    zoom: 15,
    center: { lat: listing.Latitude, lng: listing.Longitude }
  }
  var map = new google.maps.Map(document.getElementById("map"), options);

  // Function for adding a marker to the page.
  function addMarker(location) {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }

  // Testing the addMarker function
  venue = new google.maps.LatLng(listing.Latitude, listing.Longitude);
  addMarker(venue);
}

function get_date(listing) {
  const eventID = GetQueryParameter(window.location.href, 'id');
  var listing = new GetListing(eventID);
  const volounteeringDate = convertDateBack(listing.VolounteeringDate);
  const eventDate = new Date(volounteeringDate);

  function updateCountdown() {
    const currentDate = new Date();
    const difference = eventDate - currentDate;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    document.getElementById('volounteeringdate').innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    setTimeout(updateCountdown, 1000);

    if (difference <= 0) {
      document.getElementById('volounteeringdate').innerHTML = "This event has already expired";
    } else {
      document.getElementById('volounteeringdate').innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      setTimeout(updateCountdown, 1000);
    }
  }

  updateCountdown();
}

function convertDateBack(s) {
  const dateSplit = s.split("-");
  return dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0].substring(2, 4);
}

