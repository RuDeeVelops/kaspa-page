#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

// File to update
const appPath = path.join(__dirname, '../src/App.jsx')

// API endpoints
const FMP_API = 'https://financialmodelingprep.com/api/v3/quote-short/'
const FMP_SYMBOLS = ['^GSPC', 'BTCUSD', '^IXIC', 'XAUUSD']
const FMP_URL = `${FMP_API}${FMP_SYMBOLS.join(',')}?apikey=demo`
const COINGECKO_KASPA_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd'

async function fetchPrices() {
  // Fetch S&P 500, BTC, Nasdaq, Gold
  const fmpRes = await fetch(FMP_URL)
  const fmpData = await fmpRes.json()
  const sp500 = fmpData.find((d) => d.symbol === '^GSPC')?.price || 5277.0
  const btc = fmpData.find((d) => d.symbol === 'BTCUSD')?.price || 69000
  const nasdaq = fmpData.find((d) => d.symbol === '^IXIC')?.price || 16400.0
  const gold = fmpData.find((d) => d.symbol === 'XAUUSD')?.price || 2300

  // Fetch Kaspa from CoinGecko
  const kaspaRes = await fetch(COINGECKO_KASPA_URL)
  const kaspaData = await kaspaRes.json()
  const kaspa = kaspaData.kaspa?.usd || 0.091

  return { kaspa, sp500, btc, nasdaq, gold }
}

function updateConstant(content, name, value, comment) {
  // Regex to match the constant line
  const regex = new RegExp(`(// AUTO-UPDATE: DO NOT EDIT MANUALLY\s*\nconst ${name} = )(.*?)(;.*$)`, 'm')
  return content.replace(regex, `$1${value}$3`)
}

async function main() {
  const { kaspa, sp500, btc, nasdaq, gold } = await fetchPrices()
  let content = fs.readFileSync(appPath, 'utf8')

  content = updateConstant(content, 'currentKaspaPrice', kaspa, 'Kaspa')
  content = updateConstant(content, 'sp500Current', sp500, 'S&P 500')
  content = updateConstant(content, 'btcCurrent', btc, 'Bitcoin')
  content = updateConstant(content, 'nasdaqCurrent', nasdaq, 'Nasdaq')
  content = updateConstant(content, 'goldCurrent', gold, 'Gold')

  fs.writeFileSync(appPath, content, 'utf8')
  console.log('App.jsx updated with latest prices:', { kaspa, sp500, btc, nasdaq, gold })
}

main().catch((err) => {
  console.error('Failed to update prices:', err)
  process.exit(1)
})
