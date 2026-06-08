import React from 'react';

class SafarErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SafarErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="safar-section-error-fallback" 
          style={{ 
            padding: '24px', 
            textAlign: 'center', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px dashed rgba(255, 255, 255, 0.1)', 
            borderRadius: '16px', 
            color: 'rgba(255, 255, 255, 0.6)', 
            margin: '16px 0',
            fontSize: '14px'
          }}
        >
          Fitur ini sedang dimuat atau sementara tidak tersedia.
        </div>
      );
    }
    return this.props.children;
  }
}

export default SafarErrorBoundary;
