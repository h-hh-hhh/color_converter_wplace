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

// Constantes PQ
const m1 = 2610 / 16384;
const m2 = 2523 / 32;
const c1 = 3424 / 4096;
const c2 = 2413 / 128;
const c3 = 2392 / 128;

// Matrizes
const M_RGB_to_LMS = [
  [1688 / 4096, 2146 / 4096, 262 / 4096],
  [683 / 4096, 2951 / 4096, 462 / 4096],
  [99 / 4096, 309 / 4096, 3688 / 4096]
];

const M_LMS_to_ICtCp = [
  [0.5, 0.5, 0],
  [1.6137, -3.3234, 1.7097],
  [4.3781, -4.2455, -0.1326]
];

// ---------- Função PQ encode ----------
function pqEncode(L) {
  const L_safe = L.map(v => Math.max(v, 1e-5)); // evita log(0)
  return L_safe.map(v => {
    const num = c1 + c2 * Math.pow(v, m1);
    const den = 1 + c3 * Math.pow(v, m1);
    return Math.pow(num / den, m2);
  });
}

// ---------- Produto de matriz ----------
function dotProduct3x3(matrix, vector) {
  return matrix.map(row =>
    row[0] * vector[0] + row[1] * vector[1] + row[2] * vector[2]
  );
}

// ---------- Função principal: RGB → ICtCp ----------
function rgbToICtCp(rgb) {
  // Normalizar RGB [0–255] → [0–1]
  const rgbNorm = rgb.map(v => v / 255);

  // RGB → LMS
  const LMS = dotProduct3x3(M_RGB_to_LMS, rgbNorm);

  // Aplicar PQ EOTF
  const LMS_pq = pqEncode(LMS);

  // LMS(PQ) → ICtCp
  const ICtCp = dotProduct3x3(M_LMS_to_ICtCp, LMS_pq);

  return ICtCp;
}
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
let simples = false;

// Atualiza quando o checkbox mudar
const checkbox = document.getElementById("simplesCheckbox");
if (checkbox) {
  checkbox.addEventListener("change", () => {
    simples = checkbox.checked;
    console.log("Modo simples:", simples);
    // Aqui você pode chamar alguma função, se quiser aplicar mudanças imediatas
  });
}
updatePadraoFromActiveButtons();

const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadLink = document.getElementById('download');

function corMaisProxima(r, g, b, simples) {
  let menorDist = Infinity;
  let cor = [0, 0, 0];
  for (let i = 0; i < padrao.length; i++) {
    
    if (simples === true){
        const [pr, pg, pb] = padrao[i];
        const dist1 = (pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2;
        if (dist1 < menorDist) {
            menorDist = dist1;
            cor = [pr, pg, pb];
    }
    }else {
        const [pI, pT, pP] = rgbToICtCp(padrao[i]);
        const [I,T,P] = rgbToICtCp([r,g,b])
        const dist2 = (pI - I)**2 + ((pT - T)*0.5)**2 + (pP - P)**2
        if (dist2 < menorDist) {
            menorDist = dist2;
            cor = padrao[i];
    }
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
    const [nr, ng, nb] = corMaisProxima(r, g, b, simples);
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
    // Use color name if available, else fallback to rgb
    const colorName = colorNames[key] || `rgb(${r},${g},${b})`;
    label.textContent = `${colorName}: ${count} px`;
    colorItem.appendChild(swatch);
    colorItem.appendChild(label);
    colorListDiv.appendChild(colorItem);
  });
}

const scaleRange = document.getElementById('scaleRange');
const scaleValue = document.getElementById('scaleValue');
scaleRange.addEventListener('input', function () {
  scaleValue.textContent = parseFloat(scaleRange.value).toFixed(2) + 'x';
});

let originalImage = null;

function applyScale() {
  const scale = parseFloat(scaleRange.value);
  if (!originalImage) return;

  const newWidth = Math.round(originalImage.width * scale);
  const newHeight = Math.round(originalImage.height * scale);

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.clearRect(0, 0, newWidth, newHeight);
  ctx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height, 0, 0, newWidth, newHeight);

  processarImagem();
}

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
                applyScale(); // Reprocess using current scale and new colors
              }
            });
          });
        });
