import artists from './artistsBase.js';

const audio = new Audio();
audio.volume = 0.75;

const playButton = getElement('.control__button-play');
const time = getElement('.control__time');
const volumeBar = getElement('.volume-bar');
const trackList = getElement('.discography__track-list');
const preloadScreen = getElement('.preload');

function getLocalStorage() {
  if (localStorage.getItem('artist')) {
    const artist = localStorage.getItem('artist');
    changeArtist(artist);
  }
}

window.addEventListener('load', getLocalStorage());

function playCurrentTrack() {
  let currentTime = 0;

  playButton.addEventListener('click', () => {
    let currentButtons = getCurrentButtons();
    const info = getTrackInfo(playButton);
    currentTime = audio.currentTime;

    if (audio.paused && currentTime === 0) {
      currentButtons = getCurrentButtons();
      audio.currentTime = currentTime;
      audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
      playAudio(currentButtons);
    } else if (audio.paused && currentTime > 0) {
      audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
      audio.currentTime = currentTime;
      playAudio(currentButtons);
    } else if (!audio.paused && currentTime > 0) {
      currentButtons = getCurrentButtons();
      currentTime = audio.currentTime;
      pauseAudio(currentButtons);
    }
  });
}

function playNextPrev() {
  const buttonNext = getElement('.control__button-next');
  const buttonPrev = getElement('.control__button-prev');
  let buttonFromTrackList;
  let currentButtons = getCurrentButtons();
  let index = 0;

  buttonNext.addEventListener('click', () => {
    const info = getTrackInfo(playButton);
    const albums = Object.keys(artists[info.artist].albums);
    let tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
    if (tracksArray.length > 1 && info.track !== tracksArray[tracksArray.length - 1]) {
      index = tracksArray.indexOf(info.track) + 1;
      info.track = tracksArray[index];
    } else if (info.track === tracksArray[tracksArray.length - 1] && info.album !== albums[albums.length - 1]) {
      info.album = albums[albums.indexOf(info.album) + 1];
      tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
      info.track = tracksArray[0];
    } else if (info.album === albums[albums.length - 1]) {
      info.album = albums[0];
      info.track = tracksArray[0];
    }

    buttonFromTrackList = getElement(`.track-item__play[data-album=${info.album}][data-track=${info.track}]`);
    setCurrentAttr(buttonFromTrackList);
    currentButtons = getCurrentButtons();
    updateCurrentTrack(info.artist, info.track, info.album);
    pauseAudio(document.querySelectorAll('[data-current=false]'));
    audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
    playAudio(currentButtons);
  });

  buttonPrev.addEventListener('click', () => {
    const info = getTrackInfo(playButton);
    const albums = Object.keys(artists[info.artist].albums);
    let tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
    if (tracksArray.length > 1 && info.track !== tracksArray[0]) {
      index = tracksArray.indexOf(info.track) - 1;
      info.track = tracksArray[index];
    } else if (info.track === tracksArray[0] && info.album !== albums[0]) {
      info.album = albums[albums.indexOf(info.album) - 1];
      tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
      info.track = tracksArray[tracksArray.length - 1];
    } else if (info.album === albums[0]) {
      info.album = albums[albums.length - 1];
      tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
      info.track = tracksArray[tracksArray.length - 1];
    }

    buttonFromTrackList = getElement(`.track-item__play[data-album=${info.album}][data-track=${info.track}]`);
    setCurrentAttr(buttonFromTrackList);
    currentButtons = getCurrentButtons();
    updateCurrentTrack(info.artist, info.track, info.album);
    pauseAudio(document.querySelectorAll('[data-current=false]'));
    audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
    playAudio(currentButtons);
  });
}

function autoSkip() {
  setInterval(() => {
    if (audio.currentTime === audio.duration) {
      let buttonFromTrackList;
      let currentButtons = getCurrentButtons();
      let index = 0;
      const info = getTrackInfo(playButton);
      const albums = Object.keys(artists[info.artist].albums);
      let tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);

      if (tracksArray.length > 1 && info.track !== tracksArray[tracksArray.length - 1]) {
        index = tracksArray.indexOf(info.track) + 1;
        info.track = tracksArray[index];
      } else if (info.track === tracksArray[tracksArray.length - 1] && info.album !== albums[albums.length - 1]) {
        info.album = albums[albums.indexOf(info.album) + 1];
        tracksArray = Object.keys(artists[info.artist].albums[info.album].tracks);
        info.track = tracksArray[0];
      } else if (info.album === albums[albums.length - 1]) {
        info.album = albums[0];
        info.track = tracksArray[0];
      }

      buttonFromTrackList = getElement(`.track-item__play[data-album=${info.album}][data-track=${info.track}]`);
      setCurrentAttr(buttonFromTrackList);
      currentButtons = getCurrentButtons();
      updateCurrentTrack(info.artist, info.track, info.album);
      pauseAudio(document.querySelectorAll('[data-current=false]'));
      audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
      playAudio(currentButtons);
    }
  }, 500);
}

function interactProgress() {
  const progress = getElement('.control__timeline');

  progress.addEventListener('click', (event) => {
    const progressWidth = window.getComputedStyle(progress).width;
    const timeToSkip = event.offsetX / parseInt(progressWidth) * audio.duration;

    audio.currentTime = timeToSkip;
  });

  setInterval(() => {
    const bar = getElement('.timeline__progress-bar');
    bar.style.width = `${audio.currentTime / audio.duration * 100}%`;
  }, 500);
}

function interactVolume() {
  const volumeButton = getElement('.control__volume');
  const volumeBarScale = getElement('.volume-scale');

  volumeButton.addEventListener('mouseover', () => {
    if (!volumeBar.style.height || volumeBar.style.height == '0px') {
      volumeBar.style.height = '100px';
    } else {
      volumeBar.style.height = '0';
    }
  });

  volumeBar.addEventListener('mouseleave', () => {
    volumeBar.style.height = 0;
  });

  volumeButton.addEventListener('click', () => {
    if (audio.volume === 0) {
      audio.volume = 0.75;
      volumeBarScale.style.height = '75%';
      volumeButton.style.backgroundImage = 'url("assets/svg/volume.svg")';
    } else {
      audio.volume = 0;
      volumeBarScale.style.height = '0%';
      volumeButton.style.backgroundImage = 'url("assets/svg/mute.svg")';
    }
  });

  volumeBar.addEventListener('click', (event) => {
    const volumeScale = window.getComputedStyle(volumeBar).height;
    const newVolumeScale = event.offsetY / parseInt(volumeScale);
    audio.volume = newVolumeScale;
    volumeBarScale.style.height = `${newVolumeScale * 100}%`;
  });
}

function playTrackFromTrackList() {
  let currentTime = 0;

  trackList.addEventListener('click', (event) => {
    let currentButtons = getCurrentButtons();
    if (event.target.classList.contains('track-item__play')) {
      const button = event.target;
      const info = getTrackInfo(button);

      updateCurrentTrack(info.artist, info.track, info.album);
      setTimeforAudio();
      if (audio.paused && button.getAttribute('data-current') === 'true') {
        setCurrentAttr(button);
        audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
        audio.currentTime = currentTime;
        playAudio(currentButtons);
      } else if (audio.paused && button.getAttribute('data-current') === 'false') {
        setCurrentAttr(button);
        currentButtons = getCurrentButtons();
        audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
        currentTime = audio.currentTime;
        playAudio(currentButtons);
      } else if (!audio.paused && button.getAttribute('data-current') === 'true') {
        setCurrentAttr(button);
        currentTime = audio.currentTime;
        pauseAudio(currentButtons);
      } else if (!audio.paused && button.getAttribute('data-current') === 'false') {
        pauseAudio(currentButtons);
        setCurrentAttr(button);
        currentButtons = getCurrentButtons();
        audio.src = `./assets/audio/${info.artist}/${info.album}/${info.track}.mp3`;
        audio.currentTime = 0;
        playAudio(currentButtons);
      }
    }
  });
}

function chooseArtist() {
  const artistsList = getElement('.artists-list');

  artistsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('artist')) {
      const artistName = event.target.getAttribute('data-artist');
      localStorage.setItem('artist', artistName);

      preloadAssets(artistName);
      changeArtist(artistName);
      audio.pause();
      audio.currentTime = 0;
      volumeBar.style.height = '0';
    }
  });
}

function changeArtist(artist = 'awfultune') {
  const background = getElement('.background');
  const artistName = getElement('.artist-name');
  const artistItem = getElement(`input[name=artists][data-artist=${artist}]`);

  playButton.classList.remove('pause');
  playButton.setAttribute('data-artist', artist);
  playButton.setAttribute('data-album', 'album_1');
  playButton.setAttribute('data-track', 'track_1');
  background.style['background-image'] = `url("./assets/img/${artist}/background.jpg")`;

  artistName.textContent = artists[artist].name;
  artistName.setAttribute('data-artist', artist);

  if (trackList.firstChild) {
    while (trackList.firstChild) {
      trackList.removeChild(trackList.firstChild);
    }
    trackList.append(...makeListItems(artist));
  }

  artistItem.checked = true;
  updateCurrentTrack(artist);
  audio.currentTime = 0;
  volumeBar.style.height = '0';
}

function makeListItems(artist) {
  const tracksArray = [];
  const albumsObj = artists[artist].albums;

  for (const album in albumsObj) {
    const { tracks } = albumsObj[album];

    for (const track in tracks) {
      const albumName = document.createElement('h4');
      albumName.className = 'track-item__album text-elem album-name';
      albumName.textContent = albumsObj[album].name;

      const button = document.createElement('button');
      button.setAttribute('data-track', track);

      button.className = 'track-item__play play-button play';
      button.setAttribute('data-artist', artist);
      button.setAttribute('data-album', album);
      if (album === 'album_1' && track === 'track_1') {
        button.setAttribute('data-current', 'true');
      } else {
        button.setAttribute('data-current', 'false');
      }

      button.style.backgroundImage = `url(${albumsObj[album].cover}`;

      const trackHeader = document.createElement('h3');
      trackHeader.className = 'track-item__header text-elem track-name';
      trackHeader.textContent = tracks[track].header;

      const time = document.createElement('p');
      time.className = 'track-item__time text-elem';
      time.textContent = tracks[track].time;

      const trackInfo = document.createElement('div');
      trackInfo.className = 'track-item__info';
      trackInfo.append(trackHeader, albumName);

      const trackItem = document.createElement('li');
      trackItem.className = 'track-list__track-item list-item';
      trackItem.append(button, trackInfo, time);
      tracksArray.push(trackItem);
    }
  }
  return tracksArray;
}

function changeCurrentTime() {
  setInterval(() => {
    const time = getElement('.control__current-time');
    time.textContent = secToMin(audio.currentTime);
  }, 500);
}

function secToMin(num) {
  const notMagicNum = 60;
  const secs = Math.floor(Number(num));
  const mins = Math.floor(Number(secs / notMagicNum));

  return `${mins}:${String(secs % notMagicNum).padStart(2, 0)}`;
}

function setTimeforAudio() {
  audio.addEventListener('loadeddata', () => {
    time.textContent = secToMin(audio.duration);
  });
}

function pauseAudio(buttons) {
  audio.pause();
  buttons.forEach((button) => {
    button.classList.remove('pause');
    button.classList.add('play');
  });
}

function playAudio(buttons) {
  audio.play();
  buttons.forEach((button) => {
    button.classList.remove('play');
    button.classList.add('pause');
  });
}

function updateCurrentTrack(artist, track = 'track_1', album = 'album_1') {
  const albumCover = getElement('.current-track__album-cover');
  const trackHeader = getElement('.current-track__header');
  const albumName = getElement('.current-track__album-header');

  playButton.setAttribute('data-artist', artist);
  playButton.setAttribute('data-album', album);
  playButton.setAttribute('data-track', track);

  albumCover.src = artists[artist].albums[album].cover;
  albumName.textContent = artists[artist].albums[album].name;
  trackHeader.textContent = artists[artist].albums[album].tracks[track].header;
  time.textContent = artists[artist].albums[album].tracks[track].time;
}

function getElement(selector) {
  return document.querySelector(selector);
}

function getCurrentButtons() {
  return document.querySelectorAll('[data-current=true]');
}

function getTrackInfo(elem) {
  const info = new Object();

  info.artist = elem.getAttribute('data-artist');
  info.album = elem.getAttribute('data-album');
  info.track = elem.getAttribute('data-track');

  return info;
}

function setCurrentAttr(button) {
  const buttonsArray = document.querySelectorAll('[data-current]');

  buttonsArray.forEach((elem) => {
    if (elem === button || elem.classList.contains('control__button-play')) {
      elem.setAttribute('data-current', 'true');
    } else if (elem !== button) {
      elem.setAttribute('data-current', 'false');
    }
  });
}

function preloadAssets(artist = 'awfultune') {
  const artistsArray = Object.keys(artists);

  if (artistsArray.indexOf(artist) != (artistsArray.length - 1)) {
    artist = artistsArray[(artistsArray.indexOf(artist)) + 1];
  }

  const albumsNum = Object.keys(artists[artist].albums).length + 1;

  const back = new Image();
  back.src = `./assets/img/${artist}/background.jpg`;
  for (let i = 1; i < albumsNum; i++) {
    const albumCover = new Image();
    albumCover.src = `./assets/img/${artist}/album_${i}.jpg`;
  }

  const albums = Object.keys(artists[artist].albums);
  for (const album of albums) {
    const tracksArray = Object.keys(artists[artist].albums[album].tracks);
    for (let i = 1; i < tracksArray.length + 1; i++) {
      const audio = new Audio();
      audio.src = `./assets/audio/${artist}/${album}/track_${i}.mp3`;
    }
  }
}

function openCloseMenu() {
  const menuButton = getElement(".navigation__menu-input");
  const artistList = getElement(".artists-list");
  menuButton.addEventListener("click", () => {
    artistList.classList.toggle("open-menu");
  });

  artistList.addEventListener("click", event => {
    if (event.target.classList.contains("artist__name")) {
      artistList.classList.remove("open-menu");
    }
    menuButton.checked = false;
  });
}

playCurrentTrack();
playNextPrev();
autoSkip();

playTrackFromTrackList();

interactProgress();
interactVolume();
changeCurrentTime();

chooseArtist();

openCloseMenu();

window.onload = function () {
  preloadScreen.style.transform = 'translateX(100vw)';
  preloadScreen.style.transition = '0.5s';
  preloadAssets();
};
