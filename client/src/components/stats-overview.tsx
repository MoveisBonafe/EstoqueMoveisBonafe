import { motion } from "framer-motion";
import { useInventory } from "@/contexts/inventory-context";
import { formatCurrency } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function StatsOverview() {
  const { getStats } = useInventory();
  const stats = getStats();

  const statsCards = [
    {
      title: "Total de Itens",
      value: stats.totalItems.toLocaleString(),
      icon: "inventory_2",
      bgColor: "bg-primary-50",
      iconBgColor: "bg-primary-100",
      iconColor: "text-primary-700",
      change: { value: 12, label: "a mais que no mês passado", trend: "up" }
    },
    {
      title: "Categorias",
      value: stats.categories.toLocaleString(),
      icon: "category",
      bgColor: "bg-secondary-50",
      iconBgColor: "bg-secondary-100",
      iconColor: "text-secondary-700",
      change: { value: 4, label: "novas categorias adicionadas", trend: "up" }
    },
    {
      title: "Estoque Baixo",
      value: stats.lowStock.toLocaleString(),
      icon: "warning",
      bgColor: "bg-orange-50",
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-700",
      change: { value: 15, label: "itens abaixo do limite crítico", trend: "critical" }
    },
    {
      title: "Valor Total",
      value: formatCurrency(stats.totalValue),
      icon: "payments",
      bgColor: "bg-green-50",
      iconBgColor: "bg-green-100",
      iconColor: "text-green-700",
      change: { value: 8, label: "Aumento de % no valor total", trend: "up" }
    }
  ];

  return (
    <motion.div 
      className="bg-white border-b border-gray-200 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <motion.div 
            key={card.title}
            className={`${card.bgColor} rounded-lg p-4`}
            variants={itemVariants}
            custom={index}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`${card.iconColor} text-sm font-medium`}>{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1 font-mono">{card.value}</h3>
              </div>
              <div className={`${card.iconBgColor} p-2 rounded-md`}>
                <span className={`material-icons ${card.iconColor}`}>{card.icon}</span>
              </div>
            </div>
            <p className={`text-xs ${card.iconColor} mt-2 flex items-center`}>
              <span className={`material-icons text-sm mr-1 ${
                card.change.trend === 'up' 
                  ? 'text-green-500' 
                  : card.change.trend === 'down' 
                    ? 'text-red-500' 
                    : 'text-red-500'
              }`}>
                {card.change.trend === 'up' 
                  ? 'arrow_upward' 
                  : card.change.trend === 'down' 
                    ? 'arrow_downward' 
                    : 'priority_high'}
              </span>
              <span>
                {card.change.trend === 'critical'
                  ? card.change.value + ' ' + card.change.label
                  : card.change.value + '% ' + card.change.label}
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
