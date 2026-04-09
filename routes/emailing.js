const express = require("express");
const { Resend } = require("resend");
const generateRoutinePdf = require("../utils/generateRoutinePdf");

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/send-email", async (req, res) => {
  try {
    const { email, subject, html, routine } = req.body; //backend reçoit du front

    // console.log("REQ BODY =", req.body);
    // console.log("ROUTINE =", routine);
    if (!email) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    //GENERER PDF

    //utilisation dun buffer pour lenvoi du pdf
    const pdfBuffer = await generateRoutinePdf(routine);
    // console.log(pdfBuffer);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev", //obligatoire sans domaine ne pas changer
      to: email, // le backend envoi au mail defini dans le front
      // A adapter ensuite
      subject: subject,
      html: html,
      attachments: [
        {
          filename: "Ma-routine-skincare.pdf",
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({
      message: "Email envoyé avec PDF",
      data,
    });
  } catch (error) {
    console.error("Erreur envoi email :", error);
    res.status(500).json({
      message: "Erreur lors de l'envoi",
      error: error.message,
    });
  }
});

module.exports = router;
