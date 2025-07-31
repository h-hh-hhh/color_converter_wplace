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
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const [nr, ng, nb] = corMaisProxima(r, g, b);
        data[i] = nr;
        data[i + 1] = ng;
        data[i + 2] = nb;
      }
      ctx.putImageData(imgData, 0, 0);
      
      downloadLink.href = canvas.toDataURL("image/png");
}