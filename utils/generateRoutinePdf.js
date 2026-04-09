const { PDFDocument, rgb } = require("pdf-lib");

//importation polices
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");
const path = require("path");

// transformer la routine en PDF telechargeable

// Helper logo : garde les proportions sans etirer
function drawImageContain(page, image, x, y, boxWidth, boxHeight) {
  const imgWidth = image.width;
  const imgHeight = image.height;

  const scale = Math.min(boxWidth / imgWidth, boxHeight / imgHeight);

  const drawWidth = imgWidth * scale;
  const drawHeight = imgHeight * scale;

  const drawX = x + (boxWidth - drawWidth) / 2;
  const drawY = y + (boxHeight - drawHeight) / 2;

  page.drawImage(image, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  });
}

async function generateRoutinePdf(routine = {}) {
  const { morning = [], evening = [] } = routine;
  // console.log("ROUTINE =", routine);

  // console.log("PDF generation started");

  // creation PDF vide
  const pdfDoc = await PDFDocument.create();

  //Enregistrer fonkit apres  la creation du PDF
  pdfDoc.registerFontkit(fontkit);

  // Ajout d'une page format A4
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  //Ajout fond beige // (fond site)
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.953, 0.945, 0.953),
  });

  //bordure page
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(1, 1, 1), // blanc
    borderWidth: 2,
  });

  //marges page
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(1, 1, 1),
    borderWidth: 2,
  });

  // Polices
  const fontBytes = fs.readFileSync(
    path.join(__dirname, "../fonts/Quicksand-Regular.ttf"),
  );

  const boldFontBytes = fs.readFileSync(
    path.join(__dirname, "../fonts/Quicksand-Bold.ttf"),
  );

  const font = await pdfDoc.embedFont(fontBytes);
  const boldFont = await pdfDoc.embedFont(boldFontBytes);

  // couleurs (ajout design)
  const primary = rgb(0.2, 0.18, 0.18);
  const accent = rgb(0.85, 0.78, 0.75);

  //  LOGO
  const logoUrl =
    "https://res.cloudinary.com/dxehv4yky/image/upload/v1775205815/Capture_d_e%CC%81cran_2026-04-03_a%CC%80_10.43.27_idhpkz.png";

  // récupération des images
  const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());

  // intégration des images dans le PDF
  const logoImage = await pdfDoc.embedPng(logoBytes);

  // affichage du logo
  const logoWidth = 130;
  const logoHeight = 65;

  //logo
  drawImageContain(
    page,
    logoImage,
    (width - logoWidth) / 2,
    height - 110,
    logoWidth,
    logoHeight,
  );

  // Position portrait et ou ecrire sur la page (on descend sous l'image)
  let y = height - 190;

  // chaque ligne descend (sinon ça s'ecrit au meme endroit)
  const drawLine = (text, options = {}) => {
    const {
      x = 50,
      size = 12,
      fontUsed = font,
      color = primary,
      spacing = 10,
    } = options;

    // fonction qui ecrit le texte sur le PDF
    page.drawText(text, {
      x,
      y,
      size,
      font: fontUsed,
      color,
    });

    y -= size + spacing;
  };

  //  titre principal
  const title = "Ta sélection skincare personnalisée";
  const textWidth = boldFont.widthOfTextAtSize(title, 22);

  page.drawText(title, {
    x: (width - textWidth) / 2, // centrage horizontal
    y,
    size: 22,
    font: boldFont,
    color: primary,
  });

  y -= 22 + 16;

  // descend après chaque ligne
  y -= 12;

  // ligne séparatrice (design)
  const lineWidth = 360;

  page.drawLine({
    start: { x: (width - lineWidth) / 2, y },
    end: { x: (width + lineWidth) / 2, y },
    thickness: 1,
    color: accent,
  });

  y -= 60;

  //  Routine matin
  drawLine("Routine du matin", {
    size: 16,
    fontUsed: boldFont,
    spacing: 14,
  });

  if (morning.length === 0) {
    drawLine("- Aucun produit");
  } else {
    // boucle sur les produits pour les afficher
    morning.forEach((product, index) => {
      if (!product) return;

      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
        { size: 13, spacing: 8 },
      );

      if (product.brand) {
        drawLine(product.brand, {
          x: 70,
          size: 10,
          color: rgb(0.42, 0.37, 0.37),
          spacing: 10,
        });
      }
    });
  }

  y -= 22;

  //  Routine du soir
  drawLine("Routine du soir", {
    size: 16,
    fontUsed: boldFont,
    spacing: 14,
  });

  if (evening.length === 0) {
    drawLine("- Aucun produit");
  } else {
    evening.forEach((product, index) => {
      if (!product) return;

      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
        { size: 13, spacing: 8 },
      );

      if (product.brand) {
        drawLine(product.brand, {
          x: 70,
          size: 10,
          color: rgb(0.42, 0.37, 0.37),
          spacing: 10,
        });
      }
    });
  }

  y -= 40;

  // conseil
  drawLine("Conseil:", {
    size: 14,
    fontUsed: boldFont,
    spacing: 14,
  });

  drawLine(
    "Intègre progressivement les nouveaux produits pour préserver l’équilibre de ta peau.",
    { size: 11, spacing: 12 },
  );

  // conversion tableau de bytes en PDF utilisable
  const pdfBytes = await pdfDoc.save();

  // transformés en buffer Node.js
  return Buffer.from(pdfBytes);
}

module.exports = generateRoutinePdf;
