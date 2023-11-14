const pinInput = document.getElementById("pin-input");

pinInput.addEventListener("input", (e) => {
  const input = e.target;

  if (input.value.length === 1) {
    const nextInput = input.nextElementSibling;

    if (nextInput !== null) {
      nextInput.focus();
    } else {
      input.blur();
    }
  }

  if (input.value.length === 6) {
    SubmitPin();
  }
});

pinInput.addEventListener("keydown", (e) => {
  const input = e.target;

  if (e.key === "Backspace" && input.value.length === 0) {
    const previousInput = input.previousElementSibling;

    if (previousInput !== null) {
      previousInput.focus();
    }
  }
});

async function SubmitPin(){
  let pin = "";
  for(let i = 1; i<=6; i++){ 
    pin+= document.getElementById("pin" + i).value
  }
  console.log("pin entered" + pin)
  const response = await VerifyEmail(pin);        
  console.log(response.status)
  console.log(response)
  if(response.status == "success"){
    console.log(response)
    // navigate to org page
    const orgid = await isLoggedIn();
    const newurl = window.location.origin + "/organisationpage";
    const queryUrl = AddQueryParameter(newurl, "OrganisationID", orgid.OrganisationID);
    window.location.href = queryUrl;
  } else {
    // report error
    const errorElement = document.getElementById("pin-error");
    errorElement.textContent = "Incorrect PIN";
  }
}

function goBack() {
    window.history.back();
  }


  async function ResendEmail(){

    let response = await ResendEmailVerification();

    if(response.status == "success"){
        console.log(response)
      }
    }
      

