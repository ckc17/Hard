const playlist = [
    { title: '‘नalla’ Freestyle', artist: 'Unknown', file: 'songs/‘नalla’ Freestyle.mp3' },
    { title: '11K', artist: 'Seedhe Maut', file: 'songs/11K - Seedhe Maut.mp3' },
    { title: '10 Pe 10', artist: 'Unknown', file: 'songs/10 Pe 10.mp3' },
    { title: '4424', artist: 'SIYAAHI × @amdavad × ACHARYA', file: 'songs/4424 - SIYAAHI x @amdavad x ACHARYA.mp3' },
    { title: 'Shaayar', artist: 'Bharat Chauhan ft. Seedhe Maut', file: 'songs/Shaayar - Bharat Chauhan ft Seedhe Maut.mp3' },
    { title: 'Brahamachari', artist: 'Unknown', file: 'songs/Brahamachari.mp3' },
    { title: 'Fanne Khan', artist: 'Unknown', file: 'songs/Fanne Khan.mp3' },
    { title: 'Gourmet Shit!', artist: 'Unknown', file: 'songs/Gourmet Shit!.mp3' },
    { title: "I Don't Miss That Life", artist: 'Seedhe Maut', file: "songs/I Don't Miss That Life - Seedhe Maut.mp3" },
    { title: 'ICE', artist: 'Unknown', file: 'songs/ICE.mp3' }
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

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function loadSong(index, autoplay = false) {
  currentIndex = (index + playlist.length) % playlist.length;
  const song = playlist[currentIndex];

  audio.src = encodeURI(song.file);
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  progress.value = 0;
  status.textContent = `Track ${currentIndex + 1} of ${playlist.length}`;

  if (autoplay) {
    audio.play().then(updatePlayButton).catch(() => {
      status.textContent = "Tap play to start ♡";
      updatePlayButton();
    });
  }
}

function updatePlayButton() {
  const playing = !audio.paused;
  playBtn.textContent = playing ? "Ⅱ" : "▶";
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

function playNext() {
  if (loopCurrent) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  loadSong(currentIndex + 1, true);
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
});

prevBtn.addEventListener("click", () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadSong(currentIndex - 1, !audio.paused);
  }
});

nextBtn.addEventListener("click", playNext);

loopBtn.addEventListener("click", () => {
  loopCurrent = !loopCurrent;
  loopBtn.setAttribute("aria-pressed", String(loopCurrent));
  status.textContent = loopCurrent ? "Looping this song ↻" : `Track ${currentIndex + 1} of ${playlist.length}`;
});

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", playNext);

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.volume = 0.8;

// Keep the visual background video looping independently from the music.
bgVideo.muted = true;
bgVideo.play().catch(() => {
  // Mobile browsers may require the first user gesture before playback.
});

loadSong(0, false);
