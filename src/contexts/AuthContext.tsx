import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  sucursal: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simular usuario logueado para demo
    const demoUser: User = {
      id: 1,
      name: 'Administrador',
      email: 'admin@empresa.com',
      role: 'admin',
      permissions: ['all'],
      sucursal: 'Matriz'
    };
    setUser(demoUser);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de login - aquí iría la lógica real de autenticación
    if (email === 'admin@empresa.com' && password === 'admin123') {
      const user: User = {
        id: 1,
        name: 'Administrador',
        email: 'admin@empresa.com',
        role: 'admin',
        permissions: ['all'],
        sucursal: 'Matriz'
      };
      setUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('all') || user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};