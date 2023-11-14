//TODO: abstract to class with empty async function

let session_images = [];
let icon_images = [];

let session_images_url = [];
let icon_images_url = [];

let dark_mode = false;


function GenerateLeftPanel(element) {
    element.innerHTML += "<a onclick=\"window.location = '/organisationpage'\">Back to organisation page</a>";
    // element.innerHTML += "<a>Toggle Dark Mode</a>";

    // Add a button to toggle dark mode
    const darkModeButton = document.createElement('a');
    darkModeButton.setAttribute('class', 'darkmode-button');
    darkModeButton.textContent = 'Toggle Dark Mode';
    darkModeButton.addEventListener('click', () => {
        // Toggle the 'dark-mode' class on the <body> element
        document.body.classList.toggle('dark-mode');
        let item = document.querySelector('.add-Host');

        dark_mode = !dark_mode;
        item.style.setProperty('--innerColor', dark_mode ? '#555555' : 'white')
        item.style.setProperty('--innerColor2', dark_mode ? '#333333' : 'darkseagreen')
    });
    element.appendChild(darkModeButton);
}

function GenerateRightPanelDescription(element) {

    let iconContainer = document.createElement('div')
    iconContainer.setAttribute('class', 'icon-container')

    GenerateDragAndDrop(iconContainer, ' icon-drag-container drag-container', icon_images, icon_images_url, true, 'Drag Image for Icon');

    let form = this.document.createElement("form");

    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("onsubmit", "return AddListingFromForm(this.form);");
    form.addEventListener('submit', (e) => e.preventDefault());

    let inputContainer = document.createElement('div')
    inputContainer.setAttribute('class', 'input-container')

    inputContainer.innerHTML += "<label for='title'>Listing Title</label>";
    inputContainer.innerHTML += "<input type='text' id='title' name='title' placeholder='Listing title'>";
    inputContainer.innerHTML += "<label for='description'>Listing Description</label>";
    inputContainer.innerHTML += "<textarea type='text' id='ldesc' class='ldesc' name='description' placeholder='Listing description'></textarea>";
    inputContainer.innerHTML += "<label for='date'>Date Of Event</label>";
    inputContainer.innerHTML += "<input type='date' id='date' name='date'>";

    let autDiv = document.createElement('div');
    autDiv.setAttribute('class', 'container');

    let autoComplete = document.createElement('input');
    autoComplete.setAttribute('id', 'autocomplete');
    autoComplete.setAttribute('class', 'autocomplete');
    autoComplete.setAttribute('placeholder', 'Address of the Event');
    autoComplete.setAttribute('onFocus', 'geolocate()');
    autoComplete.setAttribute('type', 'text');

    let address = document.createElement('div');
    address.setAttribute('class', 'address-form')

    let street = document.createElement('input');
    street.setAttribute('id', 'street_number');
    street.setAttribute('class', 'street_number');
    street.setAttribute('type', 'text');

    let route = document.createElement('input');
    route.setAttribute('id', 'route');
    route.setAttribute('class', 'route');
    route.setAttribute('type', 'text');

    let state = document.createElement('input');
    state.setAttribute('id', 'route');
    state.setAttribute('class', 'route');
    state.setAttribute('type', 'text');

    let city = document.createElement('input');
    city.setAttribute('id', 'locality');
    city.setAttribute('class', 'locality');
    city.setAttribute('type', 'text');

    let zip = document.createElement('input');
    zip.setAttribute('id', 'postal_code');
    zip.setAttribute('class', 'postal_code');
    zip.setAttribute('type', 'text');

    let country = document.createElement('input');
    country.setAttribute('id', 'country');
    country.setAttribute('class', 'country');
    country.setAttribute('type', 'text');

    // address.appendChild(street);
    // address.appendChild(route);
    // address.appendChild(city);
    // address.appendChild(zip);
    // address.appendChild(country);

    inputContainer.innerHTML += "<label for='address'>Event Address</label>";
    autDiv.appendChild(autoComplete);
    autDiv.appendChild(address);

    inputContainer.appendChild(autDiv);
    inputContainer.innerHTML += "<input type='submit' value='Add Listing'>";
    inputContainer.innerHTML += "<p style='color:red' id='errorMsg'></p>";

    //     <div class="container">
    //     <div class="panel panel-primary">
    //       <div class="panel-heading">
    //         <h2 class="panel-title">Add your Address</h2>
    //       </div>
    //       <div class="panel-body">
    //         <input id="autocomplete" placeholder="Enter your address" onFocus="geolocate()" type="text" class="form-control">
    //         <div id="address">
    //           <div class="row">
    //               <label class="control-label">Street address</label>
    //               <input class="form-control" id="street_number" disabled="true">
    //               <label class="control-label">Route</label>
    //               <input class="form-control" id="route" disabled="true">
    //           </div>
    //           <div class="row">
    //               <label class="control-label">City</label>
    //               <input class="form-control field" id="locality" disabled="true">
    //               <label class="control-label">State</label>
    //               <input class="form-control" id="administrative_area_level_1" disabled="true">
    //           </div>
    //           <div class="row">
    //               <label class="control-label">Zip code</label>
    //               <input class="form-control" id="postal_code" disabled="true">
    //               <label class="control-label">Country</label>
    //               <input class="form-control" id="country" disabled="true">
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    form.appendChild(inputContainer);

    element.appendChild(iconContainer);
    element.appendChild(form);
}

function GenerateDragAndDrop(element, classattrib, image_list, image_url_target, clear_browse, message = 'Drag and Drop File') {

    let dragContainer = document.createElement('div');
    dragContainer.setAttribute('class', classattrib);

    dragContainer.innerHTML += '<div class="icon"><i class="fa-solid fa-images"></i></div>';

    let dragText = document.createElement('h2');
    dragText.innerHTML += message;
    dragContainer.appendChild(dragText);

    dragContainer.innerHTML += '<h3>Or</h3> ';

    let browseFile = document.createElement('button');
    browseFile.setAttribute('class', 'browseFile');
    browseFile.innerHTML += 'Browse File';
    dragContainer.appendChild(browseFile);

    let inputField = document.createElement('input');
    inputField.setAttribute('type', 'file');
    inputField.setAttribute('style', 'display:none');
    inputField.multiple = true;
    dragContainer.appendChild(inputField);

    let pictureContainer = document.createElement('div');
    pictureContainer.setAttribute('class', 'picture-container');

    element.appendChild(pictureContainer);
    element.appendChild(dragContainer);

    let fileName = document.createElement('div');
    fileName.setAttribute('type', 'fileName');
    element.appendChild(fileName);


    browseFile.addEventListener('click', (e) => {
        e.preventDefault();

        inputField.value = "";
        inputField.click();
    });
    inputField.addEventListener('change', function (e) {
        e.preventDefault();

        file = this.files[0];

        if (clear_browse) image_list = [];
        image_list.push(file);

        fileHandler(image_list);
    });
    dragContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragText.textContent = "Release to upload image"
    });
    dragContainer.addEventListener('dragleave', () => {
        dragText.textContent = "Drag and Drop File"
    });
    dragContainer.addEventListener('drop', (e) => {
        e.preventDefault();

        file = e.dataTransfer.files[0];

        if (clear_browse) image_list = [];
        image_list.push(file);

        fileHandler(image_list);
    });
    const deleteHandler = () => {
        const draggerElement = ` <div class="icon"><i class="fa-solid fa-images"></i></div> <h2>Drag and Drop File</h2> <h3>Or</h3> <button class="browseFile">Browse File</button> <input type="file" hidden id="fileInputField"/>`;
        dragContainer.innerHTML = draggerElement;
        fileName.innerHTML = ""
        dragContainer.classList.remove('active');
    };
    const fileHandler = (files) => {

        if (clear_browse) dragContainer.innerHTML = '';
        image_url_target.length = 0;

        pictureContainer.innerHTML = '';
        var pictureLabels = [];
        for (const file of files) {
            const validExt = ["image/jpeg", "image/jpg", "image/png"]
            if (validExt.includes(file.type)) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    const fileURL = fileReader.result;
                    let imgTag = `<img src=${fileURL} alt=""/>`

                    image_url_target.push(fileURL);

                    pictureContainer.innerHTML += imgTag;
                    let paragraph = `<div class="fileName"><p>${file.name.split('.')[0]}</p><i class="fa-solid fa-trash-can" onclick={deleteHandler()}></i></div>`
                    pictureLabels.push(paragraph);
                }
                fileReader.readAsDataURL(file);
            } else {
                dragText.textContent = "Drag and Drop Files"
            }
        }


        for (const labels of pictureLabels) {
            fileName.innerHTML += labels;
        }
    }
}

async function AddListingFromForm(form) {
    var title = document.getElementById('title').value;
    var ldesc = document.getElementById('ldesc').value;
    var date = document.getElementById('date').value;
    var addr = document.getElementById('autocomplete').value;

    function convertDate(s) {
        var dateSplit = s.split("-");
        return reParsedDate = dateSplit[0].substring(2, 4) + '/' + dateSplit[1] + '/' + dateSplit[2];
    }

    var dateSplit = date.split("-");
    var reParsedDate = dateSplit[0].substring(2, 4) + '/' + dateSplit[1] + '/' + dateSplit[2];

    var currentDate = new Date()
        .toISOString()
        .split("T")[0];

    console.log(addr);

    const listing = {
        'Title': title,
        'Description': ldesc,
        'PostingDate': convertDate(currentDate),
        'VolounteeringDate': convertDate(date),
        'Address': addr,
        'ListingImages': session_images_url,
        'IconImage': icon_images_url[0]
    }

    let msg = document.getElementById('errorMsg');

    if (listing['Title'].trim() == '') msg.innerHTML = 'Please enter a title';
    else if (listing['Description'].trim() == '') msg.innerHTML = 'Please enter a description';
    else if (listing['PostingDate'].trim() == '') msg.innerHTML = 'Please enter a posting date';
    else if (listing['VolounteeringDate'].trim() == '') msg.innerHTML = 'Please enter a volounteering date';
    else if (listing['Address'].trim() == '') msg.innerHTML = 'Please enter an address';
    else if (listing['ListingImages'].length == 0) msg.innerHTML = 'Please add at least one listing image';
    else if (listing['IconImage'] == null) msg.innerHTML = 'Please add an icon image';
    else {
        let response = await AddListing(listing);
        
        window.location = '/addlistingsuccessful';
    }
}

async function Display() {

    let data = {};

    await GetMyOrganisation().then(value => data["organisation"] = value);

    filter = { "Organisation": data["organisation"].Name }
    await FilterListings(filter).then(value => data["listings"] = value.Listings);

    let addHost = document.createElement('div');
    addHost.setAttribute('class', 'add-Host');

    let addContainer = document.createElement('div');
    addContainer.setAttribute('class', 'add-container');

    let leftPanel = document.createElement('div');
    leftPanel.setAttribute('class', 'left-panel');

    let rightPanelContainer = document.createElement('div');
    rightPanelContainer.setAttribute('class', 'right-panel-container');

    let rightPanelTitle = document.createElement('div');
    rightPanelTitle.setAttribute('class', 'right-panel-title');

    let rightPanelData = document.createElement('div');
    rightPanelData.setAttribute('class', 'right-panel-data');

    let rightPanelImages = document.createElement('div');
    rightPanelImages.setAttribute('class', 'right-panel-images');

    let rightPanelDescription = document.createElement('div');
    rightPanelDescription.setAttribute('class', 'right-panel-description');

    GenerateLeftPanel(leftPanel);
    GenerateDragAndDrop(rightPanelImages, 'drag-container', session_images, session_images_url, false);
    GenerateRightPanelDescription(rightPanelDescription);
    rightPanelTitle.innerHTML += "<h1>Add Listing</h1>";

    rightPanelData.appendChild(rightPanelImages);
    rightPanelData.appendChild(rightPanelDescription);

    rightPanelContainer.appendChild(rightPanelTitle);
    rightPanelContainer.appendChild(rightPanelData);

    addContainer.appendChild(leftPanel);
    addContainer.appendChild(rightPanelContainer);

    addHost.appendChild(addContainer);
    document.body.appendChild(addHost);

    let item = document.querySelector('.add-Host');
    item.style.setProperty('--innerColor', 'white')
    item.style.setProperty('--innerColor2', 'darkseagreen')
}

