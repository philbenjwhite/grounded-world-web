'use client';

import { useState } from 'react';
import ServiceHeroNav from '@/components/components/ServiceHeroNav';
import ServiceHeroNavConceptC from '@/components/components/ServiceHeroNav/ServiceHeroNavConceptC';
import { ArrowsClockwise } from '@phosphor-icons/react';

export default function TestNavPage() {
  const [variant, setVariant] = useState<'default' | 'conceptc'>('default');

  const toggleVariant = () => {
    setVariant(prev => prev === 'default' ? 'conceptc' : 'default');
  };

  return (
    <div className="relative w-full h-screen">
      {/* Render the selected variant */}
      {variant === 'default' ? <ServiceHeroNav /> : <ServiceHeroNavConceptC />}

      {/* Toggle Button - Bottom Right */}
      <button
        onClick={toggleVariant}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105"
        style={{
          textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
        }}
      >
        <ArrowsClockwise size={18} weight="bold" />
        <span className="text-sm">
          {variant === 'default' ? 'Concept C' : 'Default'}
        </span>
      </button>
    </div>
  );
}