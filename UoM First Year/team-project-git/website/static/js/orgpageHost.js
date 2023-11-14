let leftSide = false;
let progression = 0;
let easing = 20;
let animRadiusX = 100;
let animRadiusY = 20;
let brightnessVar = 70;

let panelHost = document.createElement("div");
let panelLeft = document.createElement("div");
let panelRight = document.createElement("div");


panelHost.setAttribute("class", "panelHost");

panelLeft.setAttribute("class", "orgPanel");
panelLeft.setAttribute("id", "panelLeft");

panelRight.setAttribute("class", "orgPanel");
panelRight.setAttribute("id", "panelRight");

let loadingElement = document.createElement('div');
loadingElement.setAttribute('class', 'elevatedPanel');
loadingElement.setAttribute('style', 'position:fixed; left:50%; top:0; color: white; font-size:1rem; background-color:#444444');
loadingElement.innerHTML = 'Loading';
document.body.appendChild(loadingElement);
  
const lerp = (x, y, a) => x * (1 - a) + y * a;

let slideIndex = -1;

setInterval(function () {
    let x = Math.sin(progression * Math.PI) * animRadiusX;
    let y = Math.cos(progression * Math.PI) * animRadiusY;

    if (leftSide) progression += (1 - progression) / easing;
    else progression += (0 - progression) / easing;

    panelLeft.style.transform = "translateX(" + -Math.round(x) + "px) translateY(calc(-0% + " + -Math.round(y) + "px))";
    panelRight.style.transform = "translateX(" + Math.round(x) + "px) translateY(calc(-0% + " + Math.round(y) + "px))";

    panelLeft.style.zIndex = progression < 0.5 ? 1 : 0;
    panelRight.style.zIndex = progression > 0.5 ? 1 : 0;

    panelLeft.style.filter = "brightness(" + Math.round(lerp(100, brightnessVar, progression)) + "%)";
    panelRight.style.filter = "brightness(" + Math.round(lerp(brightnessVar, 100, progression)) + "%)";
}, 16);


panelLeft.onclick = () => leftSide = false;
panelRight.onclick = () => leftSide = true;

panelHost.appendChild(panelLeft);
panelHost.appendChild(panelRight);

document.body.appendChild(panelHost);

let item = document.querySelector('.panelHost');
item.style.setProperty('--innerColor', 'white')
item.style.setProperty('--innerColor2', 'darkseagreen')
item.style.setProperty('--innerColor3', 'white')
item.style.setProperty('--innerColor4', '#444444')
item.style.setProperty('--innerColor5', '#555555')