import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/tailwind/utils';

export interface MetricCardProps {
  /**
   * The main title/label of the metric (e.g., "Perfect Order Rate")
   */
  title: string;
  
  /**
   * The main value to display (e.g., "94.2%")
   */
  value: string;
  
  /**
   * Description text shown below the value
   */
  description: string;
  
  /**
   * The trend indicator (e.g., "+2.1%", "-0.5%")
   * Positive values (starting with +) will be displayed in green
   * Negative values (starting with -) will be displayed in red
   */
  trend: string;
  
  /**
   * Background color class for the card (e.g., "bg-blue-50")
   */
  bgColor?: string;
  
  /**
   * Text color class for the value (e.g., "text-blue-600")
   */
  valueColor?: string;
  
  /**
   * Additional CSS classes for the card
   */
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  trend,
  bgColor = 'bg-white',
  valueColor = 'text-gray-900',
  className,
}) => {
  const isPositiveTrend = trend.startsWith('+');
  const trendColor = isPositiveTrend ? 'text-green-600' : 'text-red-600';

  return (
    <Card className={cn(bgColor, 'border-0', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className={cn('text-xs font-semibold', trendColor)}>
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

