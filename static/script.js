const lightSwitch = document.getElementById("lightSwitch");
const button = document.getElementById("lightSwitchButton");
const htmlTheme = document.querySelector("html");


if(getCookie("lightTheme") == "light"){
    lightSwitch.setAttribute("data-theme", "light");
    button.setAttribute("data-theme", "light");
    htmlTheme.setAttribute("data-theme", "light");
}else{
    lightSwitch.setAttribute("data-theme", "dark");
    button.setAttribute("data-theme", "dark");
    htmlTheme.setAttribute("data-theme", "dark");
}


lightSwitch.onclick = function(){
    let now = new Date();
    now.setTime(now.getTime() + 7 * 86400 * 1000);

    if(htmlTheme.getAttribute("data-theme") == "light"){
      htmlTheme.setAttribute("data-theme", "dark");
        button.setAttribute("data-theme", "dark");
        document.cookie = "lightTheme=dark; Expires=" + now.toUTCString() + "; path=/;";
    }else{
      htmlTheme.setAttribute("data-theme", "light");
        button.setAttribute("data-theme", "light");
        document.cookie = "lightTheme=light; Expires=" + now.toUTCString() + "; path=/;";
    }

    
    
};


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

//menu選單

fetch("https://fdsa15963.github.io/menu.json").then(response=>{
  return response.json();
}).then(data=>{
  let menu = document.querySelector(".menu_bar ul");
  
  let HTML = "";
  
  for(let i = 0; i < data.length; i++){
    let href = data[i]["href"];

    if(window.location.href.endsWith(href) && href != "#"){
      HTML += 
      '<li>' +
        '<a href="' + href + '">' + data[i]["ch"] + '</a>' +
      '</li>';

    }else{
      HTML += 
      '<li>' +
        '<a href="' + href + '">' + 
          '<span class="enTxt">' + data[i]["en"] +'</span>' +
          '<span class="chTxt">' + data[i]["ch"] +'</span>' +
        '</a>' +
      '</li>';
    }


    
  }

  menu.innerHTML = HTML;
  
});



//menu小選單

let menu = document.querySelector(".menu_bar_menu");
let menuBarRightNav = document.querySelector(".menu_bar_right_nav");


menu.addEventListener("click", function(){
  menuBarRightNav.innerHTML =
  '<div class="menu_gray_screen"></div>' +
  '<div class="menu_bar_right_area">' +
    '<ul>' +
      '<li>' +
        '<a href="/">首頁</a>' +
      '</li>' +
      '<li>' +
        '<a href="/jsonViewer.html">JsonViewer</a>' +
      '</li>' +
      '<li>' +
        '<a href="/ifs">3</a>' +
      '</li>' +
      '<li>' +
        '<a href="">4</a>' +
      '</li>' +
      '<li>' +
        '<a href="">5</a>' +
      '</li>' +
      '<li>' +
        '<a href="#">6</a>' +
      '</li>' +
      '<li>' +
        '<a href="/contact">聯絡我們</a>' +
      '</li>' +
    '</ul>' +
  '</div>';

  let menuGrayScreen = document.querySelector(".menu_gray_screen");

  menuGrayScreen.addEventListener("click", function(){
    menuBarRightNav.innerHTML = "";
  });
});


