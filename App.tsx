
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Snowflake, 
  Wind, 
  Droplets, 
  Navigation, 
  HeartPulse, 
  Quote, 
  RefreshCw,
  MapPin,
  Sparkles,
  X,
  Calendar,
  History,
  ShieldAlert,
  Download,
  ExternalLink,
  Activity
} from 'lucide-react';
import { fetchPenjwenWeather } from './services/geminiService';
import { WeatherData, DayForecast } from './types';

const WeatherIcon = ({ name, size = 24, className = "", animate = false }: { name: string, size?: number, className?: string, animate?: boolean }) => {
  const n = name.toLowerCase();
  const sunAnim = animate ? "animate-[spin_12s_linear_infinite]" : "";
  const cloudAnim = animate ? "animate-[bounce_6s_ease-in-out_infinite]" : "";
  const rainAnim = animate ? "animate-[pulse_1.5s_ease-in-out_infinite]" : "";
  const snowAnim = animate ? "animate-[spin_10s_linear_infinite] opacity-90" : "";

  if (n.includes('rain')) return <CloudRain size={size} className={`text-blue-400 ${className} ${rainAnim}`} />;
  if (n.includes('snow') || n.includes('snowflake')) return <Snowflake size={size} className={`text-sky-100 ${className} ${snowAnim}`} />;
  if (n.includes('cloud')) return <Cloud size={size} className={`text-slate-300 ${className} ${cloudAnim}`} />;
  if (n.includes('sun')) return <Sun size={size} className={`text-yellow-400 ${className} ${sunAnim}`} />;
  
  return <Sun size={size} className={`text-yellow-400 ${className} ${sunAnim}`} />;
};

const InfoCard = ({ icon: Icon, title, content, colorClass }: { icon: any, title: string, content: string, colorClass: string }) => (
  <div className={`bg-slate-800/60 border border-white/5 p-6 rounded-[2rem] flex flex-col h-full shadow-lg transition-colors hover:bg-slate-800/80`}>
    <div className={`flex items-center gap-3 mb-4 ${colorClass}`}>
      <Icon size={22} />
      <h3 className="text-md font-black">{title}</h3>
    </div>
    <p className="text-sm font-bold text-slate-200 leading-relaxed">
      {content}
    </p>
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayForecast | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const updateWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await fetchPenjwenWeather();
      setData(weatherData);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError("ببوورە، کێشەیەک لە وەرگرتنی زانیارییەکان هەیە.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateWeather();
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isStandalone) {
      setTimeout(() => setShowInstallGuide(true), 3000);
    }

    const interval = setInterval(() => {
      updateWeather();
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [updateWeather]);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const toggleDay = (day: DayForecast) => {
    if (selectedDay?.date === day.date) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-[#0f172a]">
        <RefreshCw className="animate-spin text-blue-500" size={48} />
        <div className="text-center px-6">
          <p className="text-xl font-bold text-white">پێنجوێنی سەربەرز</p>
          <p className="text-slate-400 font-bold animate-pulse text-sm mt-2">خەریکی نوێکردنەوەی زانیارییەکانین...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-40 relative min-h-screen">
      {/* iOS Install Guide */}
      {showInstallGuide && (
        <div className="fixed top-4 left-4 right-4 z-[200] bg-blue-700 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 flex items-center justify-between border border-white/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Download size={20} className="text-white" />
            <p className="text-sm font-bold text-white">بۆ داگرتن: کلیک لە Share و پاشان 'Add to Home Screen' بکە</p>
          </div>
          <button onClick={() => setShowInstallGuide(false)} className="text-white/60"><X size={20} /></button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2 text-white">
            <MapPin className="text-red-600" size={28} fill="currentColor" />
            جەوی پێنجوێن
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-1">{data?.currentDate}</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {deferredPrompt && (
            <button 
              onClick={installApp}
              className="flex-1 md:flex-none bg-emerald-600 p-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-black text-xs active:scale-95"
            >
              <Download size={16} /> داگرتن
            </button>
          )}
          <button 
            onClick={updateWeather}
            className="flex-1 md:flex-none bg-blue-600 p-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-black text-xs active:scale-95"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> نوێکردنەوە
          </button>
        </div>
      </header>

      {data && (
        <div className="space-y-10">
          {/* Main Display */}
          <div className="bg-gradient-to-br from-blue-700 to-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-right">
                <div className="text-5xl md:text-6xl font-black text-white">
                  {data.currentTemp}°
                </div>
                <p className="text-xl md:text-2xl font-bold text-white/90 mt-2">{data.currentCondition}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                  <Droplets className="mx-auto mb-1 text-blue-300" size={18} />
                  <p className="text-[10px] text-white/60 font-bold">شێ</p>
                  <p className="text-md font-black">{data.humidity}%</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-center">
                  <Wind className="mx-auto mb-1 text-emerald-300" size={18} />
                  <p className="text-[10px] text-white/60 font-bold">با</p>
                  <p className="text-md font-black">{data.windSpeed} کلم</p>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast List */}
          <section>
            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2 px-1">
              <Calendar size={20} className="text-blue-500" /> پێشبینی ١٠ ڕۆژە
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-4 px-1 custom-scrollbar">
              {data.forecast.map((day, idx) => (
                <button 
                  key={idx} 
                  onClick={() => toggleDay(day)}
                  className={`flex-shrink-0 p-5 rounded-2xl w-36 text-center transition-all border-2 active:scale-95 ${
                    selectedDay?.date === day.date 
                    ? 'bg-blue-600 border-white/30 shadow-lg' 
                    : 'bg-slate-800/60 border-transparent'
                  }`}
                >
                  <p className="font-bold text-xs mb-1">{day.day}</p>
                  <p className="text-[10px] opacity-50 mb-3">{day.date}</p>
                  <WeatherIcon name={day.icon} size={28} className="mx-auto mb-3" />
                  <p className="text-lg font-black">{day.tempHigh}°</p>
                  <p className="text-xs opacity-50">{day.tempLow}°</p>
                </button>
              ))}
            </div>
          </section>

          {/* Info Cards Grid - Unified Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard 
              icon={Navigation} 
              title="ڕێگاوبانی سەیرانبەن و هاتوچۆ" 
              content={data.roadStatus} 
              colorClass="text-orange-400"
            />
            <InfoCard 
              icon={HeartPulse} 
              title="ڕێنمایی تەندروستی گشتی" 
              content={data.healthAdvice} 
              colorClass="text-emerald-400"
            />
            <InfoCard 
              icon={History} 
              title="مێژووی پێنجوێن" 
              content={data.penjwenIdentity.etymology} 
              colorClass="text-blue-400"
            />
            <InfoCard 
              icon={Activity} 
              title="بەهێزترین بوومەلەرزە" 
              content={`بەهێزترین بوومەلەرزە کە لە قەزاکە تۆمار کرابێت، گوڕەکەی ${data.strongestEarthquake.magnitude} پلە بووە لە ڕێکەوتی ${data.strongestEarthquake.date}.`} 
              colorClass="text-red-400"
            />
            <InfoCard 
              icon={Quote} 
              title="وتەی هیوا بەخش" 
              content={data.inspirationalQuote} 
              colorClass="text-indigo-400"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center pb-10 space-y-6">
        <div className="bg-slate-900/60 py-6 px-10 rounded-3xl border border-white/5 inline-block mx-auto">
          <p className="text-md font-black text-blue-400">ئەمانە تەنها پێشبینن خوا زاناتر</p>
          <div className="w-12 h-[1px] bg-white/10 mx-auto my-3"></div>
          <p className="text-[10px] font-bold opacity-30 tracking-widest uppercase">دیزاین و گەشەپێدان: ئاراس باقی</p>
        </div>
      </footer>

      {/* Detail Overlay */}
      {selectedDay && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative text-right">
            <button 
              onClick={() => setSelectedDay(null)}
              className="absolute top-6 left-6 p-2 bg-slate-800 rounded-full text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <p className="text-blue-400 font-black mb-1">{selectedDay.day}</p>
              <p className="text-xs opacity-50 mb-4">{selectedDay.date}</p>
              <WeatherIcon name={selectedDay.icon} size={64} className="mx-auto mb-4" />
              <div className="flex justify-center items-center gap-6">
                <div>
                  <p className="text-[10px] font-bold opacity-50">بەرزترین</p>
                  <p className="text-3xl font-black">{selectedDay.tempHigh}°</p>
                </div>
                <div className="w-[1px] h-10 bg-white/10"></div>
                <div>
                  <p className="text-[10px] font-bold opacity-50">نزمترین</p>
                  <p className="text-3xl font-black">{selectedDay.tempLow}°</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 mb-6">
              <p className="text-sm font-bold text-slate-200 leading-relaxed">
                {selectedDay.detailedDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-xl text-center">
                  <Droplets size={16} className="mx-auto mb-1 text-blue-400" />
                  <p className="text-[10px] opacity-50 font-bold">شێ</p>
                  <p className="font-black text-sm">{selectedDay.humidity}%</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl text-center">
                  <Wind size={16} className="mx-auto mb-1 text-emerald-400" />
                  <p className="text-[10px] opacity-50 font-bold">با</p>
                  <p className="font-black text-sm">{selectedDay.windSpeed} کلم</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
