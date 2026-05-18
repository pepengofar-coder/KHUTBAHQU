import { useState, useEffect, useCallback } from 'react';
import { useSEO } from '../../utils/seo';
import './QiblaPage.css';

const KAABAH={lat:21.4225,lon:39.8262};

function calcBearing(lat1,lon1,lat2,lon2){
  const toR=d=>d*Math.PI/180;
  const dL=toR(lon2-lon1);
  const y=Math.sin(dL)*Math.cos(toR(lat2));
  const x=Math.cos(toR(lat1))*Math.sin(toR(lat2))-Math.sin(toR(lat1))*Math.cos(toR(lat2))*Math.cos(dL);
  return((Math.atan2(y,x)*180/Math.PI)+360)%360;
}

export default function QiblaPage(){
  useSEO({title:'Arah Kiblat — Kompas Kiblat Digital | Islamediaku',description:'Temukan arah kiblat dari lokasi Anda menggunakan kompas digital. Deteksi otomatis menggunakan GPS dan sensor orientasi perangkat.',path:'/kiblat'});

  const[bearing,setBearing]=useState(null);
  const[heading,setHeading]=useState(0);
  const[hasOrientation,setHasOrientation]=useState(false);
  const[permDenied,setPermDenied]=useState(false);
  const[locLabel,setLocLabel]=useState('');
  const[loading,setLoading]=useState(true);

  const getLocation=useCallback(()=>{
    if(!navigator.geolocation){setLoading(false);setBearing(295);return}
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async p=>{
      const{latitude:lat,longitude:lon}=p.coords;
      const b=calcBearing(lat,lon,KAABAH.lat,KAABAH.lon);
      setBearing(b);
      try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=id`);const d=await r.json();setLocLabel(d.address?.city||d.address?.town||'Lokasi Anda')}catch{setLocLabel('Lokasi Anda')}
      setLoading(false);
    },()=>{setBearing(295);setLocLabel('Jakarta (default)');setLoading(false)},{timeout:8000});
  },[]);

  useEffect(()=>{getLocation()},[getLocation]);

  // Device orientation
  useEffect(()=>{
    const handler=e=>{
      const a=e.webkitCompassHeading||e.alpha;
      if(a!=null){setHeading(a);setHasOrientation(true)}
    };
    if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
      // iOS 13+
    }else{
      window.addEventListener('deviceorientation',handler,true);
    }
    return()=>window.removeEventListener('deviceorientation',handler,true);
  },[]);

  const requestOrientation=async()=>{
    if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
      try{
        const p=await DeviceOrientationEvent.requestPermission();
        if(p==='granted'){
          window.addEventListener('deviceorientation',e=>{
            const a=e.webkitCompassHeading||e.alpha;
            if(a!=null){setHeading(a);setHasOrientation(true)}
          },true);
        }else setPermDenied(true);
      }catch{setPermDenied(true)}
    }
  };

  const needleRotation=bearing!=null?(bearing-heading)%360:0;

  return(
    <div className="qibla-page container">
      <div className="qibla-page__header">
        <h1 className="qibla-page__title">Arah Kiblat</h1>
        {locLabel&&<p className="qibla-page__loc">📍 {locLabel}</p>}
        {bearing!=null&&<p className="qibla-page__bearing">{Math.round(bearing)}° dari Utara</p>}
      </div>

      {loading?(
        <div className="qibla-loading"><div className="sholat-loading__dots"><span/><span/><span/></div><p>Mendeteksi lokasi...</p></div>
      ):(
        <div className="qibla-compass">
          <div className="qibla-compass__ring" style={{transform:`rotate(${-heading}deg)`}}>
            <div className="qibla-compass__north">N</div>
            <div className="qibla-compass__east">E</div>
            <div className="qibla-compass__south">S</div>
            <div className="qibla-compass__west">W</div>
            <div className="qibla-compass__needle" style={{transform:`rotate(${needleRotation}deg)`}}>
              <div className="qibla-compass__kaabah">🕋</div>
            </div>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(d=>(
              <div key={d} className="qibla-compass__tick" style={{transform:`rotate(${d}deg)`}}/>
            ))}
          </div>
          <div className="qibla-compass__center-dot"/>
        </div>
      )}

      {!hasOrientation&&!permDenied&&bearing!=null&&(
        <div className="qibla-fallback">
          <button className="btn btn--primary" onClick={requestOrientation}>🧭 Aktifkan Kompas</button>
          <p>Jika sensor tidak tersedia, arahkan perangkat Anda ke <strong>{Math.round(bearing)}°</strong> dari Utara.</p>
        </div>
      )}
      {permDenied&&(
        <div className="qibla-fallback">
          <p>⚠️ Izin sensor orientasi ditolak. Arah kiblat dari lokasi Anda: <strong>{bearing!=null?Math.round(bearing):295}°</strong> dari Utara.</p>
        </div>
      )}

      <div className="qibla-info">
        <div className="qibla-info__card">
          <span>🕋</span>
          <div>
            <strong>Ka'bah, Makkah</strong>
            <p>Lat: {KAABAH.lat}°N, Lon: {KAABAH.lon}°E</p>
          </div>
        </div>
        <p className="qibla-info__note">Pastikan tidak ada magnet atau logam di dekat perangkat untuk akurasi kompas yang lebih baik.</p>
      </div>
    </div>
  );
}
