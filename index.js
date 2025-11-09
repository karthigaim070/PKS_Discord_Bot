import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// 🧩 Replace these with your actual Discord Webhook URLs
const DAY_POWER_MOVE_WEBHOOK = "https://discordapp.com/api/webhooks/1437027104507170937/EnH0fysCXSZUDsh6jPtiWbxFw16cOBZC49T5duOpYVL7W-aoLF_5W8Y92SrdZakciTQn";
const TODAY_HIGH_LOW_WEBHOOK = "https://discord.com/api/webhooks/YYYY/todayhighlow";
const POWER_CRT_WEBHOOK = "https://discord.com/api/webhooks/ZZZZ/powercrt";

app.post("/", async (req, res) => {
  const alert = req.body;
  let msg = alert.content?.toLowerCase() || "";
  console.log("📩 Received alert:", msg);

  msg = msg.replace(/\s+/g, ""); // remove spaces/newlines for safe matching


  try {
    let webhookUrl;

    // Filter which Discord channel to send to
    if (msg.includes("daypowermove")) {
      console.log("daypowermove:TRUE");
      webhookUrl = DAY_POWER_MOVE_WEBHOOK;
    } else if (msg.includes("todayhighorlowcreated")) {
      console.log("todayhighorlowcreated:TRUE");
      webhookUrl = TODAY_HIGH_LOW_WEBHOOK;
    } else if (msg.includes("powercrt")) {
      console.log("powercrt:TRUE");
      webhookUrl = POWER_CRT_WEBHOOK;
    }
    else {
      console.log("⚠️ Ignored alert — no keyword matched");
      return res.status(200).send("Ignored: no match");
    }

    // Send message to chosen Discord channel
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚀 **TradingView Alert:**\n ${alert.content}`
      })
    });

    console.log("✅ Sent to Discord:", alert.content);
    res.status(200).send("OK");
  } catch (error) {
    console.error("❌ Error sending alert:", error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("🚀 Bot running on port 3000"));
