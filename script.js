const trackVolumes = [72, 95, 108, 68, 88, 102];

function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function filterLoudTracks(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 90) {
      result.push(arr[i]);
    }
  }
  return result;
}

function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function runVolumeAnalysis() {
  const userNameInput = prompt("Введите ваше имя:", "Никита");
  const userName = userNameInput && userNameInput.trim() ? userNameInput.trim() : "Гость";

  let quietTracksCount = 0;
  let quietTracksSum = 0;

  for (let i = 0; i < trackVolumes.length; i++) {
    if (trackVolumes[i] <= 75) {
      quietTracksCount++;
      quietTracksSum += trackVolumes[i];
    }
  }

  const quietTracksAverage = quietTracksCount > 0 ? quietTracksSum / quietTracksCount : 0;
  const totalSum = calculateSum(trackVolumes);
  const averageVolume = trackVolumes.length > 0 ? totalSum / trackVolumes.length : 0;
  const loudTracks = filterLoudTracks(trackVolumes);
  const maxVolume = findMax(trackVolumes);

  const roundedAverage = Number(averageVolume.toFixed(1));
  const roundedQuietAverage = Number(quietTracksAverage.toFixed(1));

  alert(`Привет, ${userName}! Средняя громкость – ${roundedAverage} дБ, ${loudTracks.length} треков – громкие.`);

  console.log(`Количество тихих треков: ${quietTracksCount}`);
  console.log(`Средняя громкость тихих треков: ${roundedQuietAverage} дБ`);

  if (maxVolume >= 105) {
    console.log("Такая громкость может повредить слух – используйте наушники с ограничением");
  }
}

const analyzeButton = document.getElementById("analyze-btn");
if (analyzeButton) {
  analyzeButton.addEventListener("click", runVolumeAnalysis);
}

runVolumeAnalysis();

const STORAGE_KEY = "lab5-playlist-state";
const THEMES = ["theme-dark", "theme-light"];
const defaultTracks = [
  { name: "8 миля", duration: "3:12", favorite: true },
  { name: "РНБ Клуб", duration: "2:48", favorite: false },
  { name: "Бассок", duration: "3:30", favorite: false }
];

function initPlaylist() {
  const themeButton = document.getElementById("theme-toggle");
  const addButton = document.getElementById("add-track-btn");
  const clearButton = document.getElementById("clear-playlist-btn");
  const toggleButton = document.getElementById("toggle-playlist-btn");
  const content = document.querySelector("#playlist-content");
  const list = document.querySelector("#playlist");
  const stats = document.querySelector("#playlist-stats");
  const emptyMessage = document.querySelector("#playlist-empty");

  const required = [
    [themeButton, "#theme-toggle"],
    [addButton, "#add-track-btn"],
    [clearButton, "#clear-playlist-btn"],
    [toggleButton, "#toggle-playlist-btn"],
    [content, "#playlist-content"],
    [list, "#playlist"],
    [stats, "#playlist-stats"],
    [emptyMessage, "#playlist-empty"]
  ];

  let allFound = true;
  for (let i = 0; i < required.length; i++) {
    if (!required[i][0]) {
      console.error(`Элемент не найден: ${required[i][1]}`);
      allFound = false;
    }
  }
  if (!allFound) {
    return;
  }

  let theme = "theme-dark";
  let tracks = [];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        return false;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.tracks)) {
        return false;
      }
      const loaded = [];
      for (let i = 0; i < parsed.tracks.length; i++) {
        const item = parsed.tracks[i];
        if (item && typeof item.name === "string" && typeof item.duration === "string") {
          loaded.push({ name: item.name, duration: item.duration, favorite: item.favorite === true });
        }
      }
      tracks = loaded;
      theme = THEMES.includes(parsed.theme) ? parsed.theme : "theme-dark";
      return true;
    } catch (error) {
      console.error("Не удалось прочитать состояние из localStorage:", error);
      return false;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: theme, tracks: tracks }));
    } catch (error) {
      console.error("Не удалось сохранить состояние в localStorage:", error);
    }
  }

  function applyTheme() {
    document.body.classList.remove(...THEMES);
    document.body.classList.add(theme);
    themeButton.textContent = theme === "theme-dark" ? "Включить светлую тему" : "Включить тёмную тему";
  }

  function updateView() {
    let favoriteCount = 0;
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].favorite) {
        favoriteCount++;
      }
    }
    stats.textContent = `Треков: ${tracks.length} · Избранных: ${favoriteCount}`;
    emptyMessage.hidden = tracks.length > 0;
  }

  function createTrackElement(track) {
    const item = document.createElement("li");
    item.className = "track";
    if (track.favorite) {
      item.classList.add("favorite");
    }

    const name = document.createElement("span");
    name.className = "track-name";
    name.textContent = track.name;

    const duration = document.createElement("span");
    duration.className = "track-duration";
    duration.textContent = track.duration;

    const label = document.createElement("label");
    label.className = "track-favorite";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = track.favorite;
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode("Избранное"));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "track-delete";
    deleteButton.textContent = "Удалить";
    deleteButton.setAttribute("aria-label", `Удалить трек ${track.name}`);

    checkbox.addEventListener("change", function () {
      track.favorite = checkbox.checked;
      item.classList.toggle("favorite", track.favorite);
      saveState();
      updateView();
    });

    deleteButton.addEventListener("click", function () {
      tracks = tracks.filter(function (current) {
        return current !== track;
      });
      item.remove();
      saveState();
      updateView();
    });

    item.appendChild(name);
    item.appendChild(duration);
    item.appendChild(label);
    item.appendChild(deleteButton);
    return item;
  }

  function renderTracks() {
    list.innerHTML = "";
    for (let i = 0; i < tracks.length; i++) {
      list.appendChild(createTrackElement(tracks[i]));
    }
    updateView();
  }

  function addTrack() {
    const nameInput = prompt("Введите название трека:");
    if (nameInput === null) {
      return;
    }
    const name = nameInput.trim().slice(0, 60);
    if (!name) {
      alert("Название трека не может быть пустым");
      return;
    }

    const durationInput = prompt("Введите длительность трека (мин:сек, например 3:45):", "3:30");
    if (durationInput === null) {
      return;
    }
    const duration = durationInput.trim();
    if (!/^\d{1,2}:[0-5]\d$/.test(duration)) {
      alert("Длительность нужна в формате мин:сек, например 3:45");
      return;
    }

    const track = { name: name, duration: duration, favorite: false };
    tracks.push(track);
    list.appendChild(createTrackElement(track));
    saveState();
    updateView();
  }

  function clearPlaylist() {
    const items = list.querySelectorAll(".track");
    if (items.length === 0) {
      console.log("Плейлист уже пуст");
      alert("Плейлист уже пуст");
      return;
    }
    for (let i = 0; i < items.length; i++) {
      items[i].remove();
    }
    tracks = [];
    saveState();
    updateView();
  }

  function togglePlaylist() {
    const isHidden = content.classList.toggle("hidden");
    toggleButton.textContent = isHidden ? "Показать плейлист" : "Скрыть плейлист";
    toggleButton.setAttribute("aria-expanded", String(!isHidden));
  }

  function toggleTheme() {
    theme = theme === "theme-dark" ? "theme-light" : "theme-dark";
    applyTheme();
    saveState();
  }

  if (!loadState()) {
    tracks = defaultTracks.map(function (track) {
      return { name: track.name, duration: track.duration, favorite: track.favorite };
    });
  }

  applyTheme();
  renderTracks();

  addButton.addEventListener("click", addTrack);
  clearButton.addEventListener("click", clearPlaylist);
  toggleButton.addEventListener("click", togglePlaylist);
  themeButton.addEventListener("click", toggleTheme);
}

initPlaylist();
