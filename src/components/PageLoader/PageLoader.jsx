import './PageLoader.css';

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__dots">
        <span className="page-loader__dot" />
        <span className="page-loader__dot" />
        <span className="page-loader__dot" />
      </div>
      <p className="page-loader__text">Memuat Halaman...</p>
    </div>
  );
}
