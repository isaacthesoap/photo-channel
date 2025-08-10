const image = document.getElementById("image");
const brightnessBtn = document.getElementById("brightness");
const contrastBtn = document.getElementById("contrast");
const invertBtn = document.getElementById("invert");
const grayscaleBtn = document.getElementById("grayscale");
const resetBtn = document.getElementById("reset");
const uploadInput = document.getElementById("upload");

let filterState = {
  brightness: 0,
  contrast: 0,
  current: ""
};

function updateFilter() {
  let filter = "";

  switch (filterState.current) {
    case "brightness":
      filter = `brightness(${1 + filterState.brightness * 0.2})`;
      break;
    case "contrast":
      filter = `contrast(${1 + filterState.contrast * 0.2})`;
      break;
    case "invert":
      filter = "invert(1)";
      break;
    case "grayscale":
      filter = "grayscale(1)";
      break;
    default:
      filter = "none";
  }

  image.style.filter = filter;
}

function resetState() {
  filterState = { brightness: 0, contrast: 0, current: "" };
  image.style.filter = "none";
}

brightnessBtn.onclick = () => {
  if (filterState.current !== "brightness") {
    filterState.current = "brightness";
    filterState.brightness = 1;
  } else if (filterState.brightness < 8) {
    filterState.brightness += 1;
  }
  updateFilter();
};

contrastBtn.onclick = () => {
  if (filterState.current !== "contrast") {
    filterState.current = "contrast";
    filterState.contrast = 1;
  } else if (filterState.contrast < 8) {
    filterState.contrast += 1;
  }
  updateFilter();
};

invertBtn.onclick = () => {
  if (filterState.current !== "invert") {
    filterState.current = "invert";
  } else {
    filterState.current = "";
  }
  updateFilter();
};

grayscaleBtn.onclick = () => {
  if (filterState.current !== "grayscale") {
    filterState.current = "grayscale";
  } else {
    filterState.current = "";
  }
  updateFilter();
};

resetBtn.onclick = () => resetState();

uploadInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
    resetState();
  };
  reader.readAsDataURL(file);
};

document.getElementById("save").onclick = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.filter = getComputedStyle(image).filter;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL();
  link.click();
};

// Polyphonic audio handler
function polyAudio(path, copies = 8) {
  const audios = Array.from({ length: copies }, () => new Audio(path));
  let index = 0;

  return {
    play: () => {
      audios[index].currentTime = 0;
      audios[index].play();
      index = (index + 1) % copies;
    }
  };
}

// Initialize sound players
const hoverSound = polyAudio("snd/hover.mp3");
const clickSound = polyAudio("snd/click.mp3");

// Apply to all buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");

  buttons.forEach(button => {
    button.addEventListener("mouseenter", () => {
      hoverSound.play();
    });

    button.addEventListener("click", () => {
      clickSound.play();
    });
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const bgm = document.getElementById('bgm');


  const startBgm = () => {
    bgm.volume = 0.5;
    bgm.play().catch(err => console.warn("BGM autoplay blocked:", err));
    document.removeEventListener('click', startBgm);
  };

  document.addEventListener('click', startBgm);
});

document.getElementById('return-home').addEventListener('click', () => {
  window.location.href = 'https://isaacthesoap.github.io/welcome';
});

