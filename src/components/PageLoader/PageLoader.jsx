import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__spinner"></div>
      <p className="page-loader__text">Memuat Halaman...</p>
    </div>
  );
}
