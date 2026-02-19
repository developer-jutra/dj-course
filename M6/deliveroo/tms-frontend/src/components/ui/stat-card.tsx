import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/tailwind/utils';

export interface StatCardProps {
  /**
   * Icon to display (can be either a Lucide React icon or an emoji string)
   */
  icon: LucideIcon | string;
  
  /**
   * Label/title of the stat (e.g., "Total Claims")
   */
  label: string;
  
  /**
   * The main value to display (e.g., "5", "$8,270")
   */
  value: string | number;
  
  /**
   * Background color class for the card (e.g., "bg-blue-50")
   * @default "bg-white"
   */
  bgColor?: string;
  
  /**
   * Border color class for the card (e.g., "border-blue-200")
   */
  borderColor?: string;
  
  /**
   * Text color class for the label (e.g., "text-blue-800")
   * @default "text-gray-600"
   */
  labelColor?: string;
  
  /**
   * Text color class for the value (e.g., "text-blue-600")
   * @default "text-gray-900"
   */
  valueColor?: string;
  
  /**
   * Icon color class (only applies to Lucide icons, e.g., "text-blue-600")
   */
  iconColor?: string;
  
  /**
   * Additional CSS classes for the card
   */
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  bgColor = 'bg-white',
  borderColor,
  labelColor = 'text-gray-600',
  valueColor = 'text-gray-900',
  iconColor,
  className,
}) => {
  const isLucideIcon = typeof icon !== 'string';
  const IconComponent = isLucideIcon ? icon as LucideIcon : null;

  return (
    <Card className={cn(bgColor, borderColor, className)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          {/* Icon */}
          {isLucideIcon && IconComponent ? (
            <IconComponent className={cn('h-5 w-5', iconColor)} />
          ) : (
            <div className="text-2xl">{icon}</div>
          )}
          
          {/* Label and Value */}
          <div>
            <p className={cn('text-sm font-medium', labelColor)}>{label}</p>
            <p className={cn('text-2xl font-bold', valueColor)}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

