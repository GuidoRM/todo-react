import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ErrorPage = () => {
  const { isAuthenticated } = useAuth();

  // Redirige al login si el usuario no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>Not Found</p>
    </div>
  );
};

export default ErrorPage;
