import { i18Obj } from "./translate.js";
import themeSwitcher from "./changeTheme.js";

const menuNav = document.querySelector(".header__navigation");
const menuButton = document.querySelector(".header__menu-input");
const navigation = document.querySelector(".navigation-list");
const portfolioButton = document.querySelector(".portfolio-toggle");
const portfolioImages = document.querySelectorAll(".portfolio-item__image");
const langToggle = document.querySelectorAll(".lang-toggle__switch");

function openMenu(button, menu) {
  button.addEventListener("change", function() {
    menu.classList.toggle("open");
  });
};

function closeMenu(navigation, menu, button) {
  navigation.addEventListener("click", event => {
    if (event.target.classList.contains("navigation-item__link")) {
      menu.classList.remove("open");
      button.checked = false;
    }
  });
};

function changePortfolioImages(button, imgArr) {
  const buttonClass = "portfolio-toggle__button";

  button.addEventListener("click", event => {
    if (event.target.classList.contains(buttonClass)) {
      let season = event.target.getAttribute("data-season");
      changeClassActive(`.${buttonClass}`, event.target);
      imgArr.forEach((img, i) => {
        img.src = `./assets/img/${season}/portfolio__img-${i + 1}.jpg`;
      });
    }
  });
}

function getTranslate(toggle) {
  let text = document.querySelectorAll("[data-i18]");

  toggle.forEach(elem => {
    elem.addEventListener("change", function() {
      let lang = elem.getAttribute("data-lang");
      text.forEach(elem => {
        let i18 = elem.getAttribute("data-i18")
        elem.textContent = i18Obj[lang][i18];
      });
    });
  });
}

function getAtrr(variable, attr) {
  let array = [];
  let nodeList = document.querySelectorAll(variable);

  nodeList.forEach((elem) => array.push(elem.getAttribute(attr)));
  return array;
}

function changeClassActive(variable, activeElem) {
  const array = document.querySelectorAll(variable);

  array.forEach((elem) => {
    elem.classList.remove("active");
  });

  activeElem.classList.add("active");
}

function preloadImages() {
  const seasons = getAtrr(".portfolio-toggle__button", "data-season");

  seasons.forEach((season) => { 
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `./assets/img/${season}/portfolio__img-${i}.jpg`;
    }
  });
}

openMenu(menuButton, menuNav);
closeMenu(navigation, menuNav, menuButton);
changePortfolioImages(portfolioButton, portfolioImages)
getTranslate(langToggle);
themeSwitcher();
preloadImages();