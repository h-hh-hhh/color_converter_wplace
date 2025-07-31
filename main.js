const padrao = [
  [0,0,0],[60,60,60],[120,120,120],[170,170,170],[210,210,210],[255,255,255],
  [96,0,24],[237,28,36],[250,128,114],[228,92,26],[255,127,39],[246,170,9],
  [249,221,59],[255,250,188],[232,212,95],[74,107,58],[90,148,74],[132,197,115],
  [14,185,104],[19,230,123],[16,174,166],[19,225,190],[15,121,159],[96,247,242],
  [187,250,242],[40,80,158],[64,147,228],[77,49,184],[107,80,246],[153,177,251],
  [74,66,132],[122,113,196],[181,174,241],[170,56,185],[224,159,249],
  [203,0,122],[236,31,128],[243,141,169],[155,82,73],[209,128,120],[250,182,164],
  [104,70,52],[149,104,42],[219,164,99],[123,99,82],[156,132,107],[214,181,148],
  [209,128,81],[248,178,119],[255,197,165],[109,100,63],[148,140,107],[205,197,158],
  [51,57,65],[109,117,141],[179,185,209]
];

    const upload = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('download');

    upload.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          processarImagem();
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });

    function corMaisProxima(r, g, b) {
      let menorDist = Infinity;
      let cor = [0, 0, 0];
      for (let i = 0; i < padrao.length; i++) {
        const pr = padrao[i][0];
        const pg = padrao[i][1];
        const pb = padrao[i][2];
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
    const colorNames = [
      "Black", "Dark Gray", "Gray", "Medium Gray", "Light Gray", "White",
      "Deep Red", "Red", "Light Red", "Dark Orange", "Orange", "Gold",
      "Yellow", "Light Yellow", "Light Goldenrod", "Dark Olive", "Olive", "Light Olive",
      "Dark Green", "Green", "Teal", "Light Teal", "Dark Cyan", "Cyan",
      "Light Cyan", "Dark Blue", "Blue", "Dark Indigo", "Indigo", "Light Indigo",
      "Dark Slate Blue", "Slate Blue", "Light Slate Blue", "Purple", "Light Purple",
      "Dark Pink", "Pink", "Light Pink", "Dark Peach", "Peach", "Light Peach",
      "Dark Brown", "Brown", "Light Brown", "Dark Tan", "Tan", "Light Tan",
      "Dark Beige", "Beige", "Light Beige", "Dark Stone", "Stone", "Light Stone",
      "Dark Slate", "Slate", "Light Slate"
    ];
    label.textContent = `${colorNames[idx]}: ${count} px`;
    colorItem.appendChild(swatch);
    colorItem.appendChild(label);
    colorListDiv.appendChild(colorItem);
  });
}

/* 
Black: rgb(0, 0, 0)
Dark Gray: rgb(60, 60, 60)
Gray: rgb(120, 120, 120)
Medium Gray: rgb(170, 170, 170)
Light Gray: rgb(210, 210, 210)
White: rgb(255, 255, 255)
Deep Red: rgb(96, 0, 24)
Red: rgb(237, 28, 36)
Light Red: rgb(250, 128, 114)
Dark Orange: rgb(228, 92, 26)
Orange: rgb(255, 127, 39)
Gold: rgb(246, 170, 9)
Yellow: rgb(249, 221, 59)
Light Yellow: rgb(255, 250, 188)
Light Goldenrod: rgb(232, 212, 95)
Dark Olive: rgb(74, 107, 58)
Olive: rgb(90, 148, 74)
Light Olive: rgb(132, 197, 115)
Dark Green: rgb(14, 185, 104)
Green: rgb(19, 230, 123)
Teal: rgb(16, 174, 166)
Light Teal: rgb(19, 225, 190)
Dark Cyan: rgb(15, 121, 159)
Cyan: rgb(96, 247, 242)
Light Cyan: rgb(187, 250, 242)
Dark Blue: rgb(40, 80, 158)
Blue: rgb(64, 147, 228)
Dark Indigo: rgb(77, 49, 184)
Indigo: rgb(107, 80, 246)
Light Indigo: rgb(153, 177, 251)
Dark Slate Blue: rgb(74, 66, 132)
Slate Blue: rgb(122, 113, 196)
Light Slate Blue: rgb(181, 174, 241)
Purple: rgb(170, 56, 185)
Light Purple: rgb(224, 159, 249)
Dark Pink: rgb(203, 0, 122)
Pink: rgb(236, 31, 128)
Light Pink: rgb(243, 141, 169)
Dark Peach: rgb(155, 82, 73)
Peach: rgb(209, 128, 120)
Light Peach: rgb(250, 182, 164)
Dark Brown: rgb(104, 70, 52)
Brown: rgb(149, 104, 42)
Light Brown: rgb(219, 164, 99)
Dark Tan: rgb(123, 99, 82)
Tan: rgb(156, 132, 107)
Light Tan: rgb(214, 181, 148)
Dark Beige: rgb(209, 128, 81)
Beige: rgb(248, 178, 119)
Light Beige: rgb(255, 197, 165)
Dark Stone: rgb(109, 100, 63)
Stone: rgb(148, 140, 107)
Light Stone: rgb(205, 197, 158)
Dark Slate: rgb(51, 57, 65)
Slate: rgb(109, 117, 141)
Light Slate: rgb(179, 185, 209)
Transparent: rgba(0, 0, 0, 1)
*/

const scaleRange = document.getElementById('scaleRange');
    const scaleValue = document.getElementById('scaleValue');
    scaleRange.addEventListener('input', function() {
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
