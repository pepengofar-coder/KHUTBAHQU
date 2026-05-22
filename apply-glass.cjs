const fs = require('fs');

function update(path, replaces) {
  if (!fs.existsSync(path)) return console.log('Not found: ' + path);
  let content = fs.readFileSync(path, 'utf8');
  for (const [r, repl] of replaces) {
    content = content.replace(r, repl);
  }
  fs.writeFileSync(path, content);
  console.log('Updated ' + path);
}

update('src/pages/TasbihPage/TasbihPage.jsx', [
  [/className="tasbih-presets"/g, 'className="tasbih-presets glass-panel" style={{ padding: "var(--sp-4)", borderRadius: "var(--radius-xl)" }}'],
  [/className={`tasbih-tap\$\{pulse \? ' pulse' : ''\}\$\{completed \? ' done' : ''\}`}/g, 'className={`tasbih-tap glass-action${pulse ? \' pulse\' : \'\'}${completed ? \' done\' : \'\'}`}'],
  [/className="tasbih-ctrl"/g, 'className="tasbih-ctrl glass-action"'],
  [/className="tasbih-ctrl tasbih-ctrl--reset"/g, 'className="tasbih-ctrl tasbih-ctrl--reset glass-action"']
]);

update('src/pages/TrackerPage/TrackerPage.jsx', [
  [/className="tracker-summary"/g, 'className="tracker-summary glass-card"'],
  [/className="tracker-section"/g, 'className="tracker-section glass-card" style={{ padding: "var(--sp-4)" }}']
]);

update('src/pages/RuangSayaPage/RuangSayaPage.jsx', [
  [/className="ruang-hero"/g, 'className="ruang-hero glass-card"'],
  [/className="ruang-card"/g, 'className="ruang-card glass-card"'],
  [/className="ruang-mushaf"/g, 'className="ruang-mushaf glass-card"']
]);

update('src/pages/TravelModePage/TravelModePage.jsx', [
  [/className="safar-card"/g, 'className="safar-card glass-dark"'],
  [/className="safar-controls"/g, 'className="safar-controls glass-dark"'],
  [/className="safar-list"/g, 'className="safar-list glass-dark"']
]);

update('src/pages/HijriCalendarPage/HijriCalendarPage.jsx', [
  [/className="hijri-hero"/g, 'className="hijri-hero glass-card"'],
  [/className="hijri-events"/g, 'className="hijri-events glass-card"'],
  [/className="hijri-countdown"/g, 'className="hijri-countdown glass-card"']
]);

update('src/pages/QiblaPage/QiblaPage.jsx', [
  [/className="qibla-card"/g, 'className="qibla-card glass-card"'],
  [/className="qibla-info"/g, 'className="qibla-info glass-card"']
]);

update('src/pages/SholatPage/SholatPage.jsx', [
  [/className="sholat-hero"/g, 'className="sholat-hero glass-card"'],
  [/className="sholat-prayer"/g, 'className="sholat-prayer glass-row"'],
  [/className="sholat-card"/g, 'className="sholat-card glass-card"']
]);

update('src/pages/DoaDzikirPage/DoaDzikirPage.jsx', [
  [/className="doa-category"/g, 'className="doa-category glass-card"'],
  [/className="doa-card"/g, 'className="doa-card glass-reading"']
]);

update('src/pages/CatalogPage/CatalogPage.jsx', [
  [/className="catalog-filters"/g, 'className="catalog-filters glass-card"'],
  [/className="catalog-khutbah"/g, 'className="catalog-khutbah glass-card"']
]);

