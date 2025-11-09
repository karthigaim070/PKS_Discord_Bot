import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
//tyuu
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// --- Replace these with your actual Discord webhook URLs ---
const WEBHOOKS = {
  dayPowerMove: "https://discord.com/api/webhooks/XXXX/XXXX", // your #day-power-move webhook
  dayHL: "https://discord.com/api/webhooks/YYYY/YYYY",         // your #day-hl-alerts webhook
  powerCR: "https://discord.com/api/webhooks/ZZZZ/ZZZZ"        // your #power-cr-alerts webhook
};

// --- Main route ---
app.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log("📩 Received alert:", data);

    const message = data.content || "";
    const msgLower = message.toLowerCase();

    let targetWebhook = WEBHOOKS.dayPowerMove; // default

    if (msgLower.includes("power move")) targetWebhook = WEBHOOKS.dayPowerMove;
    else if (msgLower.includes("hl alert") || msgLower.includes("high") || msgLower.includes("low"))
      targetWebhook = WEBHOOKS.dayHL;
    else if (msgLower.includes("power cr") || msgLower.includes("cr level"))
      targetWebhook = WEBHOOKS.powerCR;

    const response = await fetch(targetWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "PKS Power Move Bot",
        content: message
      })
    });

    if (response.ok) {
      console.log("✅ Sent to Discord!");
      res.status(200).send("Message sent!");
    } else {
      console.error("❌ Discord error:", await response.text());
      res.status(500).send("Discord error");
    }
  } catch (err) {
    console.error("🔥 Error:", err);
    res.status(500).send("Internal error");
  }
});

app.listen(PORT, () => console.log(`🚀 PKS Discord Bot running on port ${PORT}`));
