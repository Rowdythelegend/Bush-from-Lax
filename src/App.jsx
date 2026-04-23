import { useState, useEffect } from 'react'

function App() {
  const [order, setOrder] = useState({
    type: 'download',
    target: '',
    format: 'mp3',
    quality: 'best'
  });

  const [status, setStatus] = useState('Front Office: Ready for Orders');

  // Placeholder for Share Intent Capture
  useEffect(() => {
    // In a real build, we would use a Capacitor plugin to listen for shared text
    console.log("Listening for orders...");
  }, []);

  const sendOrder = () => {
    setStatus(`Dispatching order to Factory: ${order.type}...`);
    
    // Construct the command for Termux
    const command = `bush_handler.sh ${order.type} "${order.target}" ${order.format} ${order.quality}`;
    
    // This intent deep-link triggers Termux:Tasker
    // We use a generic intent string that Termux:Tasker listens for
    const intentUrl = `intent://#Intent;action=com.termux.tasker.ACTION_EXECUTE;S.com.termux.tasker.extra.EXECUTABLE=bush_handler.sh;S.com.termux.tasker.extra.ARGUMENTS=${order.type}%20${encodeURIComponent(order.target)}%20${order.format}%20${order.quality};end`;
    
    window.location.href = intentUrl;
    
    setTimeout(() => {
      setStatus('Order sent! Factory is processing in the back.');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-blue-500 tracking-tighter">BUSH FROM LAX</h1>
        <p className="text-slate-400 text-sm uppercase tracking-widest">The Front Office</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Order Type</label>
          <div className="grid grid-cols-3 gap-2">
            {['download', 'convert', 'split'].map(t => (
              <button 
                key={t}
                onClick={() => setOrder({...order, type: t})}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${order.type === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Target (URL or Path)</label>
          <input 
            type="text" 
            value={order.target}
            onChange={(e) => setOrder({...order, target: e.target.value})}
            placeholder="Paste YouTube link or file path..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Format</label>
            <select 
              value={order.format}
              onChange={(e) => setOrder({...order, format: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none text-sm appearance-none"
            >
              <option value="mp3">MP3 (Audio)</option>
              <option value="mp4">MP4 (Video)</option>
              <option value="wav">WAV (Lossless)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Quality</label>
            <select 
              value={order.quality}
              onChange={(e) => setOrder({...order, quality: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 focus:outline-none text-sm appearance-none"
            >
              <option value="best">Best Quality</option>
              <option value="worst">Data Saver</option>
            </select>
          </div>
        </div>

        <button 
          onClick={sendOrder}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-xl transform active:scale-95 transition-all mt-4 uppercase tracking-wider"
        >
          Send to Factory
        </button>
      </div>

      <footer className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl text-center">
        <p className="text-xs font-mono text-blue-400">{status}</p>
      </footer>
    </div>
  )
}

export default App
