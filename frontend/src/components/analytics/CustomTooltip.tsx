import { Card } from '../ui/card';

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number | string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  title?: string;
}

export function CustomTooltip({ active, payload, label, title }: TooltipProps) {
  if (!active || !payload) return null;

  return (
    <Card className="bg-white/90 backdrop-blur-sm p-3 shadow-lg border-0">
      <p className="text-sm font-medium mb-1">{title || label}</p>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-600">{item.name}:</span>
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </Card>
  );
}