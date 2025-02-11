"use client";

import { Card } from "../ui/card";

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number | string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  title: string;
}

export function CustomTooltip({ active, payload, label, title }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <Card className="bg-card border-border p-3 shadow-lg dark:border-[#28282F]">
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-foreground">
              {item.name}: {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}