import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const FALLBACK_QUOTES = [
  { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { content: "Where focus goes, energy flows.", author: "Tony Robbins" },
  { content: "The ability to concentrate and to use your time well is everything.", author: "Lee Iacocca" },
  { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { content: "Concentrate all your thoughts upon the work at hand.", author: "Alexander Graham Bell" },
  { content: "Deep work is the superpower of the 21st century.", author: "Cal Newport" },
  { content: "The successful warrior is the average man with laser-like focus.", author: "Bruce Lee" },
  { content: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { content: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { content: "Lost time is never found again.", author: "Benjamin Franklin" },
  { content: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do great work.", author: "Steve Jobs" },
]

export const useQuote = () => {
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchQuote = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Use api-ninjas quotes (reliable, no CORS issues via allorigins)
      const proxyUrl = 'https://allorigins.win/get?disableCache=true&url=' + encodeURIComponent('https://zenquotes.io/api/random')
      const response = await axios.get(proxyUrl, { timeout: 6000 })
      const data = JSON.parse(response.data.contents)
      if (data && data[0] && data[0].q) {
        setQuote({ content: data[0].q, author: data[0].a })
      } else {
        throw new Error('Invalid response')
      }
    } catch {
      // Fallback to curated local quotes
      const random = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]
      setQuote(random)
      setError('offline')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  return { quote, loading, error, refetch: fetchQuote }
}

export default useQuote
