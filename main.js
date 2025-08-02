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

  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let allTransparent = true;
  for (let i = 3; i < imageData.length; i += 4) {
    if (imageData[i] !== 0) {
      allTransparent = false;
      break;
    }
  }

  const lang = getCurrentLang();
  const t = translations[lang] || translations['en'];

  if (allTransparent) {
    showCustomToast(t.imageNotFound);
    return;
  }

  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showCustomToast(t.imageCopied);
    } catch (err) {
      showCustomToast(t.copyFailed);
    }
  }, 'image/png');
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
  const langSelect = document.getElementById('lang-select');
  const lang = (langSelect && langSelect.value) || 'en';
  const t = translations[lang];

  const widthP = document.getElementById('width');
  const heightP = document.getElementById('height');
  const areaP = document.getElementById('area');

  if (widthP) widthP.textContent = `${t.width} ${width} px`;
  if (heightP) heightP.textContent = `${t.height} ${height} px`;
  if (areaP) areaP.textContent = `${t.area} ${width * height} px`;
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

// All button scripts
document.getElementById('select-all-free').addEventListener('click', function () {
  const freeButtons = document.querySelectorAll('#colors .toggle-color[data-type="free"]');
  const allActive = Array.from(freeButtons).every(btn => btn.classList.contains('active'));

  if (allActive) {
    // If all are active, remove active from all
    freeButtons.forEach(btn => btn.classList.remove('active'));
  } else {
    // Otherwise, add active to all
    freeButtons.forEach(btn => btn.classList.add('active'));
  }

  updatePadraoFromActiveButtons();
  if (originalImage) {
    applyScale();
    applyPreview();
  }
});

document.getElementById('select-all-paid').addEventListener('click', function () {
  const freeButtons = document.querySelectorAll('#colors .toggle-color[data-type="paid"]');
  const allActive = Array.from(freeButtons).every(btn => btn.classList.contains('active'));

  if (allActive) {
    // If all are active, remove active from all
    freeButtons.forEach(btn => btn.classList.remove('active'));
  } else {
    // Otherwise, add active to all
    freeButtons.forEach(btn => btn.classList.add('active'));
  }

  updatePadraoFromActiveButtons();
  if (originalImage) {
    applyScale();
    applyPreview();
  }
});
// --End of Script for buttons--

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
        applyPreview();
      }
    });
  });
});

const translations = {
  en: {
    title: "Wplace Color Converter",
    freeColors: "Free Colors:",
    paidColors: "Paid Colors (2000💧each):",
    download: "Download Image",
    clipboard: "Copy to Clipboard",
    goto: "Go to Wplace",
    pixelsAmount: "Pixels Amount:",
    width: "Width:",
    height: "Height:",
    area: "Area:",
    imageCopied: "Image copied to clipboard!",
    copyFailed: "Failed to copy image.",
    imageNotFound: "Image not found",
    allButtonfree: "Select All Free Colors",
    allButtonpaid: "Select All 💧Paid Colors"
  },
  pt: {
    title: "Conversor de Cores Wplace",
    freeColors: "Cores Gratuitas:",
    paidColors: "Cores Pagas (2000💧cada):",
    download: "Baixar Imagem",
    clipboard: "Copiar para Área de Transferência",
    goto: "Ir para o Wplace",
    pixelsAmount: "Quantidade de Pixels:",
    width: "Largura:",
    height: "Altura:",
    area: "Área:",
    imageCopied: "Imagem copiada para a área de transferência!",
    copyFailed: "Falha ao copiar a imagem.",
    imageNotFound: "Imagem não encontrada",
    allButtonfree: "Selecionar Todas as Cores Gratuitas",
    allButtonpaid: "Selecionar Todas as Cores Pagas 💧"
  },
  de: {
    title: "Wplace Farbkonverter",
    freeColors: "Kostenlose Farben:",
    paidColors: "Bezahlte Farben (2000💧 pro Stück):",
    download: "Bild herunterladen",
    clipboard: "In die Zwischenablage kopieren",
    goto: "Zu Wplace gehen",
    pixelsAmount: "Anzahl der Pixel:",
    width: "Breite:",
    height: "Höhe:",
    area: "Fläche:",
    imageCopied: "Bild in Zwischenablage kopiert!",
    copyFailed: "Bild konnte nicht kopiert werden.",
    imageNotFound: "Bild nicht gefunden",
    allButtonfree: "Alle kostenlosen Farben auswählen",
    allButtonpaid: "Alle 💧bezahlten Farben auswählen"
  },
  es: {
    title: "Convertidor de Colores Wplace",
    freeColors: "Colores Gratis:",
    paidColors: "Colores de Pago (2000💧 cada uno):",
    download: "Descargar Imagen",
    clipboard: "Copiar al Portapapeles",
    goto: "Ir a Wplace",
    pixelsAmount: "Cantidad de píxeles:",
    width: "Ancho:",
    height: "Alto:",
    area: "Área:",
    imageCopied: "¡Imagen copiada al portapapeles!",
    copyFailed: "Error al copiar la imagen.",
    imageNotFound: "Imagen no encontrada",
    allButtonfree: "Seleccionar todos los colores gratis",
    allButtonpaid: "Seleccionar todos los colores 💧de pago"
  },
  fr: {
    title: "Convertisseur de Couleurs Wplace",
    freeColors: "Couleurs Gratuites :",
    paidColors: "Couleurs Payantes (2000💧 chacune) :",
    download: "Télécharger l’image",
    clipboard: "Copier dans le presse-papiers",
    goto: "Aller sur Wplace",
    pixelsAmount: "Nombre de pixels :",
    width: "Largeur :",
    height: "Hauteur :",
    area: "Surface :",
    imageCopied: "Image copiée dans le presse-papiers !",
    copyFailed: "Échec de la copie de l’image.",
    imageNotFound: "Image non trouvée",
    allButtonfree: "Sélectionner toutes les couleurs gratuites",
    allButtonpaid: "Sélectionner toutes les couleurs 💧payantes"
  },
  uk: {
    title: "Конвертер кольорів Wplace",
    freeColors: "Безкоштовні кольори:",
    paidColors: "Платні кольори (2000💧 кожен):",
    download: "Завантажити зображення",
    clipboard: "Копіювати в буфер обміну",
    goto: "Перейти до Wplace",
    pixelsAmount: "Кількість пікселів:",
    width: "Ширина:",
    height: "Висота:",
    area: "Площа:",
    imageCopied: "Зображення скопійовано в буфер обміну!",
    copyFailed: "Не вдалося скопіювати зображення.",
    imageNotFound: "Зображення не знайдено",
    allButtonfree: "Вибрати всі безкоштовні кольори",
    allButtonpaid: "Вибрати всі 💧платні кольори"
  },
  vi: {
    title: "Trình chuyển đổi màu Wplace",
    freeColors: "Màu miễn phí:",
    paidColors: "Màu trả phí (2000💧 mỗi màu):",
    download: "Tải hình ảnh",
    clipboard: "Sao chép vào bộ nhớ tạm",
    goto: "Đi đến Wplace",
    pixelsAmount: "Số lượng điểm ảnh:",
    width: "Chiều rộng:",
    height: "Chiều cao:",
    area: "Diện tích:",
    imageCopied: "Đã sao chép hình ảnh vào bộ nhớ tạm!",
    copyFailed: "Sao chép hình ảnh thất bại.",
    imageNotFound: "Không tìm thấy hình ảnh",
    allButtonfree: "Chọn tất cả màu miễn phí",
    allButtonpaid: "Chọn tất cả màu 💧trả phí"
  },
  ja: {
    title: "Wplace カラーコンバーター",
    freeColors: "無料カラー：",
    paidColors: "有料カラー（1色2000💧）：",
    download: "画像をダウンロード",
    clipboard: "クリップボードにコピー",
    goto: "Wplaceへ移動",
    pixelsAmount: "ピクセル数：",
    width: "幅：",
    height: "高さ：",
    area: "面積：",
    imageCopied: "画像がクリップボードにコピーされました！",
    copyFailed: "画像のコピーに失敗しました。",
    imageNotFound: "画像が見つかりません",
    allButtonfree: "すべての無料カラーを選択",
    allButtonpaid: "すべての💧有料カラーを選択"
  },
  de_CH: {
    title: "Wplace Farbkonverter",
    freeColors: "Kostenlose Farben:",
    paidColors: "Bezahlte Farben (2000💧 pro Farbe):",
    download: "Bild herunterladen",
    clipboard: "In die Zwischenablage kopieren",
    goto: "Zu Wplace gehen",
    pixelsAmount: "Pixelanzahl:",
    width: "Breite:",
    height: "Höhe:",
    area: "Fläche:",
    imageCopied: "Bild in Zwischenablage kopiert!",
    copyFailed: "Bild konnte nicht kopiert werden.",
    imageNotFound: "Bild nicht gefunden",
    allButtonfree: "Alle kostenlosen Farben auswählen",
    allButtonpaid: "Alle 💧bezahlten Farben auswählen"
  },
  nl: {
    title: "Wplace Kleurconverter",
    freeColors: "Gratis kleuren:",
    paidColors: "Betaalde kleuren (2000💧 per stuk):",
    download: "Afbeelding downloaden",
    clipboard: "Kopiëren naar klembord",
    goto: "Ga naar Wplace",
    pixelsAmount: "Aantal pixels:",
    width: "Breedte:",
    height: "Hoogte:",
    area: "Oppervlakte:",
    imageCopied: "Afbeelding gekopieerd naar klembord!",
    copyFailed: "Afbeelding kopiëren mislukt.",
    imageNotFound: "Afbeelding niet gevonden",
    allButtonfree: "Selecteer alle gratis kleuren",
    allButtonpaid: "Selecteer alle 💧betaalde kleuren"
  },
  ru: {
    title: "Конвертер цветов Wplace",
    freeColors: "Бесплатные цвета:",
    paidColors: "Платные цвета (2000💧 за каждый):",
    download: "Скачать изображение",
    clipboard: "Копировать в буфер обмена",
    goto: "Перейти на Wplace",
    pixelsAmount: "Количество пикселей:",
    width: "Ширина:",
    height: "Высота:",
    area: "Площадь:",
    imageCopied: "Изображение скопировано в буфер обмена!",
    copyFailed: "Не удалось скопировать изображение.",
    imageNotFound: "Изображение не найдено",
    allButtonfree: "Выбрать все бесплатные цвета",
    allButtonpaid: "Выбрать все 💧платные цвета"
  }
};




function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Also re-translate width, height, and area
  if (currentImageWidth && currentImageHeight) {
    const t = translations[lang];
    document.getElementById("width").textContent = `${t.width} ${currentImageWidth}`;
    document.getElementById("height").textContent = `${t.height} ${currentImageHeight}`;
    document.getElementById("area").textContent = `${t.area} ${currentImageWidth * currentImageHeight}`;
  }
}


document.getElementById("lang-select").addEventListener("change", function () {
  const lang = this.value;
  applyTranslations(lang);
  localStorage.setItem("lang", lang);
});

// Load saved language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  document.getElementById("lang-select").value = savedLang;
  applyTranslations(savedLang);
});

// Global variables for image size:
let currentImageWidth = null;
let currentImageHeight = null;

// Helper to get current language from selector
function getCurrentLang() {
  const langSelect = document.getElementById('lang-select');
  return (langSelect && langSelect.value) || 'en';
}

// Show image info with translation
function showImageInfo(width, height) {
  const lang = getCurrentLang();
  const t = translations[lang];
  if (!width || !height) return;
  document.getElementById("width").textContent = `${t.width} ${width} px`;
  document.getElementById("height").textContent = `${t.height} ${height} px`;
  document.getElementById("area").textContent = `${t.area} ${width * height} px`;
}

// Update translations and image info when language changes
function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Refresh width/height/area display
  showImageInfo(currentImageWidth, currentImageHeight);
}

// Language selector change event
document.getElementById("lang-select").addEventListener("change", function () {
  const lang = this.value;
  applyTranslations(lang);
  localStorage.setItem("lang", lang);
});

// On page load, load saved language and apply it
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";
  document.getElementById("lang-select").value = savedLang;
  applyTranslations(savedLang);
});

// When loading an image, update the global size variables
upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;

      currentImageWidth = img.width;
      currentImageHeight = img.height;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      processarImagem();

      // Show info for the loaded image
      showImageInfo(currentImageWidth, currentImageHeight);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

document.addEventListener('paste', function (event) {
  if (!event.clipboardData) return;
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          const img = new Image();
          img.onload = function () {
            originalImage = img;
            currentImageWidth = img.width;
            currentImageHeight = img.height;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            processarImagem();
            showImageInfo(currentImageWidth, currentImageHeight);
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
      event.preventDefault();
      break;
    }
  }
});

