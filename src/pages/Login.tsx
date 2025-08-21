import { Navigate } from 'react-router-dom';

// Componente que redireciona /login para /auth
const Login = () => {
  return <Navigate to="/auth" replace />;
};

export default Login;