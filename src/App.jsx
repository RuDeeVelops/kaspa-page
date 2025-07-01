import React, { useState, useEffect, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'

// Utility function to calculate CAGR (Compound Annual Growth Rate)
const calculateCAGR = (initialValue, finalValue, years) => {
  if (initialValue === 0 || years <= 0) return 0
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100
}

// Main App component
const App = () => {
  // Investment details for Kaspa (USD values)
  const initialKaspaPrice = 0.000171 // USD, May 26, 2022 (All-time low)
  const initialKaspaDate = new Date('2022-05-26T00:00:00Z')

  // Get today's date dynamically
  const today = new Date()
  const formattedToday = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // AUTO-UPDATE: DO NOT EDIT MANUALLY
  const currentKaspaPrice = 0.091 // USD, Approximate current price
  // AUTO-UPDATE: DO NOT EDIT MANUALLY
  const sp500Current = 5277.0 // USD, S&P 500 current price
  // AUTO-UPDATE: DO NOT EDIT MANUALLY
  const btcCurrent = 69000 // USD, Bitcoin current price
  // AUTO-UPDATE: DO NOT EDIT MANUALLY
  const nasdaqCurrent = 16400.0 // USD, Nasdaq current price
  // AUTO-UPDATE: DO NOT EDIT MANUALLY
  const goldCurrent = 2300 // USD, Gold current price

  // Calculate time difference in years for historical ROI
  const timeDifferenceMs = today.getTime() - initialKaspaDate.getTime()
  const historicalYears = timeDifferenceMs / (1000 * 60 * 60 * 24 * 365.25) // Account for leap years

  // Benchmark data (approximate values for the period May 26, 2022 - today)
  // S&P 500 closing price on May 26, 2022
  const sp500Initial = 4057.84
  // Bitcoin closing price on May 26, 2022
  const btcInitial = 29568.1
  // Nasdaq Composite closing price on May 26, 2022
  const nasdaqInitial = 11740.65
  // Gold closing price on May 26, 2022
  const goldInitial = 1851.1

  // States for calculations and UI
  const [kaspaAnnualizedRoi, setKaspaAnnualizedRoi] = useState(0)
  const [sp500Roi, setSp500Roi] = useState(0)
  const [bitcoinRoi, setBitcoinRoi] = useState(0)
  const [nasdaqRoi, setNasdaqRoi] = useState(0)
  const [goldRoi, setGoldRoi] = useState(0)

  // State for hypothetical investment and projections
  const [hypotheticalInvestment, setHypotheticalInvestment] = useState('')
  const [projectedValue1Yr, setProjectedValue1Yr] = useState(0)
  const [projectedValue3Yr, setProjectedValue3Yr] = useState(0)
  const [projectedValue5Yr, setProjectedValue5Yr] = useState(0)

  // UI visibility states
  const [showInvestmentProjection, setShowInvestmentProjection] = useState(false)
  const [showWhatIsKaspa, setShowWhatIsKaspa] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTextForModal, setShareTextForModal] = useState('')
  const [shareScreenshotUrl, setShareScreenshotUrl] = useState(null)

  const kaspaGrowthRef = useRef(null)
  const screenshotRef = useRef(null)

  // Calculate all ROIs on mount (using constants)
  useEffect(() => {
    setKaspaAnnualizedRoi(calculateCAGR(initialKaspaPrice, currentKaspaPrice, historicalYears))
    setSp500Roi(calculateCAGR(sp500Initial, sp500Current, historicalYears))
    setBitcoinRoi(calculateCAGR(btcInitial, btcCurrent, historicalYears))
    setNasdaqRoi(calculateCAGR(nasdaqInitial, nasdaqCurrent, historicalYears))
    setGoldRoi(calculateCAGR(goldInitial, goldCurrent, historicalYears))
  }, [
    initialKaspaPrice,
    currentKaspaPrice,
    historicalYears,
    sp500Initial,
    sp500Current,
    btcInitial,
    btcCurrent,
    nasdaqInitial,
    nasdaqCurrent,
    goldInitial,
    goldCurrent,
  ])

  // Handle hypothetical investment input for 1, 3, and 5-year projections
  const handleInvestmentChange = useCallback(
    (e) => {
      const amount = parseFloat(e.target.value)
      setHypotheticalInvestment(e.target.value)
      if (!isNaN(amount) && amount > 0) {
        // Project forward for 1, 3, and 5 years
        setProjectedValue1Yr(amount * Math.pow(1 + kaspaAnnualizedRoi / 100, 1))
        setProjectedValue3Yr(amount * Math.pow(1 + kaspaAnnualizedRoi / 100, 3))
        setProjectedValue5Yr(amount * Math.pow(1 + kaspaAnnualizedRoi / 100, 5))
      } else {
        setProjectedValue1Yr(0)
        setProjectedValue3Yr(0)
        setProjectedValue5Yr(0)
      }
    },
    [kaspaAnnualizedRoi]
  ) // Depends on kaspaAnnualizedRoi

  // Function to copy text to clipboard
  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = shareTextForModal
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      console.log('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
    document.body.removeChild(textarea)
  }

  // Screenshot handler
  const handleShareScreenshot = async () => {
    if (screenshotRef.current) {
      const canvas = await html2canvas(screenshotRef.current, { backgroundColor: null })
      const imgData = canvas.toDataURL('image/png')
      setShareScreenshotUrl(imgData)
      setShowShareModal(true)
    }
  }

  // Copy image to clipboard (if supported)
  const handleCopyToClipboard = async () => {
    if (!shareScreenshotUrl) return
    try {
      const res = await fetch(shareScreenshotUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
      alert('Image copied to clipboard! You can now paste it in X, Discord, WhatsApp Web, etc.')
    } catch (err) {
      alert('Copy to clipboard not supported in this browser.')
    }
  }

  // Share text for platforms
  const shareText = `Kaspa's wild growth 🚀\nAnnualized ROI since inception: ${kaspaAnnualizedRoi.toFixed(
    2
  )}%.\n(From May 26, 2022 to ${formattedToday})\nData: kaspa.page`
  const encodedText = encodeURIComponent(shareText)
  const twitterUrl = `https://x.com/intent/tweet?text=${encodedText}`
  const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedText}`
  const discordUrl = `https://discord.com/channels/@me`

  // Handle Share button click
  const handleShare = () => {
    const shareText = `🚀 Kaspa's Annualized ROI: ${kaspaAnnualizedRoi.toFixed(2)}%! 💎 If invested $${parseFloat(
      hypotheticalInvestment
    ).toLocaleString()} today, it could be worth ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
      projectedValue5Yr
    )} in 5 years (based on historical growth). #Kaspa #Crypto #ROI #BlockDAG\n\nCheck it out here: [Link to your kaspa.page site]` // Placeholder for your site link

    if (navigator.share) {
      navigator
        .share({
          title: 'Kaspa ROI',
          text: shareText,
          url: window.location.href, // Use current page URL or your specific site URL
        })
        .catch(console.error)
    } else {
      setShareTextForModal(shareText)
      setShowShareModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#231F20] to-indigo-900 text-white flex flex-col items-center justify-center p-4 font-inter relative overflow-hidden">
      {/* Background elements for graphic flair */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#70C7BA] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#49EACB] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div
        ref={kaspaGrowthRef}
        className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center max-w-lg w-full border border-[#70C7BA] relative z-10"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-[#49EACB] drop-shadow-lg">Kaspa's Growth</h1>

        <div className="relative mb-8">
          <div className="text-6xl font-bold text-[#70C7BA] drop-shadow-lg">
            {kaspaAnnualizedRoi.toFixed(2)}% {/* Directly display the calculated ROI */}
          </div>
          <p className="text-xl text-gray-400 mt-2">Kaspa Annualized Return</p>
        </div>

        {/* Benchmarks Comparison */}
        <div className="mb-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600">
          <p className="text-lg font-semibold mb-3 text-gray-300">Other Assets (Same Period)</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              placeItems: 'center',
              background: 'rgba(55, 65, 81, 0.7)',
              borderRadius: '0.7rem',
              padding: '1.2rem 0.7rem',
              marginBottom: '1.2rem',
              fontSize: '1rem',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
              <span style={{ color: '#eab308', fontWeight: 600 }}>S&P 500</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{sp500Roi.toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
              <span style={{ color: '#f59e42', fontWeight: 600 }}>Bitcoin</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{bitcoinRoi.toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
              <span style={{ color: '#60a5fa', fontWeight: 600 }}>Nasdaq</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{nasdaqRoi.toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>Gold</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{goldRoi.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* "What if I invested..." Button */}
        <button
          onClick={() => setShowInvestmentProjection(!showInvestmentProjection)}
          className="bg-gray-900 hover:bg-gray-700 text-[#49EACB] font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-1 ring-[#49EACB] mb-6 w-full"
        >
          {showInvestmentProjection ? 'Hide Projection' : 'What if I invested...'}
        </button>

        {/* Investment Projection Section (conditionally rendered) */}
        {showInvestmentProjection && (
          <div className="mb-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 animate-fade-in">
            <label htmlFor="investmentInput" className="block text-gray-300 text-md font-semibold mb-2">
              Invest Amount (USD)
            </label>
            <input
              id="investmentInput"
              type="number"
              placeholder="e.g., 100"
              value={hypotheticalInvestment}
              onChange={handleInvestmentChange}
              className="w-full p-3 text-lg text-gray-900 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#49EACB] transition duration-200"
            />
            {hypotheticalInvestment && !isNaN(parseFloat(hypotheticalInvestment)) && parseFloat(hypotheticalInvestment) > 0 ? (
              <div className="mt-4 text-left">
                <p className="text-xl font-bold text-[#70C7BA] mb-2">
                  In 1 year:{' '}
                  <span className="ml-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projectedValue1Yr)}</span>
                </p>
                <p className="text-xl font-bold text-[#70C7BA] mb-2">
                  In 3 years:{' '}
                  <span className="ml-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projectedValue3Yr)}</span>
                </p>
                <p className="text-xl font-bold text-[#70C7BA]">
                  In 5 years:{' '}
                  <span className="ml-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(projectedValue5Yr)}</span>
                </p>
              </div>
            ) : (
              hypotheticalInvestment &&
              (isNaN(parseFloat(hypotheticalInvestment)) || parseFloat(hypotheticalInvestment) <= 0) && (
                <p className="mt-2 text-red-400 text-sm">Please enter a valid positive number.</p>
              )
            )}
          </div>
        )}

        {/* "What is Kaspa?" Button */}
        <button
          onClick={() => setShowWhatIsKaspa(!showWhatIsKaspa)}
          className="bg-gray-900 hover:bg-gray-700 text-[#49EACB] font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-1 ring-[#49EACB] mb-6 w-full"
        >
          {showWhatIsKaspa ? 'Hide Kaspa Info' : 'What is Kaspa?'}
        </button>

        {/* Kaspa Info Section (conditionally rendered) */}
        {showWhatIsKaspa && (
          <div className="mb-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 animate-fade-in">
            <p className="text-md text-[#B6B6B6] mb-2 font-medium">Kaspa is the fastest, most scalable and decentralized blockchain.</p>
            <p className="text-sm text-[#B6B6B6]">Nerd disclaimer: Kaspa is a PoW, L1 BlockDAG</p>
          </div>
        )}

        {/* Share Button (Screenshot) */}
        <button
          onClick={handleShareScreenshot}
          className="bg-gray-900 hover:bg-gray-700 text-[#49EACB] font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-1 ring-[#49EACB] w-full mt-4"
        >
          Share This (Screenshot)
        </button>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
              <h2 className="text-xl font-bold mb-4 text-[#49EACB]">Share Kaspa's Growth</h2>
              {shareScreenshotUrl && (
                <img src={shareScreenshotUrl} alt="Kaspa Growth Screenshot" className="rounded-lg border border-gray-600 max-w-xs mx-auto mb-4" />
              )}
              <div className="flex flex-col gap-2 mb-4">
                <a
                  href={shareScreenshotUrl}
                  download="kaspa-growth.png"
                  className="bg-gray-900 hover:bg-gray-700 text-[#49EACB] font-bold py-2 px-4 rounded-md"
                >
                  Download Image
                </a>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Share on X
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Share on WhatsApp
                </a>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
                >
                  Share on Discord
                </a>
              </div>

              <button onClick={() => setShowShareModal(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
                Close
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p className="text-sm text-gray-300 mb-2">Annualized ROI since inception (May 26, 2022 - {formattedToday})</p>
        </div>
      </div>

      {/* Sponsor Opportunities Box */}
      <div className="mt-8 p-6 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-xl shadow-2xl text-center max-w-lg w-full border border-[#70C7BA] relative z-10">
        <h2 className="text-xl font-semibold mb-6 text-[#49EACB]">Want to have your sponsor here?</h2>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=rudy@digitalclay.xyz&su=Sponsor%20Opportunity%20on%20Kaspa.page"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 mb-6 bg-gray-900 hover:bg-gray-700 text-[#49EACB] font-bold py-2 px-5 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-1 ring-[#49EACB]"
        >
          Contact us
        </a>
      </div>

      {/* Hidden screenshot-only card */}
      <div
        ref={screenshotRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '420px',
          background: 'rgba(31, 41, 55, 0.97)',
          borderRadius: '1rem',
          padding: '2rem',
          color: 'white',
          fontFamily: 'inherit',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <h1
          style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            color: '#49EACB',
            textShadow: '0 2px 8px #0008',
            textAlign: 'center',
          }}
        >
          Kaspa's Growth
        </h1>
        <div
          style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#70C7BA',
            marginBottom: '0.5rem',
            textShadow: '0 2px 8px #0008',
            textAlign: 'center',
          }}
        >
          {kaspaAnnualizedRoi.toFixed(2)}%
        </div>
        <div style={{ fontSize: '1.1rem', color: '#B6B6B6', marginBottom: '1.2rem', textAlign: 'center' }}>Kaspa Annualized Return</div>
        {/* Comparison assets */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            placeItems: 'center',
            background: 'rgba(55, 65, 81, 0.7)',
            borderRadius: '0.7rem',
            padding: '1.2rem 0.7rem',
            marginBottom: '1.2rem',
            fontSize: '1rem',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
            <span style={{ color: '#eab308', fontWeight: 600 }}>S&P 500</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{sp500Roi.toFixed(2)}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
            <span style={{ color: '#f59e42', fontWeight: 600 }}>Bitcoin</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{bitcoinRoi.toFixed(2)}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>Nasdaq</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{nasdaqRoi.toFixed(2)}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%' }}>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Gold</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{goldRoi.toFixed(2)}%</span>
          </div>
        </div>
        <div style={{ fontSize: '1rem', color: '#ccc', marginBottom: '1.7rem', textAlign: 'center' }}>Period: May 26, 2022 to {formattedToday}</div>
        <div style={{ fontSize: '1rem', color: '#49EACB', fontWeight: 700, letterSpacing: '0.1em', marginTop: '1.5rem', textAlign: 'right' }}>
          kaspa.page
        </div>
      </div>

      {/* Footer: Coded by @3drudy */}
      <footer className="w-full flex justify-center items-center mt-8 mb-2">
        <a
          href="https://x.com/3drudy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-base font-medium tracking-wide drop-shadow-sm flex items-center gap-1 hover:text-[#70C7BA] transition-colors duration-200"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
        >
          Coded with ❤️ by <span className="font-bold ml-1">@3drudy</span>
        </a>
      </footer>
    </div>
  )
}

export default App
