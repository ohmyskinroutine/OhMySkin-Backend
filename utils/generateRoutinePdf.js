const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

// transformer la routine en PDF telechargeable

async function generateRoutinePdf(routine = {}) {
  const { morning = [], evening = [] } = routine;
  // console.log("ROUTINE =", routine);

  console.log("PDF generation started");

  // creation PDF vide
  const pdfDoc = await PDFDocument.create();

  // Ajout d'une page format A4
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  // Polices
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // couleurs (ajout design)
  const primary = rgb(0.2, 0.18, 0.18);
  const accent = rgb(0.85, 0.78, 0.75);

  //  LOGO + IMAGE (à remplacer par tes urls)
  const logoUrl =
    "https://res.cloudinary.com/dxehv4yky/image/upload/v1775205815/Capture_d_e%CC%81cran_2026-04-03_a%CC%80_10.43.27_idhpkz.png";
  const bannerUrl =
    "https://res.cloudinary.com/dxehv4yky/image/upload/v1775205442/img-mail-pdf_j9jhit.jpg";

  // récupération des images
  const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const bannerBytes = await fetch(bannerUrl).then((res) => res.arrayBuffer());

  // intégration des images dans le PDF
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const bannerImage = await pdfDoc.embedJpg(bannerBytes);

  // affichage du logo
  page.drawImage(logoImage, {
    x: 50,
    y: height - 80,
    width: 100,
    height: 40,
  });

  // affichage de la bannière
  page.drawImage(bannerImage, {
    x: 50,
    y: height - 220,
    width: 495,
    height: 120,
  });

  // Position portrait et ou ecrire sur la page (on descend sous l'image)
  let y = height - 250;

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
  drawLine("Ta sélection skincare personnalisée", {
    size: 20,
    fontUsed: boldFont,
  });

  // descend après chaque ligne
  y -= 10;

  // ligne séparatrice (design)
  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
    color: accent,
  });

  y -= 25;

  //  Routine matin
  drawLine("Routine du matin", {
    size: 16,
    fontUsed: boldFont,
  });

  if (morning.length === 0) {
    drawLine("- Aucun produit");
  } else {
    // boucle sur les produits pour les afficher
    morning.forEach((product, index) => {
      if (!product) return;

      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
        { size: 13 },
      );

      if (product.brand) {
        drawLine(`${product.brand}`, {
          x: 70,
          size: 10,
          color: accent,
        });
      }
    });
  }

  y -= 15;

  //  Routine du soir
  drawLine("Routine du soir", {
    size: 16,
    fontUsed: boldFont,
  });

  if (evening.length === 0) {
    drawLine("- Aucun produit");
  } else {
    evening.forEach((product, index) => {
      if (!product) return;

      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
        { size: 13 },
      );

      if (product.brand) {
        drawLine(`${product.brand}`, {
          x: 70,
          size: 10,
          color: accent,
        });
      }
    });
  }

  y -= 30;

  // conseil
  drawLine("Conseil", {
    size: 14,
    fontUsed: boldFont,
  });

  drawLine(
    "Intègre progressivement les nouveaux produits pour préserver l’équilibre de ta peau.",
    { size: 11 },
  );

  // conversion tableau de bytes en PDF utilisable
  const pdfBytes = await pdfDoc.save();

  // transformés en buffer Node.js
  return Buffer.from(pdfBytes);
}

module.exports = generateRoutinePdf;
