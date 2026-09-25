const screens = document.querySelectorAll(".screen");
const startButton = document.getElementById("start-button");
const nextButtons = document.querySelectorAll("[data-next]");
const previousButtons = document.querySelectorAll("[data-previous]");
const restartButton = document.getElementById("restart-button");
const revealButton = document.getElementById("reveal-button");
const artIntroduction = document.getElementById("art-introduction");
const artReveal = document.getElementById("art-reveal");
const musicPlayer = document.getElementById("music-player");
const audio = document.getElementById("background-music");
const playPauseButton = document.getElementById("play-pause");
const previousSongButton = document.getElementById("previous-song");
const nextSongButton = document.getElementById("next-song");
const volumeSlider = document.getElementById("volume-slider");
const songTitle = document.getElementById("song-title");
const songCounter = document.getElementById("song-counter");
const playlist = [
    {
        title: "Las Mañanitas - Vicente Fernández",
        file: "assets/music/song1.mp3"
    },
    {
        title: "Te quiero - Hombres G",
        file: "assets/music/song2.mp3"
    },
    {
        title: "Smithereens",
        file: "assets/music/song3.mp3"
    },
    {
        title: "Mon Laferte - Amárrame ft. Juanes",
        file: "assets/music/song4.mp3"
    }
];
const typedElements = new WeakSet();
let currentScreen = 0;
let currentSong = 0;
let musicStarted = false;
function prepareText(element) {
    return element.textContent
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
        .join("\n\n");
}
function typeText(element) {
    if (!element || typedElements.has(element)) {
        return;
    }
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const completeText = prepareText(element);
    typedElements.add(element);
    if (prefersReducedMotion) {
        element.textContent = completeText;
        return;
    }
    element.textContent = "";
    let characterIndex = 0;
    const typingInterval = window.setInterval(() => {
        element.textContent += completeText.charAt(characterIndex);
        characterIndex += 1;

        if (characterIndex >= completeText.length) {
            window.clearInterval(typingInterval);
        }
    }, 12);
}
function showScreen(screenNumber) {
    if (screenNumber < 0 || screenNumber >= screens.length) {
        return;
    }
    screens.forEach((screen, index) => {
        const isCurrentScreen = index === screenNumber;

        screen.hidden = !isCurrentScreen;
        screen.classList.toggle("active", isCurrentScreen);
    });
    currentScreen = screenNumber;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    const activeTypewriter = screens[screenNumber].querySelector(
        "[data-typewriter]"
    );
    if (activeTypewriter) {
        window.setTimeout(() => {
            typeText(activeTypewriter);
        }, 300);
    }
}
function updateSongInformation() {
    songTitle.textContent = playlist[currentSong].title;
    songCounter.textContent = `${currentSong + 1} / ${playlist.length}`;
}
function loadSong(songIndex, shouldPlay = true) {
    if (songIndex < 0) {
        songIndex = playlist.length - 1;
    }
    if (songIndex >= playlist.length) {
        songIndex = 0;
    }
    currentSong = songIndex;
    audio.src = playlist[currentSong].file;
    audio.load();
    updateSongInformation();
    if (shouldPlay) {
        playMusic();
    } else {
        playPauseButton.textContent = "▶";
    }
}
function playMusic() {
    const playRequest = audio.play();
    if (playRequest !== undefined) {
        playRequest
            .then(() => {
                playPauseButton.textContent = "❚❚";
            })
            .catch(() => {
                playPauseButton.textContent = "▶";
            });
    }
}
function pauseMusic() {
    audio.pause();
    playPauseButton.textContent = "▶";
}
function toggleMusic() {
    if (audio.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}
function nextSong() {
    loadSong(currentSong + 1);
}
function previousSong() {
    loadSong(currentSong - 1);
}
function resetArtReveal() {
    artIntroduction.hidden = false;
    artReveal.hidden = true;
}
startButton.addEventListener("click", () => {
    musicPlayer.hidden = false;
    if (!musicStarted) {
        musicStarted = true;
        loadSong(0);
    } else if (audio.paused) {
        playMusic();
    }
    showScreen(1);
});
nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showScreen(currentScreen + 1);
    });
});
previousButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showScreen(currentScreen - 1);
    });
});
restartButton.addEventListener("click", () => {
    resetArtReveal();
    showScreen(0);
});
revealButton.addEventListener("click", () => {
    artIntroduction.hidden = true;
    artReveal.hidden = false;
});
playPauseButton.addEventListener("click", toggleMusic);
nextSongButton.addEventListener("click", nextSong);
previousSongButton.addEventListener("click", previousSong);
volumeSlider.addEventListener("input", () => {
    audio.volume = Number(volumeSlider.value);
    localStorage.setItem(
        "birthday-volume",
        volumeSlider.value
    );
});
audio.addEventListener("ended", () => {
    nextSong();
});
audio.addEventListener("play", () => {
    playPauseButton.textContent = "❚❚";
});
audio.addEventListener("pause", () => {
    playPauseButton.textContent = "▶";
});
audio.addEventListener("error", () => {
    songTitle.textContent = "No se pudo cargar la canción";
    playPauseButton.textContent = "▶";
});
const savedVolume = localStorage.getItem("birthday-volume");
if (savedVolume !== null) {
    volumeSlider.value = savedVolume;
}
audio.volume = Number(volumeSlider.value);
updateSongInformation();
resetArtReveal();
showScreen(0);