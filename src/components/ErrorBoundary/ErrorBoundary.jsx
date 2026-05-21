import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif', marginTop: '20vh' }}>
          <h2>Terjadi kendala saat memuat Islamediaku.</h2>
          <p style={{ opacity: 0.7, marginBottom: '1.5rem' }}>Silakan muat ulang halaman untuk mencoba lagi.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: 'var(--color-primary, #054f7d)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Muat Ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
