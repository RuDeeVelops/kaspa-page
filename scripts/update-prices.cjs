#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const yahooFinance = require('yahoo-finance2').default

// File to update
const appPath = path.join(__dirname, '../src/App.jsx')

// Yahoo Finance symbols
const YAHOO_SYMBOLS = {
  sp500: '^GSPC',
  nasdaq: '^IXIC',
  gold: 'GC=F', // Gold Futures
}

// CoinGecko API for BTC and Kaspa
const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,kaspa&vs_currencies=usd'

async function fetchPrices() {
  // Fetch S&P 500, Nasdaq, Gold from Yahoo Finance
  const [sp500Quote, nasdaqQuote, goldQuote] = await Promise.all([
    yahooFinance.quote(YAHOO_SYMBOLS.sp500),
    yahooFinance.quote(YAHOO_SYMBOLS.nasdaq),
    yahooFinance.quote(YAHOO_SYMBOLS.gold),
  ])
  const sp500 = sp500Quote.regularMarketPrice || 5277.0
  const nasdaq = nasdaqQuote.regularMarketPrice || 16400.0
  const gold = goldQuote.regularMarketPrice || 2300

  // Fetch BTC and Kaspa from CoinGecko
  const cgRes = await fetch(COINGECKO_URL)
  const cgData = await cgRes.json()
  const btc = cgData.bitcoin?.usd || 69000
  const kaspa = cgData.kaspa?.usd || 0.091

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
