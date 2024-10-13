import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = (token) => {
    // Guarda el token, por ejemplo, en localStorage
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);

    // Decodificar el token para obtener el userId
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.userId); // Asegúrate de que el campo del token contenga "userId"
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserId(null);
  };

  useEffect(() => {
    // Al montar el componente, verifica si ya existe un token en localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        localStorage.setItem("userId",decodedToken.userId )
        setUserId(decodedToken.userId);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token', error);
        logout();
      }
    }
  }, []);

  const value = {
    isAuthenticated,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
