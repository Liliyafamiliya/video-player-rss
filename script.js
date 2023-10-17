// ========================VARIABLES========================
const playerContainer = document.querySelector(".player-container");
const tiktok = document.querySelector(".tiktok");
const centerPlayBtn = document.querySelector(".center-play-btn");
const arrows = document.querySelectorAll(".arrow");
const prevBtn = document.querySelector(".arrow-prev");
const nextBtn = document.querySelector(".arrow-next");

const bottomControls = document.querySelector(".player-controls");
const playBtn = document.querySelector(".play-btn");
const progressContainer = document.querySelector(".progress-container");
const filledProgress = document.querySelector(".filled-progress");
const soundControlBtn = document.querySelector(".sound-control");
const volumeContainer = document.querySelector(".volume-container");
const filledVolume = document.querySelector(".filled-volume");
const fullscreen = document.querySelector(".player-fullscreen");

// ========================CHANGE-FADE========================
const changeFade = (element, opacity) => {
  element.style.transition = "all 0.6s";
  element.style.opacity = opacity;
};

// ========================SHOW-CONTROL-BTNS========================
const showControlBtns = () => {
  changeFade(bottomControls, 1);
  changeFade(centerPlayBtn, 1);
  arrows.forEach((arrow) => {
    changeFade(arrow, 1);
  });
};

const hideControlButtons = () => {
  changeFade(bottomControls, 0);
  changeFade(centerPlayBtn, 0);
  arrows.forEach((arrow) => {
    changeFade(arrow, 0);
  });
};

// ========================CENTER-BTNS-MOUSE-HOVER-CHANGING========================
playerContainer.addEventListener("mouseenter", () => {
  if (!tiktok.paused) {
    showControlBtns();
  }
});

playerContainer.addEventListener("mouseleave", () => {
  if (!tiktok.paused) {
    hideControlButtons();
  }
});

// ========================TOGGLE-VIDEO========================
const toggleVideo = () => {
  if (tiktok.paused) {
    tiktok.play();
    playBtn.innerHTML = "❚ ❚";
  } else {
    tiktok.pause();
    playBtn.innerHTML = "►";
  }
};

tiktok.addEventListener("click", toggleVideo);
playBtn.addEventListener("click", toggleVideo);
centerPlayBtn.addEventListener("click", toggleVideo);

// ========================VIDEOS-CHANGING========================
const videos = [
  {
    src: "./assets/videos/dean1.mp4",
    poster: "./assets/pictures/preview1.jpg",
  },
  {
    src: "./assets/videos/dean2.mp4",
    poster: "./assets/pictures/preview2.jpg",
  },
  {
    src: "./assets/videos/dean3.mp4",
    poster: "./assets/pictures/preview3.jpg",
  },
];

let currentVideo = 0;

nextBtn.addEventListener("click", () => {
  tiktok.pause();
  if (currentVideo < videos.length - 1) {
    currentVideo++;
  } else {
    currentVideo = 0;
  }
  loadVideo(videos[currentVideo].src, videos[currentVideo].poster);
});

prevBtn.addEventListener("click", () => {
  tiktok.pause();
  if (currentVideo === 0) {
    currentVideo = videos.length - 1;
  } else {
    currentVideo--;
  }
  loadVideo(videos[currentVideo].src, videos[currentVideo].poster);
  updateProgressBar();
});

// ========================LOAD-VIDEO========================
const loadVideo = (src, poster) => {
  tiktok.src = src;
  tiktok.poster = poster;
  playBtn.innerHTML = "►";
  tiktok.load();
  showControlBtns();
};
loadVideo(videos[currentVideo].src, videos[currentVideo].poster);

// ========================AUTO-VIDEOS-CHANGING========================
tiktok.addEventListener("ended", () => {
  nextBtn.click();
});

// ========================UPDATE-PROGRESS-BAR========================
const updateProgressBar = () => {
  const currentTime = tiktok.currentTime;
  const duration = tiktok.duration;
  const progressPercentage = (currentTime / duration) * 100 || 0;
  filledProgress.style.width = `${progressPercentage}%`;
};

tiktok.addEventListener("timeupdate", updateProgressBar);
// ========================PROGRESS-CONTAINER-MOVING========================
let isProgressDragging = false;

progressContainer.addEventListener("mousedown", () => {
  isProgressDragging = true;
  const progressContainerCoordinates =
    progressContainer.getBoundingClientRect();

  progressContainer.addEventListener("mousemove", (mousemoveEvent) => {
    if (isProgressDragging) {
      const clickX = mousemoveEvent.clientX - progressContainerCoordinates.left;
      const newWidth = (clickX / progressContainerCoordinates.width) * 100;
      const duration = tiktok.duration;
      const newTime = (newWidth / 100) * duration;
      filledProgress.style.width = newWidth + "%";
      tiktok.currentTime = newTime;
    }
  });

  progressContainer.addEventListener("mouseup", () => {
    isProgressDragging = false;
  });
});

document.addEventListener("mouseup", () => {
  isProgressDragging = false;
});

// ========================VOLUME-CHANGING========================
let isVolumeDragging = false;

volumeContainer.addEventListener("mousedown", () => {
  isVolumeDragging = true;
  const volumeContainerCoordinates = volumeContainer.getBoundingClientRect();

  volumeContainer.addEventListener("mousemove", (mousemoveEvent) => {
    if (isVolumeDragging) {
      const clickX = mousemoveEvent.clientX - volumeContainerCoordinates.left;
      const newWidth = (clickX / volumeContainerCoordinates.width) * 100;
      const newVolumeLeveL = newWidth / 100;
      filledVolume.style.width = newWidth + "%";
      tiktok.volume = newVolumeLeveL;
    }
  });

  volumeContainer.addEventListener("mouseup", () => {
    isVolumeDragging = false;
  });
});

document.addEventListener("mouseup", () => {
  isVolumeDragging = false;
});

// ========================TOGGLE-MUTE========================
const toggleMute = () => {
  if (tiktok.volume > 0) {
    tiktok.volume = 0;
  } else {
    tiktok.volume = 1;
  }
};

const toggleMuteImg = (event) => {
  event.target.classList.toggle("unmute");
};

soundControlBtn.addEventListener("click", toggleMuteImg);
soundControlBtn.addEventListener("click", toggleMute);

// ========================TOGGLE-FULLSCREEN========================
const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    tiktok.style.removeProperty("object-fit");
  } else {
    if (tiktok.webkitSupportsFullscreen) {
      tiktok.webkitEnterFullScreen();
      tiktok.style.setProperty("object-fit", "contain");
    }
  }
};

fullscreen.addEventListener("click", toggleFullScreen);
