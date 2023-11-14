//RIGHT PANEL COMPONENTS
//Something cool to do is to create a html body object that contains promises and display functions
//I think we would benefit from some abstraction

async function DisplayRightPanel() {

  await DisplayLeftPanel();

  let listingsContainer = document.createElement("div");
  listingsContainer.setAttribute("class", "listingsContainer");

  let listingHeader = document.createElement("div");
  listingHeader.setAttribute("class", "listingHeader");

  //Search bar
  let searchContainer = document.createElement('div')
  searchContainer.setAttribute('class', 'search-container');

  //This search bar invokes search() in index.py
  //Also implements the search submit magnifying glass
  let searchForm = document.createElement('form')
  searchForm.setAttribute('method', 'POST');
  searchForm.setAttribute('action', '/search');

  let listingSearch = document.createElement('input')
  listingSearch.setAttribute('type', 'text');
  listingSearch.setAttribute('placeholder', 'Search');
  listingSearch.setAttribute('name', 'search');
  listingSearch.setAttribute('id', 'listingSearch');

  searchForm.appendChild(listingSearch);

  searchContainer.appendChild(searchForm);
  listingHeader.append(searchContainer);

  listingHeader.innerHTML += "<h1>Listings</h1>";

  listingsContainer.appendChild(listingHeader);

  let allListings = document.createElement('div');
  allListings.setAttribute("class", "allListings")

  for (let listingID in data["listings"]) {
    let listing = data["listings"][listingID];

    let listingDiv = document.createElement("div");
    listingDiv.setAttribute("class", "listing");

    let listingDescripDiv = document.createElement("div");
    listingDescripDiv.setAttribute("class", "listing-descrip");
    listingDescripDiv.setAttribute("style", "display: flex; justify-content: space-between; align-items: center; width: 100%; z-index:100;");

    let anchor = document.createElement("a");
    anchor.setAttribute('style','cursor:pointer');
    anchor.setAttribute('onclick','window.location = AddQueryParameter("/listingpage", "id", '+listing.ListingID+');');
    anchor.innerHTML += listing.Title;

    let deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("class", "fa fa-trash");
    deleteIcon.setAttribute("aria-hidden", "true");
    deleteIcon.setAttribute("style", "margin:0.5rem");
    deleteIcon.setAttribute("onclick", "remove("+listing.ListingID+");")

    listingDescripDiv.appendChild(anchor);
    if(canEdit) listingDescripDiv.appendChild(deleteIcon);

    listingDiv.appendChild(listingDescripDiv);
    listingDiv.innerHTML += "<p>" + listing.Description + "</p>";


    allListings.appendChild(listingDiv);
  }

  let handleKeyUp = (e) => {
    allListings.innerHTML = "";
    let search = document.getElementById("listingSearch");

    let filteredListings = data["listings"].filter(l => l.Title.toLowerCase().includes(search.value.toLowerCase()));

    filteredListings.forEach(listing => {
      let listingDiv = document.createElement("div");
      listingDiv.setAttribute("class", "listing");
  
      let listingDescripDiv = document.createElement("div");
      listingDescripDiv.setAttribute("class", "listing-descrip");
      listingDescripDiv.setAttribute("style", "display: flex; justify-content: space-between; align-items: center; width: 100%; z-index:100;");
  
      let anchor = document.createElement("a");
      anchor.setAttribute('style','cursor:pointer');
      anchor.setAttribute('onclick','window.location = AddQueryParameter("/listingpage", "id", '+listing.ListingID+');');
      anchor.innerHTML += listing.Title;
  
      let deleteIcon = document.createElement("i");
      deleteIcon.setAttribute("class", "fa fa-trash");
      deleteIcon.setAttribute("aria-hidden", "true");
      deleteIcon.setAttribute("style", "margin:1rem");
      deleteIcon.setAttribute("onclick", "remove("+listing.ListingID+");")
  
      listingDescripDiv.appendChild(anchor);
      listingDescripDiv.appendChild(deleteIcon);
  
      listingDiv.appendChild(listingDescripDiv);
      listingDiv.innerHTML += "<p>" + listing.Description + "</p>";
  
  
      allListings.appendChild(listingDiv);
    });
  }

  window.addEventListener("keyup", handleKeyUp);

  listingsContainer.appendChild(allListings);

  panelRight.appendChild(listingsContainer);
  if (canEdit) {
    let addListings = document.createElement("a");
    addListings.setAttribute("class", "add-listings");
    addListings.setAttribute("onclick", "window.location = '/addlisting'");
    addListings.innerHTML += "Add Listings +";

    panelRight.appendChild(addListings);
  }
}

async function remove(id) {
  await DeleteListing(id);
  window.location.reload();
}


DisplayRightPanel();



