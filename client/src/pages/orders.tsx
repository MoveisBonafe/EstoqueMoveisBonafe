import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Orders() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-3xl text-primary-600">shopping_cart</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Página de Compras</h1>
            <p className="text-gray-600 mb-6">
              Esta página está em desenvolvimento. Em breve você poderá gerenciar todas as suas compras aqui.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-left">
              <h3 className="font-medium text-gray-800 mb-2">Funcionalidades planejadas:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Criação de ordens de compra</li>
                <li>Acompanhamento de status de pedidos</li>
                <li>Histórico de compras</li>
                <li>Alertas de reposição automática</li>
                <li>Relatórios de compras</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
