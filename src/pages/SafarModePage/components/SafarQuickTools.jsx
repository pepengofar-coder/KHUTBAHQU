import { Compass, Clock, BookOpen, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SafarQuickTools() {
  const navigate = useNavigate();

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const tools = [
    {
      label: 'Qibla Direction',
      icon: Compass,
      action: () => navigate('/kiblat'),
    },
    {
      label: 'Prayer Reminder',
      icon: Clock,
      action: () => navigate('/sholat'),
    },
    {
      label: 'Travel Du’a',
      icon: BookOpen,
      action: () => handleScroll('duas'),
    },
    {
      label: 'Travel Audio',
      icon: Headphones,
      action: () => handleScroll('audio'),
    },
  ];

  return (
    <div className="safar-quick-tools-wrap">
      <div className="safar-quick-tools">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <button
              key={idx}
              onClick={tool.action}
              className="safar-quick-tools__item"
              title={tool.label}
              aria-label={tool.label}
            >
              <div className="safar-quick-tools__icon-wrap">
                <Icon size={18} />
              </div>
              <span className="safar-quick-tools__label">{tool.label.split(' ')[1] || tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
