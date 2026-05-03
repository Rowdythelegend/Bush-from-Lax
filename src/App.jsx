import { useState, useEffect } from 'react'
import { 
  Settings, 
  Info, 
  Terminal, 
  User, 
  Send, 
  Download, 
  RefreshCw, 
  Scissors,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const App = () => {
  const [activeTab, setActiveTab] = useState('desk')
  const [status, setStatus] = useState('System: Online')
  const [order, setOrder] = useState({
    type: 'download',
    target: '',
    format: 'mp3',
    quality: 'best'
  })

  const sendOrder = () => {
    setStatus(`Dispatching: ${order.type.toUpperCase()}...`)
    
    // Construct the intent URL for Termux:Tasker
    const intentUrl = `intent://#Intent;action=com.termux.tasker.ACTION_EXECUTE;S.com.termux.tasker.extra.EXECUTABLE=bush_handler.sh;S.com.termux.tasker.extra.ARGUMENTS=${order.type}%20${encodeURIComponent(order.target)}%20${order.format}%20${order.quality};end`
    
    window.location.href = intentUrl
    
    setTimeout(() => {
      setStatus('Order confirmed by Factory.')
    }, 2000)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'desk':
        return <OrderDesk order={order} setOrder={setOrder} onSend={sendOrder} />
      case 'settings':
        return <SettingsPage />
      case 'about':
        return <AboutPage />
      case 'dev':
        return <DeveloperPage />
      default:
        return <OrderDesk order={order} setOrder={setOrder} onSend={sendOrder} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="pt-8 pb-4 px-6 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-900">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              BUSH FROM LAX
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Front Office Interface</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-blue-400/80 uppercase">{status}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 px-4 pt-3 pb-8 flex justify-around items-center z-20">
        <NavButton active={activeTab === 'desk'} onClick={() => setActiveTab('desk')} icon={Terminal} label="Desk" />
        <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Config" />
        <NavButton active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={Info} label="Info" />
        <NavButton active={activeTab === 'dev'} onClick={() => setActiveTab('dev')} icon={User} label="Dev" />
      </nav>
    </div>
  )
}

const NavButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all duration-300 relative group",
      active ? "text-blue-400 scale-110" : "text-slate-500 hover:text-slate-300"
    )}
  >
    <div className={cn(
      "p-2 rounded-xl transition-all",
      active ? "bg-blue-500/10" : "group-hover:bg-slate-800"
    )}>
      <Icon size={20} />
    </div>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && (
      <motion.div 
        layoutId="nav-glow"
        className="absolute -bottom-2 w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"
      />
    )}
  </button>
)

const OrderDesk = ({ order, setOrder, onSend }) => (
  <div className="space-y-6">
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
          <Terminal size={16} />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Command Sequence</h2>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <TypeButton 
          active={order.type === 'download'} 
          onClick={() => setOrder({...order, type: 'download'})}
          icon={Download}
          label="Download"
        />
        <TypeButton 
          active={order.type === 'convert'} 
          onClick={() => setOrder({...order, type: 'convert'})}
          icon={RefreshCw}
          label="Convert"
        />
        <TypeButton 
          active={order.type === 'split'} 
          onClick={() => setOrder({...order, type: 'split'})}
          icon={Scissors}
          label="Split"
        />
      </div>
    </section>

    <section className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Target Resource</label>
        <div className="relative group">
          <input 
            type="text" 
            value={order.target}
            onChange={(e) => setOrder({...order, target: e.target.value})}
            placeholder="URL or Filesystem Path..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm placeholder:text-slate-700"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500/50">
            <Send size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Output Format</label>
          <select 
            value={order.format}
            onChange={(e) => setOrder({...order, format: e.target.value})}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-5 focus:outline-none text-sm appearance-none"
          >
            <option value="mp3">Audio (MP3)</option>
            <option value="mp4">Video (MP4)</option>
            <option value="wav">Lossless (WAV)</option>
            <option value="flac">Studio (FLAC)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Quality Tier</label>
          <select 
            value={order.quality}
            onChange={(e) => setOrder({...order, quality: e.target.value})}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 px-5 focus:outline-none text-sm appearance-none"
          >
            <option value="best">High Definition</option>
            <option value="good">Balanced</option>
            <option value="worst">Low Bandwidth</option>
          </select>
        </div>
      </div>
    </section>

    <button 
      onClick={onSend}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all mt-4 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2"
    >
      <Send size={18} />
      Dispatch to Factory
    </button>
  </div>
)

const TypeButton = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
      active 
        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20" 
        : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
    )}
  >
    <Icon size={20} />
    <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
  </button>
)

const SettingsPage = () => (
  <div className="space-y-8">
    <div className="space-y-1">
      <h2 className="text-xl font-bold">System Configuration</h2>
      <p className="text-sm text-slate-500">Fine-tune your Front Office behavior.</p>
    </div>

    <div className="space-y-4">
      <SettingToggle label="Auto-detect Shared Links" active={true} />
      <SettingToggle label="Instant Factory Dispatch" active={false} />
      <SettingToggle label="Show Factory Logs" active={true} />
      <SettingToggle label="Biometric Authentication" active={false} />
      
      <div className="pt-4">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Factory Endpoint</label>
        <div className="mt-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex justify-between items-center">
          <span className="text-sm font-mono text-slate-400">com.termux.tasker</span>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Active</span>
        </div>
      </div>
    </div>
  </div>
)

const SettingToggle = ({ label, active }) => (
  <div className="flex justify-between items-center p-4 bg-slate-900/50 border border-slate-900 rounded-2xl">
    <span className="text-sm font-medium text-slate-300">{label}</span>
    <div className={cn(
      "w-10 h-6 rounded-full relative transition-all duration-300 cursor-pointer",
      active ? "bg-blue-600" : "bg-slate-800"
    )}>
      <div className={cn(
        "w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300",
        active ? "left-5" : "left-1"
      )} />
    </div>
  </div>
)

const AboutPage = () => (
  <div className="space-y-8">
    <div className="space-y-4 text-center">
      <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-900/20">
        <Download size={40} className="text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tighter">Bush from Lax</h2>
        <p className="text-sm text-blue-400 font-bold uppercase tracking-widest">v1.0.0 Alpha</p>
      </div>
    </div>

    <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Mission Statement</h3>
      <p className="text-sm text-slate-300 leading-relaxed">
        Bush from Lax is a specialized bridge between high-level web interfaces and deep system-level automation. 
        It serves as the <span className="text-blue-400">Front Office</span> for your local factory.
      </p>
      <div className="flex items-center gap-4 pt-2">
        <div className="flex-1 h-px bg-slate-800" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        <div className="flex-1 h-px bg-slate-800" />
      </div>
      <p className="text-[10px] text-slate-500 italic text-center uppercase tracking-widest">
        Powered by BambanaTech Automations
      </p>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <StatusCard icon={CheckCircle2} label="Factory" value="Stable" color="text-green-500" />
      <StatusCard icon={AlertCircle} label="Network" value="Encrypted" color="text-blue-500" />
    </div>
  </div>
)

const StatusCard = ({ icon: Icon, label, value, color }) => (
  <div className="p-4 bg-slate-900/50 border border-slate-900 rounded-2xl flex flex-col items-center gap-1 text-center">
    <Icon size={16} className={color} />
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-bold">{value}</span>
  </div>
)

const DeveloperPage = () => (
  <div className="space-y-8">
    <div className="relative">
      <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl" />
      <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-slate-950 bg-slate-800 overflow-hidden shadow-2xl">
        {/* Placeholder for Dev Image */}
        <div className="w-full h-full flex items-center justify-center text-blue-400">
          <User size={40} />
        </div>
      </div>
    </div>

    <div className="pt-4 px-2 space-y-4">
      <div>
        <h2 className="text-2xl font-black tracking-tighter">Ndumiso</h2>
        <p className="text-sm text-slate-400 italic">The Clairvoyant</p>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-4">
          "Bridging the gap between developing and developed countries through the power of context and automation."
        </p>

        <div className="grid grid-cols-1 gap-4">
          <DevLink icon={Terminal} label="GitHub" value="@BambanaTech" />
          <DevLink icon={Info} label="Portfolio" value="clairvoyant.vision" />
          <DevLink icon={User} label="Contact" value="ndumiso@bambana.tech" />
        </div>
      </div>
    </div>
  </div>
)

const DevLink = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-900 rounded-2xl group active:bg-blue-600/10 transition-colors">
    <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
      <Icon size={18} />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-slate-200">{value}</span>
    </div>
  </div>
)

export default App
