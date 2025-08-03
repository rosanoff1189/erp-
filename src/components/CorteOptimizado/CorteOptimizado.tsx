import React, { useState } from 'react';
import { Scissors } from 'lucide-react';
import OptimizadorCorte from './OptimizadorCorte';

const CorteOptimizado: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Corte Optimizado</h2>
        <p className="text-gray-600">Optimización de cortes para aluminio, vidrio y acero con algoritmos avanzados</p>
      </div>

      <OptimizadorCorte />
    </div>
  );
};

export default CorteOptimizado;