/**
 * AstroLife Sacred Dossier Email Template
 * Royal Vedic Aesthetic: Midnight Obsidian (#080811), Sacred Gold (#D4AF37, #C8A030), Ivory (#FAF7F2).
 * Responsive HTML email designed for maximum deliverability and aesthetic reverence.
 */

export interface DossierEmailParams {
  seekerName: string;
  reportTitle: string;
  reportId: string;
  price: string;
  orderId: string;
  paymentId: string;
  lagnaRashi?: string;
  moonSign?: string;
  nakshatra?: string;
  mahadasha?: string;
  downloadUrl?: string;
}

export function buildDossierEmailHtml(params: DossierEmailParams): string {
  const {
    seekerName,
    reportTitle,
    price,
    orderId,
    paymentId,
    lagnaRashi = "Vedic Ascendant",
    moonSign = "Chandra Rashi",
    nakshatra = "Janma Nakshatra",
    mahadasha = "Active Dasha Cycle",
    downloadUrl = "https://astrolife-ai.vercel.app/dashboard/history",
  } = params;

  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Sacred Vedic Dossier — AstroLife AI</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #080811;
      color: #FAF7F2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #080811;
      padding: 30px 10px;
    }
    .main-table {
      max-width: 600px;
      margin: 0 auto;
      background: #0D0D18;
      border: 1px solid #D4AF37;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(212, 175, 55, 0.15);
    }
    .header {
      background: linear-gradient(180deg, #161626 0%, #0D0D18 100%);
      padding: 36px 24px 24px 24px;
      text-align: center;
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }
    .om-badge {
      display: inline-block;
      width: 54px;
      height: 54px;
      line-height: 54px;
      font-size: 32px;
      color: #D4AF37;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid #D4AF37;
      border-radius: 50%;
      margin-bottom: 12px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #FAF7F2;
      margin: 0;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 11px;
      letter-spacing: 3px;
      color: #D4AF37;
      text-transform: uppercase;
      margin-top: 4px;
      font-weight: 600;
    }
    .content-body {
      padding: 32px 28px;
    }
    .salutation {
      font-size: 20px;
      font-weight: 600;
      color: #FAF7F2;
      margin-bottom: 12px;
    }
    .paragraph {
      font-size: 14px;
      line-height: 1.65;
      color: #C5BFB5;
      margin-bottom: 20px;
    }
    .dossier-card {
      background: #141424;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .dossier-badge {
      display: inline-block;
      background: rgba(212, 175, 55, 0.15);
      color: #D4AF37;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 10px;
      border: 1px solid rgba(212, 175, 55, 0.4);
    }
    .dossier-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 12px 0;
    }
    .grid-table {
      width: 100%;
      margin-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 12px;
    }
    .grid-label {
      font-size: 11px;
      color: #8E887E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding-bottom: 4px;
    }
    .grid-value {
      font-size: 13px;
      color: #FAF7F2;
      font-weight: 600;
      padding-bottom: 10px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0 20px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #E6C25B 0%, #B8860B 100%);
      color: #080811 !important;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-decoration: none;
      padding: 15px 32px;
      border-radius: 30px;
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
    }
    .guarantee-box {
      background: rgba(22, 163, 74, 0.08);
      border: 1px solid rgba(22, 163, 74, 0.3);
      border-radius: 10px;
      padding: 14px 16px;
      margin: 24px 0 16px 0;
    }
    .guarantee-text {
      font-size: 12px;
      color: #86EFAC;
      line-height: 1.5;
      margin: 0;
    }
    .shloka-box {
      text-align: center;
      padding: 20px;
      border-top: 1px dashed rgba(212, 175, 55, 0.25);
      margin-top: 28px;
    }
    .shloka {
      font-size: 13px;
      color: #D4AF37;
      font-style: italic;
      margin-bottom: 6px;
    }
    .shloka-meaning {
      font-size: 11px;
      color: #8E887E;
    }
    .footer {
      background: #080811;
      padding: 24px;
      text-align: center;
      font-size: 11px;
      color: #6C665D;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .footer a {
      color: #D4AF37;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" align="center" width="100%" cellpadding="0" cellspacing="0">
      <!-- HEADER -->
      <tr>
        <td class="header">
          <div class="om-badge">ॐ</div>
          <h1 class="brand-title">AstroLife AI</h1>
          <div class="brand-sub">Sacred Mathematical Vedic Shastra</div>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td class="content-body">
          <div class="salutation">प्रणाम, ${seekerName} Ji 🙏</div>
          <p class="paragraph">
            Your sacred astrological dossier has been computed with astronomical precision across your exact natal coordinates and planetary degrees. A complete print-ready vector PDF is attached directly to this email.
          </p>

          <!-- DOSSIER CARD -->
          <div class="dossier-card">
            <span class="dossier-badge">Official Mathematical Dossier</span>
            <h2 class="dossier-title">${reportTitle}</h2>

            <table class="grid-table" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%">
                  <div class="grid-label">Ascendant / Moon</div>
                  <div class="grid-value" style="color: #D4AF37;">${lagnaRashi} • ${moonSign}</div>
                </td>
                <td width="50%">
                  <div class="grid-label">Active Dasha</div>
                  <div class="grid-value">${mahadasha}</div>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <div class="grid-label">Order Reference</div>
                  <div class="grid-value" style="font-family: monospace; font-size: 11px;">${orderId}</div>
                </td>
                <td width="50%">
                  <div class="grid-label">Amount Paid</div>
                  <div class="grid-value">${price} • Lifetime Access</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA BUTTON -->
          <div class="cta-container">
            <a href="${downloadUrl}" target="_blank" class="cta-button">
              📥 Open In History Vault
            </a>
          </div>

          <!-- ATTACHMENT NOTICE -->
          <p class="paragraph" style="text-align: center; font-size: 12px; color: #8E887E;">
            📎 <em>Note: Your complete 20–24 page PDF dossier is also attached to this email as a downloadable file for permanent offline reading.</em>
          </p>

          <!-- ETHICAL SATVIK GUARANTEE -->
          <div class="guarantee-box">
            <p class="guarantee-text">
              <strong>✦ AstroLife Ethical Guarantee:</strong> Every single remedy inside this dossier is 100% free, authentic, and rooted in classical Parashari & Lal Kitab texts. We practice zero fear-mongering and recommend zero expensive commercial rituals.
            </p>
          </div>

          <!-- SHLOKA -->
          <div class="shloka-box">
            <div class="shloka">"ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥"</div>
            <div class="shloka-meaning">From falsehood lead me to truth; from darkness lead me to light; from mortality lead me to immortality.</div>
          </div>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td class="footer">
          <div>© ${currentYear} AstroLife AI • All Rights Reserved</div>
          <div style="margin-top: 6px;">
            Questions or need guidance? Reply directly to this email or visit 
            <a href="https://astrolife-ai.vercel.app">astrolife-ai.vercel.app</a>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

export function buildDossierEmailText(params: DossierEmailParams): string {
  return `प्रणाम ${params.seekerName} Ji,

Your sacred astrological dossier "${params.reportTitle}" has been computed with astronomical precision.

Order Reference: ${params.orderId}
Payment Reference: ${params.paymentId}
Amount: ${params.price}
Delivery: Attached as official PDF file.

You can also view and re-download your dossier anytime from your lifetime vault:
https://astrolife-ai.vercel.app/dashboard/history

AstroLife Ethical Guarantee:
Every remedy inside this dossier is 100% free, authentic, and rooted in classical Vedic texts. Zero fear-mongering, zero expensive rituals.

"धर्मो रक्षति रक्षितः"
AstroLife AI • https://astrolife-ai.vercel.app
`;
}
