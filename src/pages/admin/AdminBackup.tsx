import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Database, 
  HardDrive, 
  Cloud, 
  Shield, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Zap,
  Server,
  Lock
} from 'lucide-react';

const AdminBackup = () => {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);

  // Mock backup data
  const backupSettings = {
    autoBackup: true,
    frequency: 'daily',
    retention: 30,
    encryption: true,
    compression: true,
    cloudStorage: true
  };

  const backupHistory = [
    {
      id: 1,
      name: 'backup_2024_01_20_14_30',
      type: 'scheduled',
      status: 'completed',
      size: '2.4 GB',
      created: '2024-01-20 14:30:15',
      duration: '3m 45s',
      encrypted: true,
      location: 'AWS S3'
    },
    {
      id: 2,
      name: 'backup_2024_01_19_14_30',
      type: 'scheduled',
      status: 'completed',
      size: '2.3 GB',
      created: '2024-01-19 14:30:12',
      duration: '3m 52s',
      encrypted: true,
      location: 'AWS S3'
    },
    {
      id: 3,
      name: 'backup_manual_2024_01_18_09_15',
      type: 'manual',
      status: 'completed',
      size: '2.3 GB',
      created: '2024-01-18 09:15:33',
      duration: '4m 12s',
      encrypted: true,
      location: 'Local Storage'
    },
    {
      id: 4,
      name: 'backup_2024_01_18_14_30',
      type: 'scheduled',
      status: 'failed',
      size: '0 GB',
      created: '2024-01-18 14:30:45',
      duration: 'Failed after 1m 23s',
      encrypted: false,
      location: 'AWS S3',
      error: 'Connection timeout to storage service'
    },
    {
      id: 5,
      name: 'backup_2024_01_17_14_30',
      type: 'scheduled',
      status: 'completed',
      size: '2.2 GB',
      created: '2024-01-17 14:30:08',
      duration: '3m 38s',
      encrypted: true,
      location: 'AWS S3'
    }
  ];

  const storageStats = {
    totalUsed: '12.4 GB',
    totalAvailable: '500 GB',
    usagePercentage: 2.5,
    backupCount: 15,
    oldestBackup: '2024-01-05',
    newestBackup: '2024-01-20'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'running': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    // Simulate backup creation
    setTimeout(() => {
      setIsCreatingBackup(false);
    }, 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Backup & Recovery</h1>
          <p className="text-muted-foreground">Gerencie backups e recuperação de dados</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Configurações</span>
            <span className="sm:hidden">Config</span>
          </Button>
          <Button onClick={handleCreateBackup} disabled={isCreatingBackup} className="w-full sm:w-auto">
            <Database className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{isCreatingBackup ? 'Criando...' : 'Backup Agora'}</span>
            <span className="sm:hidden">{isCreatingBackup ? 'Criando...' : 'Backup'}</span>
          </Button>
        </div>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{storageStats.totalUsed}</div>
                <p className="text-xs text-muted-foreground">Espaço Usado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{storageStats.backupCount}</div>
                <p className="text-xs text-muted-foreground">Total Backups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{storageStats.usagePercentage}%</div>
                <p className="text-xs text-muted-foreground">Uso do Storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">Criptografados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar for Storage */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uso do Storage</span>
              <span>{storageStats.totalUsed} de {storageStats.totalAvailable}</span>
            </div>
            <Progress value={storageStats.usagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="backups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="schedule">Agendamento</TabsTrigger>
          <TabsTrigger value="recovery">Recuperação</TabsTrigger>
        </TabsList>

        {/* Backup History */}
        <TabsContent value="backups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Backups</CardTitle>
              <CardDescription>
                Lista de todos os backups realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-mono text-sm">{backup.name}</span>
                          {backup.encrypted && <Lock className="w-3 h-3 text-green-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'manual' ? 'secondary' : 'default'}>
                          {backup.type === 'manual' ? 'Manual' : 'Agendado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(backup.status)}
                          <span className={getStatusColor(backup.status)}>
                            {backup.status === 'completed' ? 'Completo' : 
                             backup.status === 'failed' ? 'Falhou' : 
                             backup.status === 'running' ? 'Executando' : backup.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {backup.created}
                      </TableCell>
                      <TableCell className="text-sm">
                        {backup.duration}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {backup.location === 'AWS S3' ? (
                            <Cloud className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Server className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-sm">{backup.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={backup.status !== 'completed'}
                            onClick={() => {
                              setSelectedBackup(backup);
                              setIsRestoreDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={backup.status !== 'completed'}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Failed Backups Alert */}
          <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-300">
                    1 backup falhou nas últimas 24 horas
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    Backup de 18/01/2024 14:30 - Connection timeout to storage service
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Investigar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Backup Schedule */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Backup Automático</CardTitle>
                <CardDescription>
                  Configure quando e como os backups devem ser executados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Executar backups automaticamente</p>
                  </div>
                  <Switch id="auto-backup" checked={backupSettings.autoBackup} />
                </div>
                
                <div className="space-y-2">
                  <Label>Frequência</Label>
                  <Select value={backupSettings.frequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Horário de Execução</Label>
                  <Input type="time" value="14:30" />
                </div>
                
                <div className="space-y-2">
                  <Label>Retenção (dias)</Label>
                  <Input type="number" value={backupSettings.retention} />
                  <p className="text-xs text-muted-foreground">
                    Backups mais antigos serão removidos automaticamente
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Opções de segurança e compressão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="encryption">Criptografia</Label>
                    <p className="text-sm text-muted-foreground">Criptografar backups com AES-256</p>
                  </div>
                  <Switch id="encryption" checked={backupSettings.encryption} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compression">Compressão</Label>
                    <p className="text-sm text-muted-foreground">Comprimir para economizar espaço</p>
                  </div>
                  <Switch id="compression" checked={backupSettings.compression} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cloud">Armazenamento na Nuvem</Label>
                    <p className="text-sm text-muted-foreground">Enviar backups para AWS S3</p>
                  </div>
                  <Switch id="cloud" checked={backupSettings.cloudStorage} />
                </div>
                
                <div className="space-y-2">
                  <Label>Chave de Criptografia</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="font-mono"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Gerar Nova Chave
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Backups Agendados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">Backup Diário</div>
                      <div className="text-sm text-muted-foreground">21/01/2024 às 14:30</div>
                    </div>
                  </div>
                  <Badge variant="outline">Em 2 horas</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">Backup Semanal</div>
                      <div className="text-sm text-muted-foreground">27/01/2024 às 14:30</div>
                    </div>
                  </div>
                  <Badge variant="outline">Em 6 dias</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recovery Options */}
        <TabsContent value="recovery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Recuperação</CardTitle>
              <CardDescription>
                Restaure dados de backups anteriores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Atenção:</strong> A recuperação de dados irá substituir os dados atuais. 
                  Certifique-se de criar um backup antes de prosseguir.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recuperação Completa</CardTitle>
                    <CardDescription>
                      Restaurar todo o sistema a partir de um backup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restaurar Sistema
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recuperação Seletiva</CardTitle>
                    <CardDescription>
                      Restaurar apenas partes específicas dos dados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Restaurar Seletivo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teste de Recuperação</CardTitle>
              <CardDescription>
                Valide a integridade dos backups sem afetar os dados de produção
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Último Teste</div>
                  <div className="text-sm text-muted-foreground">
                    15/01/2024 - Backup testado com sucesso
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Executar Teste de Recuperação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Restore Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Restauração</DialogTitle>
            <DialogDescription>
              Você está prestes a restaurar os dados do backup selecionado.
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {selectedBackup && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <div><strong>Backup:</strong> {selectedBackup.name}</div>
                <div><strong>Criado em:</strong> {selectedBackup.created}</div>
                <div><strong>Tamanho:</strong> {selectedBackup.size}</div>
                <div><strong>Local:</strong> {selectedBackup.location}</div>
              </div>
              
              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                  Todos os dados atuais serão substituídos pelos dados do backup selecionado.
                  Recomendamos criar um backup antes de prosseguir.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setIsRestoreDialogOpen(false);
                setSelectedBackup(null);
              }}
            >
              Confirmar Restauração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBackup;