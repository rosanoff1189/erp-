import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Archivo from './components/Archivo/Archivo';
import Catalogos from './components/Catalogos/Catalogos';
import Inventario from './components/Inventario/Inventario';
import Ventas from './components/Ventas/Ventas';
import Compras from './components/Compras/Compras';
import Configuracion from './components/Configuracion/Configuracion';
import Utilidades from './components/Utilidades/Utilidades';
import CorteOptimizado from './components/CorteOptimizado/CorteOptimizado';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';

function AppContent() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'archivo':
        return <Archivo />;
      case 'catalogos':
        return <Catalogos />;
      case 'inventario':
        return <Inventario />;
      case 'ventas':
        return <Ventas />;
      case 'compras':
        return <Compras />;
      case 'configuracion':
        return <Configuracion />;
      case 'utilidades':
        return <Utilidades />;
      case 'corte-optimizado':
        return <CorteOptimizado />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;