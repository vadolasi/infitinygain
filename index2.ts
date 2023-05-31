import express from "express"
import { Cluster } from "puppeteer-cluster"

const app = express()

const args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
  "--disable-accelerated-2d-canvas",
  "--disable-gpu"
]

;(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 32,
    puppeteerOptions: { args, headless: "new" }
  })

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url)
    return await page.content()
  })

  app.get("/", async function (req, res) {
    if (!req.query.url) {
      return res.end("Please specify url like this: ?url=example.com");
    }

    try {
      res.send(await cluster.execute(req.query.url))
    } catch (err) {
      res.status(500).send("Error: " + err.message)
    }
  })

  app.listen(3000, function () {
    console.log("listen on http://localhost:3000")
  })
})()
