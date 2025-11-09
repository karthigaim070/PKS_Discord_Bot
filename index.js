import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🧩 Replace these with your actual Discord Webhook URLs
const DAY_POWER_MOVE_WEBHOOK = "https://discord.com/api/webhooks/XXXX/daypowermove";
const TODAY_HIGH_LOW_WEBHOOK = "https://discord.com/api/webhooks/YYYY/todayhighlow";
const POWER_CRT_WEBHOOK = "https://discord.com/api/webhooks/ZZZZ/powercrt";

app.post("/", async (req, res) => {
  const alert = req.body;
  let msg = alert.content?.toLowerCase() || "";
  console.log("📩 Received alert:", msg);
  console.log("📩 Received alert:", req);
  msg = msg.replace(/\s+/g, ""); // remove spaces/newlines for safe matching


  try {
    let webhookUrl;

    // Filter which Discord channel to send to
    if (msg.includes("daypowermove")) {
      webhookUrl = DAY_POWER_MOVE_WEBHOOK;
    } else if (msg.includes("todayhighorlowcreated")) {
      webhookUrl = TODAY_HIGH_LOW_WEBHOOK;
    } else if (msg.includes("powercrt")) {
      webhookUrl = POWER_CRT_WEBHOOK;
    } else {
      console.log("⚠️ Ignored alert — no keyword matched");
      return res.status(200).send("Ignored: no match");
    }

    // Send message to chosen Discord channel
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚀 **TradingView Alert:** ${alert.message}`
      })
    });

    console.log("✅ Sent to Discord:", alert.message);
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error sending alert:", error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("🚀 Bot running on port 3000"));
