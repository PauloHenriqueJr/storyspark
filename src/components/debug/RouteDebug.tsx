import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Home, User, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRole } from '@/hooks/useRole';

const RouteDebug = () => {
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess, hasSuperAdminAccess, currentRole } = useRole();

  const publicRoutes = [
    { path: '/', label: 'Home/Landing', icon: Home },
    { path: '/modern', label: 'Modern Landing', icon: Home },
    { path: '/blog', label: 'Blog', icon: ExternalLink },
    { path: '/auth', label: 'Login/Register', icon: User },
  ];

  const protectedRoutes = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/composer', label: 'Composer', icon: ExternalLink },
    { path: '/campaigns', label: 'Campaigns', icon: ExternalLink },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/personas', label: 'Personas', icon: User },
    { path: '/templates', label: 'Templates', icon: ExternalLink },
  ];

  const adminRoutes = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
    { path: '/admin/users', label: 'Admin Users', icon: User },
    { path: '/admin/settings', label: 'Admin Settings', icon: Settings },
    { path: '/contingency-demo', label: 'Contingency Demo', icon: Shield },
  ];

  const debugRoutes = [
    { path: '/debug-auth', label: 'Auth Debug', icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug de Rotas - StorySpark</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-medium text-blue-900 mb-2">Status da Autenticação:</h3>
            <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sim' : 'Não'}</p>
            <p><strong>Role:</strong> {currentRole}</p>
            <p><strong>Admin Access:</strong> {hasAdminAccess() ? 'Sim' : 'Não'}</p>
            <p><strong>Super Admin Access:</strong> {hasSuperAdminAccess() ? 'Sim' : 'Não'}</p>
          </div>

          {/* Rotas Públicas */}
          <div>
            <h3 className="font-medium mb-3 text-green-700">Rotas Públicas (sempre acessíveis):</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {publicRoutes.map(route => (
                <Link key={route.path} to={route.path}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <route.icon className="w-4 h-4 mr-2" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Rotas Protegidas */}
          <div>
            <h3 className="font-medium mb-3 text-blue-700">Rotas Protegidas (requer login):</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {protectedRoutes.map(route => (
                <Link key={route.path} to={route.path}>
                  <Button 
                    variant={isAuthenticated ? "outline" : "secondary"} 
                    size="sm" 
                    className="w-full justify-start"
                    disabled={!isAuthenticated}
                  >
                    <route.icon className="w-4 h-4 mr-2" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Rotas de Admin */}
          <div>
            <h3 className="font-medium mb-3 text-red-700">Rotas de Admin (requer admin):</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
              {adminRoutes.map(route => (
                <Link key={route.path} to={route.path}>
                  <Button 
                    variant={hasAdminAccess() ? "outline" : "secondary"} 
                    size="sm" 
                    className="w-full justify-start"
                    disabled={!hasAdminAccess()}
                  >
                    <route.icon className="w-4 h-4 mr-2" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Rotas de Debug */}
          <div>
            <h3 className="font-medium mb-3 text-purple-700">Debug/Temporário:</h3>
            <div className="grid grid-cols-1 gap-2">
              {debugRoutes.map(route => (
                <Link key={route.path} to={route.path}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <route.icon className="w-4 h-4 mr-2" />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded">
            <p><strong>Instruções:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Clique em "Auth Debug" para ver detalhes da autenticação</li>
              <li>Rotas desabilitadas indicam falta de permissão</li>
              <li>Se você está logado mas não consegue acessar admin, verifique seu role no debug</li>
              <li>Esta página é temporária para diagnóstico</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteDebug;