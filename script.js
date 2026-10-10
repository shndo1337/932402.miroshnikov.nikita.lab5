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
