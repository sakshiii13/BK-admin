const { Jimp } = require("jimp");

async function analyzeLogo() {
  const image = await Jimp.read("public/logo.png");
  image.resize({ w: 50, h: 50 }); // resize to speed up

  const colorCounts = {};

  for (let x = 0; x < image.bitmap.width; x++) {
    for (let y = 0; y < image.bitmap.height; y++) {
      const hex = image.getPixelColor(x, y).toString(16).padStart(8, '0');
      // ignore transparent or mostly transparent pixels
      if (!hex.endsWith('ff')) continue; // simplified check
      
      const r = hex.substring(0, 2);
      const g = hex.substring(2, 4);
      const b = hex.substring(4, 6);
      
      // ignore pure black/white/grays
      if (Math.abs(parseInt(r,16) - parseInt(g,16)) < 15 && Math.abs(parseInt(g,16) - parseInt(b,16)) < 15) continue;

      const rgbHex = `#${r}${g}${b}`;
      colorCounts[rgbHex] = (colorCounts[rgbHex] || 0) + 1;
    }
  }

  const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  console.log("Top 5 Colors:");
  for(let i=0; i<Math.min(5, sortedColors.length); i++) {
    console.log(sortedColors[i][0], sortedColors[i][1]);
  }
}

analyzeLogo().catch(console.error);
