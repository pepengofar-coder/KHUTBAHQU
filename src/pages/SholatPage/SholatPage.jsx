import { useState, useEffect, useCallback, useRef } from 'react';
import { useSEO } from '../../utils/seo';
import './SholatPage.css';

const CITIES=[{name:'Jakarta',lat:-6.2088,lon:106.8456},{name:'Surabaya',lat:-7.2575,lon:112.7521},{name:'Bandung',lat:-6.9175,lon:107.6191},{name:'Medan',lat:3.5952,lon:98.6722},{name:'Semarang',lat:-6.9667,lon:110.4167},{name:'Makassar',lat:-5.1477,lon:119.4327},{name:'Yogyakarta',lat:-7.7956,lon:110.3695},{name:'Malang',lat:-7.9666,lon:112.6326},{name:'Denpasar',lat:-8.6705,lon:115.2126},{name:'Aceh',lat:5.5483,lon:95.3238},{name:'Padang',lat:-0.9492,lon:100.3543},{name:'Pekanbaru',lat:0.5335,lon:101.45},{name:'Palembang',lat:-2.9761,lon:104.7754},{name:'Bogor',lat:-6.5971,lon:106.806},{name:'Bekasi',lat:-6.2349,lon:106.9896},{name:'Tangerang',lat:-6.1783,lon:106.63},{name:'Depok',lat:-6.4025,lon:106.7942},{name:'Banjarmasin',lat:-3.3194,lon:114.5908},{name:'Balikpapan',lat:-1.2676,lon:116.8289},{name:'Manado',lat:1.4748,lon:124.8421}];
const PRAYERS=[{key:'Fajr',label:'Subuh',icon:'🌙',desc:'Fajar'},{key:'Sunrise',label:'Syuruq',icon:'🌅',desc:'Matahari Terbit'},{key:'Dhuhr',label:'Dzuhur',icon:'☀️',desc:'Tengah Hari'},{key:'Asr',label:'Ashar',icon:'🌤️',desc:'Sore'},{key:'Maghrib',label:'Maghrib',icon:'🌇',desc:'Matahari Terbenam'},{key:'Isha',label:'Isya',icon:'🌃',desc:'Malam'}];
const MAIN_PRAYERS=['Fajr','Dhuhr','Asr','Maghrib','Isha'];

function parseTime(s){if(!s)return null;const[h,m]=s.split(':').map(Number);const d=new Date();d.setHours(h,m,0,0);return d}
function fmt(s){return s?s.substring(0,5):'--:--'}
function getNext(timings){const now=new Date();for(const k of MAIN_PRAYERS){const t=parseTime(timings[k]);if(t&&t>now)return k}return MAIN_PRAYERS[0]}

export default function SholatPage(){
  useSEO({title:'Jadwal Sholat Hari Ini — Waktu Sholat Akurat | Islamediaku',description:'Jadwal waktu sholat hari ini dengan countdown otomatis. Subuh, Dzuhur, Ashar, Maghrib, Isya berdasarkan lokasi Anda.',path:'/sholat'});

  const[mode,setMode]=useState('detecting');
  const[coords,setCoords]=useState(null);
  const[label,setLabel]=useState('');
  const[city,setCity]=useState(()=>localStorage.getItem('kq_prayer_city')||'Jakarta');
  const[timings,setTimings]=useState(null);
  const[loading,setLoading]=useState(true);
  const[now,setNow]=useState(new Date());
  const[countdown,setCountdown]=useState('');
  const iv=useRef(null);

  const tryGPS=useCallback(()=>{
    if(!navigator.geolocation){setMode('manual');return}
    setMode('detecting');
    navigator.geolocation.getCurrentPosition(async p=>{
      const{latitude:lat,longitude:lon}=p.coords;setCoords({lat,lon});
      try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=id`);const d=await r.json();setLabel(d.address?.city||d.address?.town||d.address?.county||'Lokasi Anda')}catch{setLabel('Lokasi Anda')}
      setMode('gps');
    },()=>setMode('manual'),{timeout:8000,maximumAge:300000});
  },[]);

  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    tryGPS()
  },[tryGPS]);

  const fetchTimes=useCallback(async(c)=>{
    setLoading(true);
    try{
      const d=new Date();const url=`https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}?latitude=${c.lat}&longitude=${c.lon}&method=11`;
      const r=await fetch(url);const data=await r.json();setTimings(data.data.timings);
    }catch(err){
      console.warn('Failed to fetch prayer times:', err);
    }finally{setLoading(false)}
  },[]);

  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(mode==='gps'&&coords)fetchTimes(coords);
     
    else if(mode==='manual'||mode==='denied'){const c=CITIES.find(x=>x.name===city)||CITIES[0];fetchTimes(c)}
  },[mode,coords,city,fetchTimes]);

  useEffect(()=>{localStorage.setItem('kq_prayer_city',city)},[city]);
  useEffect(()=>{iv.current=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(iv.current)},[]);

  const nextKey=timings?getNext(timings):null;
  const nextP=PRAYERS.find(p=>p.key===nextKey);

  useEffect(()=>{
    if(!timings||!nextKey)return;
    const t=parseTime(timings[nextKey]);if(!t)return;
    let diff=t-now;if(diff<0)diff+=864e5;
    const h=Math.floor(diff/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
  },[now,timings,nextKey]);

  const locLabel=mode==='gps'?label:mode==='detecting'?'Mendeteksi...':city;

  return(
    <div className="sholat-page container">
      <div className="sholat-page__header">
        <h1 className="sholat-page__title">Jadwal Sholat</h1>
        <p className="sholat-page__date">{now.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>

      {/* Next Prayer Hero */}
      {!loading&&timings&&nextP&&(
        <div className="sholat-hero">
          <div className="sholat-hero__icon">{nextP.icon}</div>
          <div className="sholat-hero__info">
            <span className="sholat-hero__label">Sholat berikutnya</span>
            <span className="sholat-hero__name">{nextP.label}</span>
            <span className="sholat-hero__time">{fmt(timings[nextP.key])}</span>
          </div>
          <div className="sholat-hero__countdown">{countdown}</div>
        </div>
      )}

      {/* Location */}
      <div className="sholat-loc">
        <span className="sholat-loc__pin">📍</span>
        <span className="sholat-loc__label">{locLabel}</span>
        {mode==='gps'&&<span className="sholat-loc__badge">GPS</span>}
        {(mode==='manual'||mode==='denied')&&(
          <select className="sholat-loc__select" value={city} onChange={e=>{setCity(e.target.value);setMode('manual')}}>
            {CITIES.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        )}
        <button className="sholat-loc__btn" onClick={mode==='gps'?()=>setMode('manual'):tryGPS}>{mode==='gps'?'Pilih Kota':'📡 GPS'}</button>
      </div>

      {/* Prayer Grid */}
      {loading?(
        <div className="sholat-loading"><div className="sholat-loading__dots"><span/><span/><span/></div><p>Memuat jadwal...</p></div>
      ):(timings&&(
        <div className="sholat-grid">
          {PRAYERS.map(p=>{
            const isMain=MAIN_PRAYERS.includes(p.key);
            const isNext=p.key===nextKey;
            const t=parseTime(timings[p.key]);
            const past=t&&t<now&&!isNext;
            return(
              <div key={p.key} className={`sholat-card${isNext?' sholat-card--next':''}${past?' sholat-card--past':''}${!isMain?' sholat-card--secondary':''}`}>
                <div className="sholat-card__left">
                  <span className="sholat-card__icon">{p.icon}</span>
                  <div>
                    <span className="sholat-card__name">{p.label}</span>
                    <span className="sholat-card__desc">{p.desc}</span>
                  </div>
                </div>
                <div className="sholat-card__right">
                  <span className="sholat-card__time">{fmt(timings[p.key])}</span>
                  {isNext&&<span className="sholat-card__badge">Berikutnya</span>}
                  {past&&isMain&&<span className="sholat-card__done">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* TODO: Notification placeholder */}
      <div className="sholat-notif-placeholder">
        <span>🔔</span>
        <div>
          <strong>Notifikasi Adzan</strong>
          <p>Fitur notifikasi waktu sholat akan segera hadir.</p>
        </div>
      </div>
    </div>
  );
}
