import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  colorClass?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon,
  colorClass = 'bg-primary text-white',
  delay = 0
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-5 shadow-card border border-slate-100 hover:shadow-hover transition-all group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-display font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={cn("p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300", colorClass)}>
          <Icon size={20} />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn(
            "flex items-center font-medium mr-2",
            trend === 'up' ? "text-success" : trend === 'down' ? "text-danger" : "text-muted"
          )}>
            {trend === 'up' && <ArrowUpRight size={16} className="mr-1" />}
            {trend === 'down' && <ArrowDownRight size={16} className="mr-1" />}
            {trend === 'neutral' && <Minus size={16} className="mr-1" />}
            {change}
          </span>
          <span className="text-slate-400 text-xs">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
