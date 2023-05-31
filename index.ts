import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { writeFile } from "fs/promises"

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

puppeteer.use(StealthPlugin())

;(async () => {
  const browser = await puppeteer.launch({ args, headless: "new" })
  const page = await browser.newPage()

  await page.goto("https://sport.bet7k.com")

  let result: any[] = []

  const addResult = async (data: any) => {
    result.push(data)
  }

  await page.exposeFunction("addResult", addResult)

  const nodelog = (...args: any[]) => {
    console.log(...args)
  }

  await page.exposeFunction("nodelog", nodelog)

  await page.evaluate(() => {
    const run = async () => {
      let response = await fetch("https://sport.bet7k.com/Prematch/GetCountryList", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \";Not A Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://sport.bet7k.com/",
        "referrerPolicy": "strict-origin",
        "body": "{\"sportId\":1,\"timeFilter\":0,\"langId\":30,\"partnerId\":506,\"countryCode\":\"BR\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })

      const data = await response.json()

      for (const { Id, N } of data) {
        response = await fetch("https://sport.bet7k.com/Prematch/GetChampsList", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          "referrer": "https://sport.bet7k.com/",
          "referrerPolicy": "strict-origin",
          "body": `{\"countryId\":${Id},\"timeFilter\":0,\"langId\":30,\"partnerId\":506,\"countryCode\":\"BR\"}`,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })

        const leagues = await response.json()

        for (const league of leagues) {
          addResult({ id: league.Id, country: N, league: league.N })
        }
      }
    }

    return run()
  })

  await writeFile("bet7k.json", JSON.stringify(result, null, 2))

  result = []

  await page.goto("https://realsbet.com/sportsbook/Football/")

  await page.exposeFunction("addResult", addResult)

  await page.evaluate(() => {
    const run = async () => {
      let response = await fetch("https://sport.bet7k.com/Prematch/GetCountryList", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \";Not A Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://sport.bet7k.com/",
        "referrerPolicy": "strict-origin",
        "body": "{\"sportId\":1,\"timeFilter\":0,\"langId\":30,\"partnerId\":506,\"countryCode\":\"BR\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })

      const data = await response.json()

      for (const { Id, N } of data) {
        response = await fetch("https://sport.bet7k.com/Prematch/GetChampsList", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          "referrer": "https://sport.bet7k.com/",
          "referrerPolicy": "strict-origin",
          "body": `{\"countryId\":${Id},\"timeFilter\":0,\"langId\":30,\"partnerId\":506,\"countryCode\":\"BR\"}`,
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        })

        const leagues = await response.json()

        for (const league of leagues) {
          addResult({ id: league.Id, country: N, league: league.N })
        }
      }
    }

    return run()
  })

  await browser.close()
})()
