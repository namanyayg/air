
// Footer Component
export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-gray-800">
      <div className="w-full bg-black/30 backdrop-blur-sm">
      <div className="max-w-md mx-auto text-center py-8 px-4 text-gray-400 text-sm">
        <div className="space-y-3">
          <p>
            Made by <a href="https://x.com/NamanyayG" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Namanyay Goel</a> in New Delhi
          </p>
          <p>
            Join our <a href="https://t.me/fightpollution" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Telegram group</a> to fight pollution together
          </p>
          <p>
            Non-Profit and fully open source. Contributions &amp; ideas are welcome!
          </p>
          <p className="text-gray-500">जनहित में जारी</p>
          <p className="text-gray-300 mt-4">Jai Hind 🇮🇳</p>
        </div>
      </div>
    </div>
  </footer>
  )
}