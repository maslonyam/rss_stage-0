import { i18Obj } from "./translate.js";
import themeSwitcher from "./changeTheme.js";

const menuNav = document.querySelector(".header__navigation");
const menuButton = document.querySelector(".header__menu-input");
const navigation = document.querySelector(".navigation-list");
const portfolioButton = document.querySelector(".portfolio-toggle");
const portfolioImages = document.querySelectorAll(".portfolio-item__image");
const langToggle = document.querySelectorAll(".lang-toggle__switch");
const videoPlayButton = document.querySelector(".video-player__button");
const videoPlayControl = document.querySelector(".control-panel__play");
const fullScreenButton = document.querySelector(".control-panel__fullscreen")
const video = document.querySelector("video");
const videoPlayer = document.querySelector(".video-player");
const controlPanel = document.querySelector(".video-player__control-panel");
const volumeButton = document.querySelector(".control-button__volume-button");
const volumeRange = document.querySelector(`[name="volume"]`);
const progress = document.querySelector(".progress-bar__fill")
const progressBar = document.querySelector(".control-panel__progress-bar");

video.volume = 0.5;

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

videoPlayButton.addEventListener("click", isVideoPaused);
videoPlayControl.addEventListener("click", isVideoPaused);
video.addEventListener("click", isVideoPaused);

function isVideoPaused() {
  let isPaused = video.paused;
  isPaused ? playVideo() : pauseVideo();
}

function playVideo() {
  video.play();
  videoPlayControl.style.backgroundImage = "url('./assets/svg/video-player__pause-button.svg')";
  videoPlayButton.style.display = "none";
}

function pauseVideo() {
  video.pause();
  videoPlayControl.style.backgroundImage = "url('./assets/svg/video-player__play-button.svg')";
  videoPlayButton.style.display = "block";
}

function showHideControl() {
  video.addEventListener("mouseover", showControl);
  videoPlayButton.addEventListener("mouseover", showControl);
  controlPanel.addEventListener("mouseover", showControl);

  video.addEventListener("mouseleave", hideControl);
  videoPlayButton.addEventListener("mouseleave", hideControl);
  controlPanel.addEventListener("mouseleave", hideControl);
}

function showControl() {
  controlPanel.style.transform = "translateY(0px)";
}

function hideControl() {
  controlPanel.style.transform = "translateY(50px)";
}

function getFullScreen() {
  fullScreenButton.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
  } else {
      videoPlayer.requestFullscreen();
  } 
  });
}

function updateVolume() {
  volumeRange.addEventListener("input", () => {
    let volumeValue = volumeRange.value;
    volumeRange.style.setProperty("--volume-value", `${volumeValue * 100}%`);
    video.volume = volumeValue;
    if (video.volume === 0) {
      muteVolume();
    } else {
      unmuteVolume();
    }
  });
}

function triggerVolumeButton() {
  volumeButton.addEventListener("click", () => {
    let volume = video.volume;
    if (volume === 0) {
      video.volume = 0.5;
      volume = 50;
      volumeRange.style.setProperty("--volume-value", `${volume}%`);
      volumeRange.value = 0.5;
      unmuteVolume();
    } else {
      volume = 0;
      video.volume = 0;
      volumeRange.style.setProperty("--volume-value", `${volume}%`);
      volumeRange.value = 0;
      muteVolume();
    }
  });
}

function muteVolume() {
  volumeButton.classList.add("mute");
}

function unmuteVolume() {
  volumeButton.classList.remove("mute");
}

function updateProgressBar() {
  progressBar.addEventListener("click", (event) => {
    const progressWidth = window.getComputedStyle(progressBar).width;
    const timeToSkip = event.offsetX / parseInt(progressWidth) * video.duration;

    video.currentTime = timeToSkip;
  });

  setInterval(() => {
    progress.style.width = `${Math.round(video.currentTime / video.duration * 100)}%`;
    if (video.currentTime === video.duration) {
      pauseVideo();
    }
  }, 500)
}

openMenu(menuButton, menuNav);
closeMenu(navigation, menuNav, menuButton);
changePortfolioImages(portfolioButton, portfolioImages)
getTranslate(langToggle);
themeSwitcher();
preloadImages();
showHideControl();
getFullScreen();
updateVolume();
triggerVolumeButton();
updateProgressBar();
