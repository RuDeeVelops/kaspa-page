# Kaspa ROI App

A modern, static web app that visualizes Kaspa's annualized ROI and compares it to major assets (S&P 500, Bitcoin, Nasdaq, Gold) since May 26, 2022. Includes a shareable screenshot feature and daily auto-updating prices via GitHub Actions.

---

## 🚀 Features

- **Kaspa ROI Dashboard**: See Kaspa's annualized return since inception.
- **Benchmarks**: Compare Kaspa to S&P 500, Bitcoin, Nasdaq, and Gold.
- **Investment Projection**: See hypothetical future values for custom investments.
- **Shareable Screenshot**: Instantly generate a clean, branded image for social sharing.
- **Automated Price Updates**: All prices update daily via GitHub Actions—no backend required.

---

## ⚙️ How It Works

- **Static App**: All logic runs in the browser, with no server required.
- **Price Constants**: Current prices for all assets are stored as constants in `App.jsx`.
- **GitHub Actions**: The workflow `.github/workflows/update-prices.yml` runs daily, executing `scripts/update-prices.js` to fetch the latest prices and update `App.jsx`.
- **No API Quota Issues**: Only the GitHub Action fetches prices, so user traffic never hits the APIs.

---

## 🛠 Local Development

1. Clone the repo and `cd` into `kaspa-page`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🤖 Automated Price Updates

- The script at `scripts/update-prices.js` fetches the latest prices for:
  - Kaspa (CoinGecko)
  - S&P 500, Bitcoin, Nasdaq, Gold (FMP API)
- It updates the constants in `src/App.jsx`.
- The GitHub Actions workflow runs this script daily and pushes changes automatically.
- **You do not need to run this manually!**

---

## 🧩 Customization

- **Add/Remove Assets**: Edit `scripts/update-prices.js` and the relevant sections in `src/App.jsx`.
- **Change Initial Dates/Values**: Update the `*_Initial` constants in `App.jsx`.
- **Change Share Text/Branding**: Edit the share modal and screenshot card in `App.jsx`.

---

---

## License

MIT
