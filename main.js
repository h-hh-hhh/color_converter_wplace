/*
  [0,0,0],[60,60,60],[120,120,120],[170,170,170],[210,210,210],[255,255,255],
  [96,0,24],[165, 14, 30],[237,28,36],[250,128,114],[228,92,26],[255,127,39],[246,170,9],
  [249,221,59],[255,250,188],[156,132,49],[197,173,49],[232,212,95],[74,107,58],[90,148,74],[132,197,115],
  [14,185,104],[19,230,123],[135,255,94],[12,129,110][16,174,166],[19,225,190],[15,121,159],[96,247,242],
  [187,250,242],[40,80,158],[64,147,228],[125,199,255],[77,49,184],[107,80,246],[153,177,251],
  [74,66,132],[122,113,196],[181,174,241],[181, 174, 241],[170,56,185],[224,159,249],
  [203,0,122],[236,31,128],[243,141,169],[155,82,73],[209,128,120],[250,182,164],
  [104,70,52],[149,104,42],[219,164,99],[123,99,82],[156,132,107],[214,181,148],
  [209,128,81],[248,178,119],[255,197,165],[109,100,63],[148,140,107],[205,197,158],
  [51,57,65],[109,117,141],[179,185,209]
*/

// --- Color name mapping ---
const colorNames = {
  "0,0,0": "Black",
  "60,60,60": "Dark Gray",
  "120,120,120": "Gray",
  "170,170,170": "Medium Gray",
  "210,210,210": "Light Gray",
  "255,255,255": "White",
  "165,14,30": "Dark Red",
  "96,0,24": "Deep Red",
  "237,28,36": "Red",
  "250,128,114": "Light Red",
  "228,92,26": "Dark Orange",
  "255,127,39": "Orange",
  "246,170,9": "Gold",
  "249,221,59": "Yellow",
  "255,250,188": "Light Yellow",
  "232,212,95": "Light Goldenrod",
  "74,107,58": "Dark Olive",
  "90,148,74": "Olive",
  "132,197,115": "Light Olive",
  "14,185,104": "Dark Green",
  "19,230,123": "Green",
  "135,255,94": "Light Green",
  "12,129,110": "Dark Teal",
  "16,174,166": "Teal",
  "19,225,190": "Light Teal",
  "15,121,159": "Dark Cyan",
  "96,247,242": "Cyan",
  "187,250,242": "Light Cyan",
  "40,80,158": "Dark Blue",
  "64,147,228": "Blue",
  "77,49,184": "Dark Indigo",
  "107,80,246": "Indigo",
  "153,177,251": "Light Indigo",
  "74,66,132": "Dark Slate Blue",
  "122,113,196": "Slate Blue",
  "181,174,241": "Light Slate Blue",
  "170,56,185": "Purple",
  "224,159,249": "Light Purple",
  "203,0,122": "Dark Pink",
  "236,31,128": "Pink",
  "243,141,169": "Light Pink",
  "155,82,73": "Dark Peach",
  "209,128,120": "Peach",
  "250,182,164": "Light Peach",
  "104,70,52": "Dark Brown",
  "149,104,42": "Brown",
  "219,164,99": "Light Brown",
  "123,99,82": "Dark Tan",
  "156,132,107": "Tan",
  "214,181,148": "Light Tan",
  "209,128,81": "Dark Beige",
  "248,178,119": "Beige",
  "255,197,165": "Light Beige",
  "109,100,63": "Dark Stone",
  "148,140,107": "Stone",
  "205,197,158": "Light Stone",
  "51,57,65": "Dark Slate",
  "109,117,141": "Slate",
  "179,185,209": "Light Slate"
};

let padrao = [];

function updatePadraoFromActiveButtons() {
  padrao = [];
  const activeButtons = document.querySelectorAll('#colors .toggle-color.active');
  activeButtons.forEach(btn => {
    const bg = window.getComputedStyle(btn).backgroundColor;
    const rgbMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      padrao.push([r, g, b]);
    }
  });
}

updatePadraoFromActiveButtons();

const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('download');

window.addEventListener('paste', function (event) {
  if (!event.clipboardData) return;
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      if (file) {
        const uploadInput = document.getElementById('upload');
        // Create a DataTransfer to simulate file input
        const dt = new DataTransfer();
        dt.items.add(file);
        uploadInput.files = dt.files;
        // Trigger change event to load image
        const changeEvent = new Event('change', { bubbles: true });
        uploadInput.dispatchEvent(changeEvent);
      }
      break;
    }
  }
});


function corMaisProxima(r, g, b) {
  let menorDist = Infinity;
  let cor = [0, 0, 0];
  for (let i = 0; i < padrao.length; i++) {
    const [pr, pg, pb] = padrao[i];
    const dist = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
    if (dist < menorDist) {
      menorDist = dist;
      cor = [pr, pg, pb];
    }
  }
  return cor;
}

function processarImagem() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const colorCounts = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const [nr, ng, nb] = corMaisProxima(r, g, b);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
    const key = `${nr},${ng},${nb}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }
  ctx.putImageData(imgData, 0, 0);
  downloadLink.href = canvas.toDataURL("image/png");
  showImageInfo(canvas.width, canvas.height);
  showColorUsage(colorCounts);
  const totalPixels = canvas.width * canvas.height;
  document.getElementById('pixels_amount').textContent = "Pixels Amount: ${totalPixels} px";
}

function showImageInfo(width, height) {
  const widthP = document.getElementById('width');
  const heightP = document.getElementById('height');
  const areaP = document.getElementById('area');
  if (widthP) widthP.textContent = `Width: ${width} px`;
  if (heightP) heightP.textContent = `Height: ${height} px`;
  if (areaP) areaP.textContent = `Area: ${width * height} px`;
}

function showColorUsage(colorCounts) {
  const colorListDiv = document.getElementById('color-list');
  if (!colorListDiv) return;
  colorListDiv.innerHTML = '';
  padrao.forEach(([r, g, b], idx) => {
    const key = `${r},${g},${b}`;
    const count = colorCounts[key] || 0;
    if (count === 0) return;
    const colorItem = document.createElement('div');
    colorItem.style.display = 'flex';
    colorItem.style.alignItems = 'center';
    colorItem.style.marginBottom = '4px';
    const swatch = document.createElement('span');
    swatch.style.display = 'inline-block';
    swatch.style.width = '24px';
    swatch.style.height = '24px';
    swatch.style.background = `rgb(${r},${g},${b})`;
    swatch.style.border = '1px solid #ccc';
    swatch.style.marginRight = '8px';
    const label = document.createElement('span');
    const colorName = colorNames[key] || `rgb(${r},${g},${b})`;
    label.textContent = `${colorName}: ${count} px`;
    colorItem.appendChild(swatch);
    colorItem.appendChild(label);
    colorListDiv.appendChild(colorItem);

  });
}

const scaleRange = document.getElementById('scaleRange');
const scaleValue = document.getElementById('scaleValue');
const zoomRange = document.getElementById('zoomRange');
const zoomValue = document.getElementById('zoomValue');

scaleRange.addEventListener('input', function () {
  scaleValue.textContent = parseFloat(scaleRange.value).toFixed(2) + 'x';
});

zoomRange.addEventListener('input', function () {
  zoomValue.textContent = parseFloat(zoomRange.value).toFixed(2) + 'x';
  applyPreview();
});

let originalImage = null;
let scaledCanvas = null;
let scaledCtx = null;
let processedCanvas = null;
let processedCtx = null;

function applyScale() {
  const scale = parseFloat(scaleRange.value);
  if (!originalImage) return;

  const newWidth = Math.round(originalImage.width * scale);
  const newHeight = Math.round(originalImage.height * scale);

  if (!scaledCanvas) {
    scaledCanvas = document.createElement('canvas');
    scaledCtx = scaledCanvas.getContext('2d');
  }
  scaledCanvas.width = newWidth;
  scaledCanvas.height = newHeight;

  scaledCtx.clearRect(0, 0, newWidth, newHeight);
  scaledCtx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height, 0, 0, newWidth, newHeight);

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.clearRect(0, 0, newWidth, newHeight);
  ctx.drawImage(scaledCanvas, 0, 0);

  processarImagem();
}

function processarImagem() {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const colorCounts = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const [nr, ng, nb] = corMaisProxima(r, g, b);
    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
    const key = `${nr},${ng},${nb}`;
    colorCounts[key] = (colorCounts[key] || 0) + 1;
  }
  ctx.putImageData(imgData, 0, 0);
  downloadLink.href = canvas.toDataURL("image/png");
  showImageInfo(canvas.width, canvas.height);
  showColorUsage(colorCounts);

  if (!processedCanvas) {
    processedCanvas = document.createElement('canvas');
    processedCtx = processedCanvas.getContext('2d');
  }
  processedCanvas.width = canvas.width;
  processedCanvas.height = canvas.height;
  processedCtx.putImageData(imgData, 0, 0);
}

function applyPreview() {
  const zoom = parseFloat(zoomRange.value);
  if (!processedCanvas) return;

  const previewWidth = Math.round(processedCanvas.width * zoom);
  const previewHeight = Math.round(processedCanvas.height * zoom);

  canvas.width = previewWidth;
  canvas.height = previewHeight;
  ctx.clearRect(0, 0, previewWidth, previewHeight);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(processedCanvas, 0, 0, processedCanvas.width, processedCanvas.height, 0, 0, previewWidth, previewHeight);
  ctx.imageSmoothingEnabled = true;
}

scaleRange.addEventListener('change', function () {
  applyScale();
  applyPreview();
});

upload.addEventListener('change', () => {
  scaleRange.value = 1.0;
  scaleValue.textContent = '1.00x';
  zoomRange.value = 1.0;
  zoomValue.textContent = '1.00x';
});

window.addEventListener('beforeunload', () => {
  scaleRange.value = 1.0;
  scaleValue.textContent = '1.00x';
  zoomRange.value = 1.0;
  zoomValue.textContent = '1.00x';
});

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      processarImagem();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

scaleRange.addEventListener('change', applyScale);

upload.addEventListener('change', () => {
  scaleRange.value = 1.0;
  scaleValue.textContent = '1.00x';
});

window.addEventListener('beforeunload', () => {
  scaleRange.value = 1.0;
  scaleValue.textContent = '1.00x';
});

document.addEventListener('DOMContentLoaded', function () {
  updatePadraoFromActiveButtons();

  document.querySelectorAll('#colors .toggle-color').forEach(btn => {
    btn.addEventListener('click', function () {
      btn.classList.toggle('active');
      updatePadraoFromActiveButtons();
      if (originalImage) {
        applyScale(); 
        applyPreview(); // <-- Add this line
      }
    });
  });
});


function showCustomToast(message) {
  const toastBtn = document.getElementById('clipboard');
  if (!toastBtn) return;
  const originalText = toastBtn.textContent;
  toastBtn.textContent = message;
  toastBtn.style.background = '#D60270';
  toastBtn.style.color = '#fff';
  setTimeout(() => {
    toastBtn.textContent = originalText;
    toastBtn.style.background = '';
    toastBtn.style.color = '';
  }, 1800);
}

document.getElementById('clipboard').addEventListener('click', async function () {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showCustomToast('Image copied to clipboard!');
    } catch (err) {
      showCustomToast('Failed to copy image.');
    }
  }, 'image/png');
});
