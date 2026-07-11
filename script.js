(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const opening = $("#opening");
  const openExperience = $("#openExperience");
  const envelopeScene = $("#envelopeScene");
  const openEnvelope = $("#openEnvelope");
  const sunriseFlash = $("#sunriseFlash");
  const experience = $("#experience");
  const heroPhoto = $("#heroPhoto");
  const photoFallback = $("#photoFallback");
  const musicButton = $("#musicButton");
  const musicIcon = $("#musicIcon");
  const loveSong = $("#loveSong");
  const playlistAudio = $("#playlistAudio");
  const playlistTitle = $("#playlistTitle");
  const playlistArtist = $("#playlistArtist");
  const playlistPlayButton = $("#playlistPlayButton");
  const playlistPlayIcon = $("#playlistPlayIcon");
  const playlistProgress = $("#playlistProgress");
  const playlistCurrentTime = $("#playlistCurrentTime");
  const playlistDuration = $("#playlistDuration");
  const playlistPrevious = $("#playlistPrevious");
  const playlistReplay = $("#playlistReplay");
  const playlistNext = $("#playlistNext");
  const musicArt = $("#musicArt");
  const trackButtons = Array.from(document.querySelectorAll(".track-button"));
  const letterButton = $("#letterButton");
  const letterModal = $("#letterModal");
  const closeLetter = $("#closeLetter");
  const heartButton = $("#heartButton");
  const kissButton = $("#kissButton");
  const kissMessage = $("#kissMessage");
  const kissLayer = $("#kissLayer");
  const heartLayer = $("#heartLayer");
  const lightParticles = $("#lightParticles");

  let envelopeShown = false;
  let envelopeOpened = false;
  let experienceOpened = false;
  let songAvailable = true;
  let currentPlaylistIndex = -1;

  const playlistTracks = [
    { title: "Vaaya En Veera", artist: "Shakthisree Gopalan", src: "assets/music/vaaya-en-veera.mp3" },
    { title: "Naan Un", artist: "Arijit Singh & Chinmayi", src: "assets/music/naan-un.mp3" },
    { title: "Munbe Vaa", artist: "Naresh Iyer & Shreya Ghoshal", src: "assets/music/munbe-vaa.mp3" },
    { title: "Dheema", artist: "Anirudh Ravichander", src: "assets/music/dheema.mp3" },
    { title: "Pattuma", artist: "Anirudh Ravichander & Ananthakrrishnan", src: "assets/music/pattuma.mp3" },
    { title: "Enna Solla", artist: "Swetha Mohan", src: "assets/music/enna-solla.mp3" },
    { title: "Naan Aval Illai", artist: "Karthik & Chinmayi", src: "assets/music/naan-aval-illai.mp3" },
    { title: "Motta Paiya", artist: "Sooraj Santhosh & K. S. Chithra", src: "assets/music/motta-paiya.mp3" }
  ];

  function buildLightParticles() {
    const count = window.innerWidth <= 420 ? 10 : window.innerWidth <= 700 ? 15 : 24;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const dot = document.createElement("span");
      dot.className = "light-dot";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.setProperty("--duration", `${11 + Math.random() * 12}s`);
      dot.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
      dot.style.animationDelay = `${-Math.random() * 18}s`;
      fragment.appendChild(dot);
    }

    lightParticles.appendChild(fragment);
  }

  function startMorningSong() {
    if (!songAvailable) return;

    loveSong.currentTime = 0;
    loveSong.volume = 0.62;

    loveSong.play().catch(() => {
      songAvailable = false;
      updateMusicState();
    });
  }

  function showEnvelopeScene() {
    if (envelopeShown) return;
    envelopeShown = true;

    opening.classList.add("is-hidden");
    envelopeScene.classList.add("is-visible");
    envelopeScene.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      opening.setAttribute("aria-hidden", "true");
      openEnvelope.focus();
    }, 780);
  }

  function revealExperience() {
    if (experienceOpened) return;
    experienceOpened = true;

    sunriseFlash.classList.add("is-active");

    window.setTimeout(() => {
      envelopeScene.classList.add("is-leaving");
      experience.classList.add("is-visible");
      experience.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "";
    }, 620);

    window.setTimeout(() => {
      envelopeScene.classList.remove("is-visible", "is-leaving");
      envelopeScene.setAttribute("aria-hidden", "true");
      sunriseFlash.classList.remove("is-active");
    }, 2100);
  }

  function openMorningEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    startMorningSong();
    openEnvelope.classList.add("is-opening");
    openEnvelope.setAttribute("aria-label", "Morning envelope opened");

    const rect = openEnvelope.getBoundingClientRect();
    launchHearts(rect.left + rect.width / 2, rect.top + rect.height * .46, 7);

    window.setTimeout(revealExperience, 1150);
  }

  function openLetter() {
    letterModal.classList.add("is-open");
    letterModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeLetter.focus();
    launchHearts(window.innerWidth / 2, window.innerHeight * 0.78, 8);
  }

  function closeLetterModal() {
    letterModal.classList.remove("is-open");
    letterModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    letterButton.focus();
  }

  async function toggleMusic() {
    if (!songAvailable) {
      musicButton.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 260 }
      );
      return;
    }

    try {
      if (loveSong.paused) {
        if (!playlistAudio.paused) playlistAudio.pause();
        if (loveSong.ended) loveSong.currentTime = 0;
        loveSong.volume = 0.62;
        await loveSong.play();
      } else {
        loveSong.pause();
      }
    } catch (error) {
      songAvailable = false;
      musicButton.classList.remove("is-playing");
      musicIcon.textContent = "♪";
    }
  }

  function updateMusicState() {
    const playing = !loveSong.paused;
    musicButton.classList.toggle("is-playing", playing);
    musicIcon.textContent = playing ? "Ⅱ" : "♪";
    musicButton.setAttribute("aria-label", playing ? "Pause our song" : "Play our song");
  }

  function formatPlaylistTime(value) {
    if (!Number.isFinite(value) || value < 0) return "0:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function updatePlaylistButtons() {
    const playing = !playlistAudio.paused && currentPlaylistIndex >= 0;

    playlistPlayButton.classList.toggle("is-playing", playing);
    musicArt.classList.toggle("is-playing", playing);
    playlistPlayIcon.textContent = playing ? "Ⅱ" : "▶";
    playlistPlayButton.setAttribute(
      "aria-label",
      playing ? "Pause selected song" : "Play selected song"
    );

    trackButtons.forEach((button, index) => {
      const active = index === currentPlaylistIndex;
      button.classList.toggle("is-active", active);
      button.classList.toggle("is-playing", active && playing);

      const action = button.querySelector(".track-action");
      if (action) action.textContent = active && playing ? "Ⅱ" : "▶";
    });
  }

  function updatePlaylistProgress() {
    const duration = playlistAudio.duration;
    const current = playlistAudio.currentTime;
    const percentage = Number.isFinite(duration) && duration > 0
      ? (current / duration) * 100
      : 0;

    playlistProgress.value = String(percentage);
    playlistProgress.style.setProperty("--playlist-progress", `${percentage}%`);
    playlistCurrentTime.textContent = formatPlaylistTime(current);
    playlistDuration.textContent = formatPlaylistTime(duration);
  }

  async function playPlaylistTrack(index, autoplay = true) {
    const safeIndex = (index + playlistTracks.length) % playlistTracks.length;
    const track = playlistTracks[safeIndex];

    currentPlaylistIndex = safeIndex;
    playlistTitle.textContent = track.title;
    playlistArtist.textContent = track.artist;
    playlistCurrentTime.textContent = "0:00";
    playlistDuration.textContent = "0:00";
    playlistProgress.value = "0";
    playlistProgress.style.setProperty("--playlist-progress", "0%");

    loveSong.pause();
    playlistAudio.src = track.src;
    playlistAudio.load();
    updatePlaylistButtons();

    if (!autoplay) return;

    try {
      playlistAudio.volume = 0.72;
      await playlistAudio.play();
    } catch (error) {
      updatePlaylistButtons();
    }
  }

  async function togglePlaylistPlayback() {
    if (currentPlaylistIndex < 0) {
      await playPlaylistTrack(0, true);
      return;
    }

    try {
      if (playlistAudio.paused) {
        loveSong.pause();
        playlistAudio.volume = 0.72;
        await playlistAudio.play();
      } else {
        playlistAudio.pause();
      }
    } catch (error) {
      updatePlaylistButtons();
    }
  }

  function playPreviousPlaylistTrack() {
    if (currentPlaylistIndex < 0) {
      playPlaylistTrack(0, true);
      return;
    }

    if (playlistAudio.currentTime > 4) {
      playlistAudio.currentTime = 0;
      return;
    }

    playPlaylistTrack(currentPlaylistIndex - 1, true);
  }

  function playNextPlaylistTrack() {
    playPlaylistTrack(currentPlaylistIndex < 0 ? 0 : currentPlaylistIndex + 1, true);
  }

  function replayPlaylistTrack() {
    if (currentPlaylistIndex < 0) {
      playPlaylistTrack(0, true);
      return;
    }

    playlistAudio.currentTime = 0;

    if (playlistAudio.paused) {
      playlistAudio.play().catch(updatePlaylistButtons);
    }
  }

  function launchFlyingKisses() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const count = width <= 380 ? 24 : width <= 640 ? 30 : 38;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        const kiss = document.createElement("span");
        const icon = document.createElement("span");
        kiss.className = "flying-kiss";
        icon.textContent = "💋";
        kiss.appendChild(icon);

        const size = width <= 640 ? 34 + Math.random() * 22 : 38 + Math.random() * 28;
        const startX = Math.random() * Math.max(1, width - size);
        const startY = height + 30 + Math.random() * 80;
        const endX = Math.max(0, Math.min(width - size, startX + (-120 + Math.random() * 240)));
        const middleX = Math.max(0, Math.min(width - size, startX + (-75 + Math.random() * 150)));
        const rotation = -28 + Math.random() * 56;

        kiss.style.setProperty("--size", `${size}px`);
        kiss.style.transform = `translate3d(${startX}px, ${startY}px, 0) scale(.55) rotate(${rotation}deg)`;
        kiss.style.opacity = "0";
        kissLayer.appendChild(kiss);

        const duration = reducedMotion ? 900 : 2700 + Math.random() * 1500;
        const animation = kiss.animate(
          [
            { transform: `translate3d(${startX}px, ${startY}px, 0) scale(.55) rotate(${rotation}deg)`, opacity: 0, offset: 0 },
            { transform: `translate3d(${middleX}px, ${height * .72}px, 0) scale(1.12) rotate(${-rotation * .35}deg)`, opacity: 1, offset: .18 },
            { transform: `translate3d(${endX}px, ${height * .38}px, 0) scale(1.02) rotate(${rotation * .5}deg)`, opacity: 1, offset: .62 },
            { transform: `translate3d(${Math.max(0, Math.min(width - size, endX + (-50 + Math.random() * 100)))}px, ${-size - 40}px, 0) scale(.82) rotate(${-rotation}deg)`, opacity: 0, offset: 1 }
          ],
          { duration, easing: "cubic-bezier(.18,.74,.22,1)", fill: "forwards" }
        );

        const cleanup = () => kiss.remove();
        animation.onfinish = cleanup;
        window.setTimeout(cleanup, duration + 300);
      }, i * 58);
    }

    kissMessage.textContent = "Muahhh… my kisses are flying all around your screen babyyyy hehehe ♥";
    kissButton.querySelector("span:first-child").textContent = "Send More Kisses";
  }

  function launchHearts(x, y, count = 7) {
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        const heart = document.createElement("span");
        heart.className = "flying-heart";
        heart.textContent = Math.random() > .5 ? "♥" : "♡";
        heart.style.setProperty("--heart-size", `${20 + Math.random() * 18}px`);
        heart.style.setProperty("--heart-color", Math.random() > .5 ? "#e46f91" : "#e99b5f");
        heart.style.transform = `translate3d(${x}px, ${y}px, 0) scale(.55)`;
        heart.style.opacity = "0";
        heartLayer.appendChild(heart);

        const drift = -70 + Math.random() * 140;
        const animation = heart.animate(
          [
            { transform: `translate3d(${x}px, ${y}px, 0) scale(.55) rotate(0deg)`, opacity: 0 },
            { transform: `translate3d(${x + drift * .35}px, ${y - 38}px, 0) scale(1.1) rotate(${drift * .08}deg)`, opacity: 1, offset: .2 },
            { transform: `translate3d(${x + drift}px, ${y - 190}px, 0) scale(.8) rotate(${drift * .15}deg)`, opacity: 0 }
          ],
          { duration: 1500 + Math.random() * 650, easing: "ease-out", fill: "forwards" }
        );
        const cleanup = () => heart.remove();
        animation.onfinish = cleanup;
        window.setTimeout(cleanup, 2500);
      }, i * 70);
    }
  }

  openExperience.addEventListener("click", showEnvelopeScene);
  openEnvelope.addEventListener("click", openMorningEnvelope);
  letterButton.addEventListener("click", openLetter);
  closeLetter.addEventListener("click", closeLetterModal);
  document.querySelector("[data-close-letter]").addEventListener("click", closeLetterModal);
  musicButton.addEventListener("click", toggleMusic);
  loveSong.addEventListener("play", updateMusicState);
  loveSong.addEventListener("pause", updateMusicState);
  loveSong.addEventListener("ended", updateMusicState);
  loveSong.addEventListener("error", () => { songAvailable = false; updateMusicState(); });
  heartButton.addEventListener("click", () => {
    const rect = heartButton.getBoundingClientRect();
    launchHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 9);
  });
  kissButton.addEventListener("click", launchFlyingKisses);

  trackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      playPlaylistTrack(Number(button.dataset.trackIndex), true);
    });
  });

  playlistPlayButton.addEventListener("click", togglePlaylistPlayback);
  playlistPrevious.addEventListener("click", playPreviousPlaylistTrack);
  playlistNext.addEventListener("click", playNextPlaylistTrack);
  playlistReplay.addEventListener("click", replayPlaylistTrack);

  playlistProgress.addEventListener("input", () => {
    if (!Number.isFinite(playlistAudio.duration) || playlistAudio.duration <= 0) return;

    const percentage = Number(playlistProgress.value);
    playlistAudio.currentTime = (percentage / 100) * playlistAudio.duration;
    playlistProgress.style.setProperty("--playlist-progress", `${percentage}%`);
  });

  playlistAudio.addEventListener("play", updatePlaylistButtons);
  playlistAudio.addEventListener("pause", updatePlaylistButtons);
  playlistAudio.addEventListener("timeupdate", updatePlaylistProgress);
  playlistAudio.addEventListener("loadedmetadata", updatePlaylistProgress);
  playlistAudio.addEventListener("durationchange", updatePlaylistProgress);
  playlistAudio.addEventListener("ended", playNextPlaylistTrack);
  playlistAudio.addEventListener("error", () => {
    playlistTitle.textContent = "This song could not be loaded";
    playlistArtist.textContent = "Please try another song, maa";
    updatePlaylistButtons();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && letterModal.classList.contains("is-open")) closeLetterModal();
  });

  function showHeroPhoto() {
    heroPhoto.hidden = false;
    photoFallback.hidden = true;
  }

  function showPhotoFallback() {
    heroPhoto.hidden = true;
    photoFallback.hidden = false;
  }

  heroPhoto.addEventListener("load", showHeroPhoto);
  heroPhoto.addEventListener("error", showPhotoFallback);

  // The image may finish loading before this deferred script runs.
  // Checking complete/naturalWidth makes the photo appear reliably on local files,
  // GitHub Pages, cached visits, and mobile browsers.
  if (heroPhoto.complete) {
    if (heroPhoto.naturalWidth > 0) showHeroPhoto();
    else showPhotoFallback();
  }

  buildLightParticles();
  updateMusicState();
  updatePlaylistButtons();
  updatePlaylistProgress();
  document.body.style.overflow = "hidden";
})();
