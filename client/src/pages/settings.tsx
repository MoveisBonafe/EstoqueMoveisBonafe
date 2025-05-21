import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const context = useTheme();
  const theme = context?.theme || 'light';
  const setTheme = context?.setTheme || (() => {});

  return (
    <div className="flex-1 p-6 overflow-auto bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
            <TabsTrigger value="about">Sobre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Preferências Gerais</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSave" className="text-gray-700">Salvamento automático</Label>
                      <p className="text-gray-500 text-sm">Salvar alterações automaticamente</p>
                    </div>
                    <Switch id="autoSave" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="text-gray-700">Notificações</Label>
                      <p className="text-gray-500 text-sm">Receber alertas de estoque baixo</p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Tema e Aparência</h2>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card 
                      className={`cursor-pointer p-4 border-2 ${theme === 'light' ? 'border-primary-500' : 'border-transparent'}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="bg-white border rounded-md shadow-sm p-3 mb-2">
                        <div className="h-2 w-10 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <p className="font-medium text-center">Claro</p>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer p-4 border-2 ${theme === 'dark' ? 'border-primary-500' : 'border-transparent'}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="bg-gray-800 border border-gray-700 rounded-md shadow-sm p-3 mb-2">
                        <div className="h-2 w-10 bg-gray-600 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-gray-700 rounded-full"></div>
                      </div>
                      <p className="font-medium text-center">Escuro</p>
                    </Card>
                    
                    <Card 
                      className="cursor-pointer p-4 border-2 border-transparent"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-white border rounded-md shadow-sm p-3 mb-2">
                        <div className="h-2 w-10 bg-blue-200 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-blue-100 rounded-full"></div>
                      </div>
                      <p className="font-medium text-center">Personalizado</p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Gerenciamento de Dados</h2>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Backup e Exportação</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">cloud_download</span>
                        Exportar dados (JSON)
                      </Button>
                      <Button variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">grid_on</span>
                        Exportar para Excel
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Importação</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <span className="material-icons text-sm">upload_file</span>
                        Importar de arquivo
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-red-600 mb-2">Zona de Perigo</h3>
                    <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-3">
                      <p className="text-red-700 text-sm">
                        Estas ações não podem ser desfeitas. Tenha certeza antes de prosseguir.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="destructive" className="flex items-center gap-1">
                        <span className="material-icons text-sm">delete_forever</span>
                        Limpar todos os dados
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="about">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="space-y-4">
                  <span className="material-icons text-5xl text-primary-500">inventory_2</span>
                  <h2 className="text-2xl font-bold">Sistema de Controle de Estoque</h2>
                  <p className="text-gray-500">Versão 1.0.0</p>
                  
                  <div className="py-4">
                    <p className="text-gray-700 mb-2">
                      Uma aplicação moderna para controle de estoque com interface semelhante ao Excel.
                    </p>
                    <p className="text-gray-600 text-sm">
                      Desenvolvida com React, Tailwind CSS e armazenamento local.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-gray-500 text-sm">© 2023 Sistema de Controle de Estoque</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}