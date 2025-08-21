import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Activity,
  Database,
  Server,
  MoreHorizontal,
  Calendar,
  User
} from 'lucide-react';

const AdminLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Mock data para logs do sistema
  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-01-21 14:30:25',
      level: 'error',
      service: 'API',
      message: 'Failed to connect to OpenAI API - timeout after 30s',
      user: 'sistema',
      ip: '192.168.1.100',
      details: 'Connection timeout during AI request processing',
      stack: 'APIError: timeout\n  at openai.completion.create()\n  at processAIRequest()'
    },
    {
      id: 2,
      timestamp: '2024-01-21 14:25:12',
      level: 'warn',
      service: 'Database',
      message: 'High memory usage detected - 85% of allocated memory',
      user: 'sistema',
      ip: 'localhost',
      details: 'Memory usage has reached warning threshold',
      stack: null
    },
    {
      id: 3,
      timestamp: '2024-01-21 14:20:08',
      level: 'info',
      service: 'Auth',
      message: 'User login successful',
      user: 'admin@storyspark.ai',
      ip: '203.0.113.45',
      details: 'Admin user successfully authenticated',
      stack: null
    },
    {
      id: 4,
      timestamp: '2024-01-21 14:15:33',
      level: 'error',
      service: 'Payment',
      message: 'Payment webhook validation failed',
      user: 'webhook',
      ip: '198.51.100.42',
      details: 'Invalid signature in Stripe webhook payload',
      stack: 'ValidationError: Invalid webhook signature'
    },
    {
      id: 5,
      timestamp: '2024-01-21 14:10:17',
      level: 'success',
      service: 'Backup',
      message: 'Database backup completed successfully',
      user: 'sistema',
      ip: 'localhost',
      details: 'Daily backup process completed - 2.3GB archived',
      stack: null
    },
    {
      id: 6,
      timestamp: '2024-01-21 14:05:22',
      level: 'warn',
      service: 'Security',
      message: 'Multiple failed login attempts detected',
      user: 'unknown',
      ip: '192.0.2.146',
      details: '5 failed attempts in 2 minutes from same IP',
      stack: null
    }
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: '2024-01-21 14:35:10',
      action: 'USER_CREATED',
      actor: 'admin@storyspark.ai',
      target: 'user@exemplo.com',
      details: 'New user account created with role: premium',
      ip: '203.0.113.45'
    },
    {
      id: 2,
      timestamp: '2024-01-21 14:30:45',
      action: 'CAMPAIGN_DELETED',
      actor: 'manager@storyspark.ai',
      target: 'Campaign #1247',
      details: 'Global campaign template deleted',
      ip: '198.51.100.23'
    },
    {
      id: 3,
      timestamp: '2024-01-21 14:25:18',
      action: 'SETTINGS_UPDATED',
      actor: 'admin@storyspark.ai',
      target: 'System Settings',
      details: 'Updated API rate limits and timeout values',
      ip: '203.0.113.45'
    },
    {
      id: 4,
      timestamp: '2024-01-21 14:20:33',
      action: 'TEMPLATE_CREATED',
      actor: 'content@storyspark.ai',
      target: 'Template #892',
      details: 'New global template created for e-commerce category',
      ip: '192.0.2.78'
    }
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return XCircle;
      case 'warn': return AlertTriangle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'API': return Server;
      case 'Database': return Database;
      case 'Auth': return Shield;
      case 'Payment': return Activity;
      default: return Activity;
    }
  };

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    return matchesSearch && matchesLevel && matchesService;
  });

  const stats = [
    {
      title: 'Total de Logs',
      value: '24,789',
      change: '+156 hoje',
      icon: Activity
    },
    {
      title: 'Erros Críticos',
      value: '23',
      change: '-5 vs ontem',
      icon: XCircle
    },
    {
      title: 'Alertas',
      value: '47',
      change: '+12 hoje',
      icon: AlertTriangle
    },
    {
      title: 'Uptime',
      value: '99.8%',
      change: '30 dias',
      icon: CheckCircle
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Logs do Sistema</h1>
          <p className="text-muted-foreground">Auditoria e monitoramento de atividades</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warn">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="API">API</SelectItem>
            <SelectItem value="Database">Database</SelectItem>
            <SelectItem value="Auth">Auth</SelectItem>
            <SelectItem value="Payment">Payment</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">Logs do Sistema</TabsTrigger>
          <TabsTrigger value="audit">Logs de Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const LevelIcon = getLevelIcon(log.level);
              const ServiceIcon = getServiceIcon(log.service);
              
              return (
                <Card key={log.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <LevelIcon className="w-4 h-4 flex-shrink-0" />
                        <ServiceIcon className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getLevelColor(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{log.service}</Badge>
                            <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                          </div>
                          
                          <p className="text-sm font-medium text-foreground mb-1">{log.message}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{log.user}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>IP: {log.ip}</span>
                            </div>
                          </div>
                          
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-2">{log.details}</p>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Copiar Log</DropdownMenuItem>
                          {log.stack && (
                            <DropdownMenuItem>Ver Stack Trace</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <Card key={log.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Shield className="w-4 h-4 flex-shrink-0 text-muted-foreground mt-1" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{log.action}</Badge>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-foreground mb-2">
                        <span><strong>Ator:</strong> {log.actor}</span>
                        <span><strong>Alvo:</strong> {log.target}</span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Rastrear Usuário</DropdownMenuItem>
                        <DropdownMenuItem>Exportar Log</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminLogs;