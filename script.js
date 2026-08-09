const playlist = [
  { title: '‘नalla’ Freestyle', artist: 'Unknown', file: '‘नalla’ Freestyle.mp3' },
  { title: '11K', artist: 'Seedhe Maut', file: '11K - Seedhe Maut.mp3' },
  { title: '10 Pe 10', artist: 'Unknown', file: '10 Pe 10.mp3' },
  { title: '4424', artist: 'SIYAAHI × @amdavad × ACHARYA', file: '4424 - SIYAAHI x @amdavad x ACHARYA.mp3' },
  { title: 'Shaayar', artist: 'Bharat Chauhan ft. Seedhe Maut', file: 'Shaayar - Bharat Chauhan ft Seedhe Maut.mp3' },
  { title: 'Brahamachari', artist: 'Unknown', file: 'Brahamachari.mp3' },
  { title: 'Fanne Khan', artist: 'Unknown', file: 'Fanne Khan.mp3' },
  { title: 'Gourmet Shit!', artist: 'Unknown', file: 'Gourmet Shit!.mp3' },
  { title: "I Don't Miss That Life", artist: 'Seedhe Maut', file: "I Don't Miss That Life - Seedhe Maut.mp3" },
  { title: 'ICE', artist: 'Unknown', file: 'ICE.mp3' }
];

const audio = document.getElementById("audio");
const bgVideo = document.getElementById("bgVideo");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const loopBtn = document.getElementById("loopBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const status = document.getElementById("status");

let currentIndex = 0;
let loopCurrent = false;

const fileURL = (name) => encodeURI(name);

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return Math.floor(seconds / 60) + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");
}

function updatePlayButton() {
  playBtn.textContent = audio.paused ? "▶" : "Ⅱ";
  playBtn.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
}

function loadSong(index, autoplay = false) {
  currentIndex = (index + playlist.length) % playlist.length;
  const song = playlist[currentIndex];

  audio.src = fileURL(song.file);
  audio.load();

  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  progress.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  status.textContent = `Track ${currentIndex + 1} of ${playlist.length}`;

  if (autoplay) {
    audio.play().catch(() => {
      status.textContent = "Tap play to start ♡";
      updatePlayButton();
    });
  }
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {
      status.textContent = "Couldn't play this file.";
    });
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener("click", () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadSong(currentIndex - 1, true);
  }
});

nextBtn.addEventListener("click", () => {
  if (loopCurrent) {
    audio.currentTime = 0;
    audio.play();
  } else {
    loadSong(currentIndex + 1, true);
  }
});

loopBtn.addEventListener("click", () => {
  loopCurrent = !loopCurrent;
  loopBtn.setAttribute("aria-pressed", String(loopCurrent));
  status.textContent = loopCurrent
    ? "Looping this song ↻"
    : `Track ${currentIndex + 1} of ${playlist.length}`;
});

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  if (loopCurrent) {
    audio.currentTime = 0;
    audio.play();
  } else {
    loadSong(currentIndex + 1, true);
  }
});

audio.addEventListener("error", () => {
  status.textContent = "Song file not found. Check the filename in GitHub.";
  updatePlayButton();
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.volume = 0.8;

// Background video: this matches the file currently visible in your GitHub repo.
bgVideo.muted = true;
bgVideo.loop = true;
bgVideo.playsInline = true;
bgVideo.play().catch(() => {});
bgVideo.addEventListener("error", () => {
  status.textContent = "Background video file not found.";
});

loadSong(0);
