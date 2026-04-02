const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

//transformer la routine en PDF telechargeable

async function generateRoutinePdf(routine = {}) {
  const { morning = [], evening = [] } = routine;
  //   console.log("ROUTINE =", routine);
  //creation PDF vide
  const pdfDoc = await PDFDocument.create();
  //Ajout d'une page format A4
  const page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  //Polices
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  //Position portrait et ou ecrire sur la page
  let y = height - 50;

  //chaque ligne descend (sinon ça s'escrit au meme endroit)
  const drawLine = (text, options = {}) => {
    const {
      x = 50,
      size = 12,
      fontUsed = font,
      color = rgb(0, 0, 0),
    } = options;

    //fonction qui ecrit le texte sur le PDF
    page.drawText(text, {
      x,
      y,
      size,
      font: fontUsed,
      color,
    });

    y -= size + 10;
  };

  drawLine("Routine skincare personnalisée", {
    size: 20,
    fontUsed: boldFont,
  });

  //descend après chaque ligne
  y -= 10;

  //Gros titre en haut
  drawLine("Routine du matin", {
    size: 16,
    fontUsed: boldFont,
  });

  if (morning.length === 0) {
    drawLine("- Aucun produit");
  } else {
    //boucle sur les produits pour les afficher
    morning.forEach((product, index) => {
      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
      );
      if (product.brand) {
        drawLine(`Marque : ${product.brand}`, { x: 70, size: 10 });
      }
    });
  }

  y -= 10;

  drawLine("Routine du soir", {
    size: 16,
    fontUsed: boldFont,
  });

  if (evening.length === 0) {
    drawLine("- Aucun produit");
  } else {
    evening.forEach((product, index) => {
      drawLine(
        `${index + 1}. ${product.name || product.product_name || "Produit"}`,
      );
      if (product.brand) {
        drawLine(`Marque : ${product.brand}`, { x: 70, size: 10 });
      }
    });
  }
  //conversion Tableau de bytes en PDF utilisable
  const pdfBytes = await pdfDoc.save();
  //transformés en buffer Node.js
  return Buffer.from(pdfBytes);
}

module.exports = generateRoutinePdf;
