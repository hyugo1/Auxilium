//TODO: abstract to class with empty async function

let currentListing;
let listingCache = [];

function days_between(date1, date2) {

    // The number of milliseconds in one day
    const ONE_MINUTE = 1000 * 60;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(subtractDays(date1,-1) - date2);
    var interval = 'minutes';

    var days = differenceMs / ONE_MINUTE;
    if (days > 60) {
        interval = 'hours';
        days /= 60;
        if (days > 24) {
            interval = 'days';
            days /= 24;

            if (days > 365) {
                interval = 'years';
                days /= 365;
            }
        }
    }
    // Convert back to days and return
    return [Math.round(days), interval];
}

function subtractMonths(date, months) {
    date.setMonth(date.getMonth() - months);
    return date;
  }

  function subtractDays(date, days) {
    date.setDate(date.getDate() - days);
    return date;
  }

function intToDate(d) {
    return subtractMonths(new Date('20' + d.substring(0, 2), d.substring(2, 4), d.substring(4, 6)), 1);
}

async function Display() {

    let data = {};

    let searchFilter = GetQueryParameter(window.location.href, 'search');
    let filter = { 'Title': searchFilter };

    await FilterListings(filter).then(value => data["listings"] = value.Listings);

    await GetOrganisation().then(value => data["organisation"] = value);

    //Note: listingsContainerGrid is the actual inner grid for listings, 
    //listingsContainer is a div for the grid

    let listingsContainerGrid = document.createElement('div');
    listingsContainerGrid.setAttribute('id', 'listings-container-grid');
    listingsContainerGrid.setAttribute('class', 'listings-container-grid');

    let listingsContainerHost = document.getElementById("listings-container-host");
    let listingsContainer = document.getElementById("listings-container");
    listingsContainer.setAttribute('style', 'justify-content:center');

    let foundContents = '<i class="fa fa-search" aria-hidden="true"></i> Found ' + data["listings"].length + ' Listings...';
    let foundText = document.createElement('h1');
    foundText.setAttribute('style', "font-size:1rem; color:seagreen; animation:fadeInGoUp 1s; text-align: center");
    foundText.innerHTML += foundContents;
    listingsContainerHost.appendChild(foundText);
    listingsContainerHost.appendChild(listingsContainerGrid);

    let j = -1
    //Create listings grid format

    let listingPreview = document.createElement('div');
    listingPreview.setAttribute('class', 'listing-preview');
    listingPreview.setAttribute('style', 'flex-basis:0');
    listingsContainer.appendChild(listingPreview);

    for (let listingInfo of data["listings"]) {

        listingCache.push(listingInfo);
        let org = await GetOrganisation(listingInfo.OrganisationID)

        j++;

        let listingElements = document.createElement('div');
        listingElements.setAttribute('class', 'listing-container');
        listingElements.setAttribute('style', 'animation: fadeInGoUp ' + (j + 1) * 0.3 + 's');

        let orgSrc = ''
        await GetOrganisationImages(listingInfo.OrganisationID).then(value => orgSrc = value.org_image_url);
        if(orgSrc == null)  orgSrc = '../../static/images/defaultIcon.jpg';

        let date = intToDate(listingInfo.PostingDate).toLocaleDateString();
        let difference = days_between(intToDate(listingInfo.PostingDate), new Date());
        
        listingElements.onclick = () => {
            currentListing = listingCache[j];

            const allElements = document.querySelectorAll('*');

            if (listingElements.classList.contains('active')) {
                currentListing = null;
                console.log(listingInfo);
            }
            else {
                allElements.forEach((element) => {
                    element.classList.remove('active');
                });
            }

            listingElements.classList.toggle('active');
            let date = intToDate(listingInfo.PostingDate).toLocaleDateString();

            if (currentListing != null) {
                listingPreview.setAttribute('style', 'flex-basis:1');
                listingsContainer.setAttribute('style', 'justify-content:space-between');

                var route = AddQueryParameter('/listingpage', 'id', listingInfo.ListingID);

                listingPreview.classList.add('active-preview');
                listingPreview.innerHTML = '';

                let icon = document.createElement('figure');
                icon.setAttribute('title', 'Go To Organisation Page');
                icon.setAttribute('id', 'previewIcon');

                let iconImage = document.createElement('img');
                
                iconImage.setAttribute('src', orgSrc);

                icon.appendChild(iconImage);

                listingPreview.appendChild(icon);
                listingPreview.innerHTML += "<h1 style='font-weight:400;' class='under-div'>" + org.Name + "</h1> <span style='margin:1rem; font-size:0.8rem; color:gray;'><i class='fa fa-map-marker' aria-hidden='true'></i>" + listingInfo.Title + "</span>";
                listingPreview.innerHTML += "<h1 style='color:gray; font-size:1rem;'><i class='fa fa-calendar-check-o' aria-hidden='true'></i> Posted: " + date + "</h1>"
                listingPreview.innerHTML += "<p style='color:gray; font-size: 0.85rem; line-height: 1rem'>" + listingInfo.Description + "</p>";
                listingPreview.innerHTML += "<a onclick='window.location=\"" + route + "\";'>See More</a>";

                configureOrganisationRedirect(document.getElementById('previewIcon'), listingInfo.OrganisationID);
            }
            else {
                listingPreview.setAttribute('style', 'flex-basis:0');
                listingsContainer.setAttribute('style', 'justify-content:center');

                listingPreview.classList.remove('active-preview');
                listingPreview.innerHTML = '';
            }
        };


        foundText.innerHTML = foundContents + ' (' + j + '/' + data["listings"].length + ')';

        let src = '';
        await GetListingIconImages(listingInfo.ListingID).then(value => src = value.icon_image_url);

        listingElements.innerHTML += "<figure><img src = '" + src + "'></figure>";
        //loop through all values in listings dictionary, process them, and add them to the
        //listing cell
        let listingDescription = document.createElement('div');
        listingDescription.setAttribute('class', 'listing-description');

        listingDescription.innerHTML = "<h1 style='font-size:1.6rem; font-weight:400'>" + listingInfo.Title + "</h1>";
        listingDescription.innerHTML += "<h1 style='color:#666666; font-size:1.1rem; font-weight:500'><i class='fa fa-user' aria-hidden='true'></i> " + org.Name + "</h1>";
        listingDescription.innerHTML += "<h1 style='color:#666666; font-size:1rem; font-weight:400'><i class='fa fa-calendar-check-o' aria-hidden='true'></i> " + date + "</h1>";
        listingDescription.innerHTML += "<h1 style='color:#666666; font-size:1rem; font-weight:400'><i class='fa fa-map-marker' aria-hidden='true'></i></i> " + listingInfo.Address + "</h1>";

        let headerContents = "<i class='fa fa-calendar-check-o' aria-hidden='true'></i> Posted " + difference[0] + ' ' + difference[1] + ' Ago';
        if(Number.isNaN(difference[0]) || difference[1] == 'hours' || difference[2] == 'minutes')
        {
            headerContents = "<i class='fa fa-calendar-check-o' aria-hidden='true'></i> Posted Recently";
        }
        listingDescription.innerHTML += "<h1 style='color:seagreen; font-size:0.8rem; font-weight:400; text-align:right'>" + headerContents + "</h1>";

        listingElements.appendChild(listingDescription);
        listingsContainerGrid.appendChild(listingElements);
    }



    //If no listings found, display null search text and image
    if (data["listings"].length == 0) {
        let nullSearch = document.createElement('div');
        nullSearch.setAttribute('class', 'null-search');

        //TODO: find a better image
        nullSearch.innerHTML += "<img src = '../../static/images/sad.png'>";
        nullSearch.innerHTML += "<none>Couldn't find any listings that matched your search</none>";

        listingsContainer.appendChild(nullSearch);
    }else{
        let l = data["listings"].length;
        foundText.innerHTML = foundContents + ' (' + l + '/' + l + ')';
    }
}

function configureOrganisationRedirect(element, id) {
    element.onclick = () => {
        window.location = AddQueryParameter('/organisationpage', 'OrganisationID', id);
    }
}

Display();

