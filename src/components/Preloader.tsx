// src/components/Preloader.tsx
import React, { useEffect, useState } from 'react';
import './componentStyles/Preloader.css';

const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      
      document.body.classList.add('page-loaded');
      
      
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        
        return () => {
          document.body.classList.remove('page-loaded');
        };
      }, 1000);
      
      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="preloader" style={{ 
        display: loading ? 'flex' : 'none',
        opacity: loading ? 1 : 0 
      }}>
        <div className="container">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
        <div className="loading-text">
          <span>D</span>
          <span>e</span>
          <span>l</span>
          <span>i</span>
          <span>c</span>
          <span>i</span>
          <span>o</span>
          <span>u</span>
          <span>s</span>
          <span style={{ marginLeft: '10px' }}>B</span>
          <span>i</span>
          <span>t</span>
          <span>e</span>
          <span>s</span>
        </div>
      </div>
      
      
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        version="1.1" 
        style={{ 
          position: 'absolute',
          width: 0,
          height: 0,
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" 
              result="goo" 
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default Preloader;