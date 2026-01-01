"use client";
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { getProductivityMetrics, getHistoricalData, calculateTaskMetrics } from '@/lib/statistics';

export default function ExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useAuth();

  const exportAnalytics = async () => {
    if (!user) return;
    setIsExporting(true);
    
    try {
      // Obtener todos los datos analíticos
      const metrics = await getProductivityMetrics(user.id, 'month');
      const historical = await getHistoricalData(user.id, 'month');
      const taskMetrics = await calculateTaskMetrics(user.id);

      // Formatear los datos para exportación
      const exportData = {
        productivityMetrics: metrics,
        historicalData: historical,
        taskAnalytics: taskMetrics,
        exportDate: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email
        }
      };

      // Crear y descargar el archivo
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productivity-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportAnalytics}
      disabled={isExporting}
      variant="outline"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export Analytics'}
    </Button>
  );
}