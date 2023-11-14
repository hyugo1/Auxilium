let editMode = false;

let session_icons = [];
let session_icons_url = [];

let data = {};
let internal_error_state = '';
let canEdit;
const listingslideimages = [];

let listingSlideElements = [];
let dark_mode = false;

function GenerateDescription(element) {
  element.innerHTML = "<h1 style = 'font-size: 1.7rem'>" + data["organisation"].Name + "</h1>";

  let orgDescripContent = document.createElement("div");
  orgDescripContent.setAttribute("class", "elevatedPanel");

  orgDescripContent.innerHTML += "<h1 style='text-align: left; margin-left: 1rem; font-weight:500; color: #eeeeee; '>" + 'About Us:' + "</h1>";
  orgDescripContent.innerHTML += "<p  style='text-align: justify;'>" + data["organisation"].Description + "</p>";

  element.appendChild(orgDescripContent);
}

function GenerateDragAndDrop(element, classattrib, image_list, image_url_target, clear_browse, message = 'Drag and Drop File') {

  let dragContainer = document.createElement('div');
  dragContainer.setAttribute('class', classattrib);
  dragContainer.setAttribute('id', 'dragC');
  dragContainer.setAttribute('style', 'display:none');

  let dragText = document.createElement('h2');
  dragText.setAttribute('id', 'dragText');
  dragText.innerHTML += message;
  dragContainer.appendChild(dragText);

  dragContainer.innerHTML += '<h3>Or</h3> ';

  let browseFile = document.createElement('button');
  browseFile.setAttribute('class', 'browseFile');
  browseFile.setAttribute('id', 'browseFile');

  browseFile.innerHTML += 'Browse File';
  dragContainer.appendChild(browseFile);

  let inputField = document.createElement('input');
  inputField.setAttribute('type', 'file');
  inputField.setAttribute('style', 'display:none');
  inputField.setAttribute('id', 'inputField');

  inputField.multiple = true;
  dragContainer.appendChild(inputField);

  let pictureContainer = document.createElement('div');
  pictureContainer.setAttribute('class', 'picture-container');
  pictureContainer.setAttribute('id', 'picture-container');

  element.appendChild(pictureContainer);
  element.appendChild(dragContainer);

  let fileName = document.createElement('div');
  fileName.setAttribute('type', 'fileName');
  element.appendChild(fileName);

  inputField.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  browseFile.addEventListener('click', () => {
    inputField.value = "";
    inputField.click();
  });

  inputField.addEventListener('change', function (e) {
    file = this.files[0];

    if (clear_browse) image_list = [];
    image_list.push(file);

    fileHandler(image_list);
  });

  dragContainer.addEventListener('dragover', function (e) {
    e.preventDefault();
    dragText.textContent = "Release to upload image"
  });
  dragContainer.addEventListener('dragleave', () => {
    dragText.textContent = "Drag and Drop File"
  });
  dragContainer.addEventListener('drop', function (e) {
    e.preventDefault();
    dragText.textContent = " "

    file = e.dataTransfer.files[0];

    if (clear_browse) image_list = [];
    image_list.push(file);

    fileHandler(image_list);
  });

  const fileHandler = function (files) {
    //dragContainer.innerHTML = '';

    pictureContainer.innerHTML = '';
    var pictureLabels = [];
    image_url_target.length = 0;

    for (const file of files) {
      const validExt = ["image/jpeg", "image/jpg", "image/png"]
      if (validExt.includes(file.type)) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const fileURL = fileReader.result;
          let imgTag = `<img src=${fileURL} alt=""/>`;

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
//DISPLAY

async function LoadSlides(element){
  let listingimages = document.createElement("div");
  listingimages.setAttribute("class", "listingslides");
  listingimages.setAttribute("id", "listingslides");

  for (let listingID of data["listings"]) {
    let src = '';
    await GetListingIconImages(listingID.ListingID).then(value => src = value.icon_image_url);
    listingslideimages.push(src);
  }
  if (listingslideimages.length != 0) {
    element.innerHTML += '<i id="lSlide" class="fa fa-chevron-left" aria-hidden="true" style="position:absolute; z-index:500; left: 0; cursor:pointer;"></i>';
    element.innerHTML += '<i id="rSlide" class="fa fa-chevron-right" aria-hidden="true" style="position:absolute; z-index:500; right: 0; cursor:pointer;"></i>';
  }
  var i = 0;
  for (image of listingslideimages) {
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    img.setAttribute('src', image);
    img.setAttribute('width', '200px');

    fig.appendChild(img);
    listingSlideElements.push(fig);

    listingimages.appendChild(fig);

    if (i == slideIndex) {
      //fig.setAttribute('class', 'active-slide');
      fig.setAttribute('style', 'z-index: 11');
    }
    else {
      let difference = 1.05 - Math.abs(slideIndex - i) / 12;
      fig.setAttribute('class', '');
      //fig.setAttribute('style', 'transform: scale(' + difference + '); z-index: 0;')
    }
    i++;
  }
  element.appendChild(listingimages);

  loadingElement.innerHTML = '';
  loadingElement.setAttribute('style', 'display:none')

  if (listingslideimages.length != 0) {
    document.getElementById("rSlide").addEventListener("click", () => { moveSlideShow(1) });
    document.getElementById("lSlide").addEventListener("click", () => { moveSlideShow(-1) });
  }
  function moveSlideShow(amount) {

    slideIndex += amount;

    slideIndex = slideIndex <= listingSlideElements.length - 1 ? slideIndex : 0;
    slideIndex = slideIndex >= 0 ? slideIndex : listingSlideElements.length - 1;

    var i = 0;
    for (image of listingSlideElements) {
      if (i == slideIndex) {
        image.setAttribute('class', 'active-slide');
        image.setAttribute('style', 'z-index: 11');
      }
      else {
        let difference = 1.08 - Math.abs(slideIndex - i) / 15;
        image.setAttribute('class', '');
        image.setAttribute('style', 'transform: scale(' + difference + '); z-index: 0;')
      }
      i++;
    }

    this.document.getElementById('listingslides').scrollTo({
      left: listingSlideElements[slideIndex].offsetLeft - listingSlideElements[slideIndex].clientWidth,
      behavior: 'smooth'
    });
  }
}

async function DisplayLeftPanel() {

  //LEFT PANEL COMPONENTS
  let logged = false;
  let myID = -1;

  await isLoggedIn().then((value) => logged = value.logged_in);

  //Check if we are on the right page
  if (GetQueryParameter(window.location.href, 'OrganisationID') == null && logged) {
    await GetMyOrganisation().then(value => myID = value.OrganisationID);
    if (myID != null && Number.isInteger(myID)) window.location = AddQueryParameter('/organisationpage', 'OrganisationID', myID);
  }

  await GetOrganisation(GetQueryParameter(window.location.href, 'OrganisationID')).then(value => data["organisation"] = value);

  filter = { "OrganisationID": data["organisation"].OrganisationID }
  await FilterListings(filter).then(value => data["listings"] = value.Listings);

  if (logged) {
    await GetMyOrganisation().then(value => myID = value.OrganisationID);
    canEdit = myID == data["organisation"].OrganisationID;
  }

  //GENERATING DIVS
  let panelFigure = document.createElement("figure");
  panelFigure.setAttribute("class", "orgDescrip");

  let iconDiv = document.createElement("div");
  iconDiv.setAttribute("class", "iconcontainer");

  let iconInputDiv = document.createElement("div");
  iconInputDiv.setAttribute("class", "iconinput");
  iconInputDiv.setAttribute("id", "iconinput");

  //ICON
  GenerateDragAndDrop(iconInputDiv, 'icon-drag-container drag-container', session_icons, session_icons_url, true);

  iconDiv.appendChild(iconInputDiv);

  if (canEdit) {
    let editNav = document.createElement("button");
    editNav.setAttribute("class", "edit-nav");
    editNav.setAttribute("id", "edit-nav");

    editNav.innerHTML += '<i class="fa fa-plus" aria-hidden="true" style = "color: white" class="edit-icon"></i>';

    panelLeft.appendChild(editNav);
  }

  let darkModeNav = document.createElement("button");
  darkModeNav.setAttribute("class", "dark-nav");
  darkModeNav.setAttribute("id", "dark-nav");
  darkModeNav.setAttribute('style', 'transform: translateX(100%)')
  darkModeNav.innerHTML += '<i class="fa fa-moon-o" aria-hidden="true" style = "color: white;" class="dark-icon"></i>';
  panelLeft.appendChild(darkModeNav);

  let src = '';
  await GetOrganisationImages(GetQueryParameter(window.location.href, 'OrganisationID')).then(value => src = value.org_image_url);
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

  panelFigure.appendChild(iconDiv);


  //DESCRIPTION
  let orgDescrip = document.createElement("div");
  orgDescrip.setAttribute("class", "orgDescription");
  orgDescrip.setAttribute("id", "orgDesc");

  GenerateDescription(orgDescrip);

  panelFigure.appendChild(orgDescrip);
  panelLeft.appendChild(panelFigure);

  let stats = document.createElement("div");
  stats.setAttribute("class", "orgStats elevatedPanel");


  let tick = '<div class="tickwrapper">' +
    '<svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">' +
    '<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>' +
    '<path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>' +
    '</svg>' +
    '</div>';

  stats.innerHTML += "<figure><i style='margin:0.5rem; color:gray' class='fa fa-envelope-o fa-2x' aria-hidden='true'></i><p>" + data['organisation'].Email + "</p></figure>";
  stats.innerHTML += "<figure><i style='margin:0.5rem; color:gray' class='fa fa-list-ol fa-2x' aria-hidden='true'></i><p>" + data['listings'].length + " Listings</p></figure>";
  stats.innerHTML += "<figure>" + tick + "<p>Verified</p></figure>";

  panelLeft.appendChild(stats);

  let listingslidesContainer = document.createElement("div");
  listingslidesContainer.setAttribute("class", "listingslides-container");
  listingslidesContainer.setAttribute("id", "listingslides-container");

  LoadSlides(listingslidesContainer);

  panelLeft.appendChild(listingslidesContainer);

  let contact = document.createElement("div");
  contact.setAttribute("class", "contact");

  contact.innerHTML += "<figure><img src = '../../static/images/contacticon.png'><h1>Call Us...</h1></figure>";

  let contactInfo = document.createElement("div");
  contactInfo.setAttribute("class", "contactInfo elevatedPanel");
  contactInfo.setAttribute("id", "contact");

  contactInfo.innerHTML = "<p style='font-size:0.9rem; font-weight:500'><i class='fa fa-envelope-o' aria-hidden='true'></i> " + data['organisation'].Email + "</p>";
  contactInfo.innerHTML += "<p style='font-size:0.9rem; font-weight:500'><i class='fa fa-phone' aria-hidden='true'></i> " + data['organisation'].PhoneNumber + "</p>";

  contact.appendChild(contactInfo);
  panelLeft.appendChild(contact);

  if (canEdit) {
    document.getElementById('edit-nav').addEventListener('click', async function (e) {
      ManageEditToggle(e);
    });
  }

  document.getElementById('dark-nav').addEventListener('click', async function (e) {
    ManageDarkModeToggle(e);
  });

  function ManageDarkModeToggle(e) {
    // Toggle the 'dark-mode' class on the <body> element
    document.body.classList.toggle('dark-mode');
    let item = document.querySelector('.panelHost');

    dark_mode = !dark_mode;

    if(dark_mode)
    {
      document.getElementById('dark-nav').innerHTML = '<i class="fa fa-sun-o" aria-hidden="true" style="color: yellow; animation:fadeInGoUp 0.5s" class="edit-icon"></i>';
    }else{
      document.getElementById('dark-nav').innerHTML = '<i class="fa fa-moon" aria-hidden="true" style="color: white; animation:fadeInGoUp 0.5s" class="edit-icon"></i>';
    }
    
    item.style.setProperty('--innerColor', dark_mode ? '#555555' : 'white')
    item.style.setProperty('--innerColor2', dark_mode ? '#444444' : 'darkseagreen')
    item.style.setProperty('--innerColor3', dark_mode ? '#333333' : 'white')
    item.style.setProperty('--innerColor4', dark_mode ? '#222222' : '#444444')
    item.style.setProperty('--innerColor5', dark_mode ? '#333333' : '#555555')
  }

  async function ManageEditToggle(e) {
    e.preventDefault();

    if (editMode) {
      var editPhone = document.getElementById('orgPhoneEdit');

      var regmm = '^([0|+[0-9]{1,5})?([7-9][0-9]{9})$';
      var regmob = new RegExp(regmm);

      console.log(regmob.test(editPhone.value));

      if ((editMode && !regmob.test(editPhone.value)) && editPhone.value.trim() != '') {
        document.getElementById('errorState').innerHTML = 'Invalid Phone Number';
        return;
      }
    }
    editMode = !editMode;
    document.getElementById('edit-nav').classList.toggle('editing');

    if (editMode) {
      document.getElementById('edit-nav').innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color: darkseagreen; animation:fadeInGoUp 0.5s" class="edit-icon"></i>';

      const iconInputDiv = document.getElementById('iconinput');

      iconInputDiv.innerHTML = '';
      GenerateDragAndDrop(iconInputDiv, 'icon-drag-container drag-container', session_icons, session_icons_url, true);

      document.getElementById('icon').setAttribute('class', 'icon editable')
      document.getElementById('circle').setAttribute('class', 'circle editableC')
      document.getElementById('dragC').setAttribute('style', 'display: flex')
      document.getElementById('picture-container').setAttribute('style', 'display: flex');
      document.getElementById('iconinput').setAttribute('style', 'display: flex');

      document.getElementById('orgDesc').innerHTML = '';
      document.getElementById('orgDesc').setAttribute('style', 'text-align: center');
      document.getElementById('orgDesc').appendChild(GenerateDescriptionForm());

      document.getElementById('contact').innerHTML = '';
      document.getElementById('contact').appendChild(GenerateContactForm());

    } else {
      document.getElementById('edit-nav').innerHTML = '<i class="fa fa-plus" aria-hidden="true" style = "color: white; animation:fadeInGoUp 0.5s" class="edit-icon"></i>';

      document.getElementById('circle').setAttribute('class', 'circle');
      document.getElementById('dragC').setAttribute('style', 'display: none');
      document.getElementById('picture-container').setAttribute('style', 'display: none');
      document.getElementById('iconinput').setAttribute('style', 'display: none');

      let orgDescrip = document.getElementById('orgDesc');
      let orgContact = document.getElementById('contact');

      document.getElementById('dragC').setAttribute('style', 'display: none');

      var editName = document.getElementById('orgUserEdit').value;
      var editDescription = document.getElementById('orgDescEdit').value;
      var editPhone = document.getElementById('orgPhoneEdit').value;

      var origName = data["organisation"].Name;
      var origDescription = data["organisation"].Description;
      var origPhone = data["organisation"].PhoneNumber;

      if (session_icons_url.length != 0) {
        await EditOrganisation(
          {
            'Name': editName.trim() == '' ? origName : editName,
            'Description': editDescription.trim() == '' ? origDescription : editDescription,
            'PhoneNumber': editPhone.trim() == '' ? origPhone : editPhone,
            'OrgImage': session_icons_url[0]
          });
      }
      else {
        await EditOrganisation(
          {
            'Name': editName.trim() == '' ? origName : editName,
            'Description': editDescription.trim() == '' ? origDescription : editDescription,
            'PhoneNumber': editPhone.trim() == '' ? origPhone : editPhone
          });

        console.log(editPhone.trim() == '' ? origPhone : editPhone);
      }
      await GetMyOrganisation().then(value => data["organisation"] = value);

      let icon = document.getElementById('icon');
      if (session_icons_url.length != 0) {
        let src = '';
        await GetOrganisationImages(GetQueryParameter(window.location.href, 'OrganisationID')).then(value => src = value.org_image_url);
        icon.setAttribute('src', src);
      }
      icon.setAttribute('class', 'icon');

      GenerateDescription(orgDescrip);

      orgContact.innerHTML = "<p style='font-size:0.9rem; font-weight:500'><i class='fa fa-envelope-o' aria-hidden='true'></i> " + data['organisation'].Email + "</p>";
      orgContact.innerHTML += "<p style='font-size:0.9rem; font-weight:500'><i class='fa fa-phone' aria-hidden='true'></i> " + data['organisation'].PhoneNumber + "</p>";
    }
  }

  function GenerateDescriptionForm() {
    let form = this.document.createElement("form");

    form.setAttribute("enctype", "multipart/form-data");
    form.addEventListener('submit', (e) => e.preventDefault());

    let inputContainer = document.createElement('div')
    inputContainer.setAttribute('class', 'input-container elevatedPanel')

    inputContainer.innerHTML += "<label for='title'>Organisation Label</label>";
    let title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    title.setAttribute('placeholder', 'Your Organisation Label here');
    title.setAttribute('id', 'orgUserEdit');

    inputContainer.appendChild(title);

    inputContainer.innerHTML += "<label for='description'>Organisation Description</label>";
    inputContainer.innerHTML += "<textarea style='margin: 0' type='text' class='ldesc' name='description' placeholder='Organisation description' id='orgDescEdit'></textarea>";

    form.appendChild(inputContainer);

    return form
  }

  function GenerateContactForm() {
    let form = this.document.createElement("form");

    form.setAttribute("enctype", "multipart/form-data");
    form.addEventListener('submit', (e) => e.preventDefault());

    let inputContainer = document.createElement('div')
    inputContainer.setAttribute('class', 'input-container')

    let phoneInput = '<input type="tel" id="orgPhoneEdit" placeholder="Edit Phone Number">';

    inputContainer.innerHTML += "<p style='font-size:0.9rem; font-weight:500'><i class='fa fa-phone' aria-hidden='true'></i>" + phoneInput + "</p>";
    inputContainer.innerHTML += "<p style='font-size:0.9rem; font-weight:500' id='errorState'></p>";

    form.appendChild(inputContainer);

    return form
  }
}
