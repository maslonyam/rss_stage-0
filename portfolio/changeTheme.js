const button = document.querySelector(".theme-toggle__input");
const toggle = document.querySelector(".header__theme-toggle");
const textElems = document.querySelectorAll("a, li, label, span, p, h1, h2, h3, h4, button");
const background = document.querySelector(".body")
const sectionTitle = document.querySelectorAll(".section-title");
const sectionWrapper = document.querySelectorAll(".section-title_wrapper");
const headerBack = document.querySelector(".header-container");
const heroBack = document.querySelector(".hero");
const contactBack = document.querySelector(".contacts");
const buttons = document.querySelectorAll(".hero-button, .contacts__button");
const menu = document.querySelector(".header__navigation");
const logos = document.querySelectorAll(".header__logo-link, .socials-item__link, .video-player__button");
const menuIcon = document.querySelectorAll(".header__menu-icon");

export default function themeSwitcher() {
  button.addEventListener("change", function() {
    toggle.classList.toggle("theme-toggle_light-theme");

    textElems.forEach(textElem => {
      textElem.classList.toggle("text_light-theme");
    });

    background.classList.toggle("back_light-theme");

    sectionTitle.forEach(title => title.classList.toggle("section-title_light-theme"));

    sectionWrapper.forEach(wrapper => wrapper.classList.toggle("section-title_wrapper_light-theme"));

    headerBack.classList.toggle("header_light")

    heroBack.classList.toggle("hero_light");

    contactBack.classList.toggle("contacts_light");

    buttons.forEach(button => button.classList.toggle("button_light"));

    menu.classList.toggle("header__navigation_light");

    logos.forEach(logo => { 
      logo.classList.remove("text_light-theme");
      logo.classList.toggle("logos_light")
    });

    menuIcon.forEach(icon => icon.classList.toggle("menu-icon_light"))
  });
}