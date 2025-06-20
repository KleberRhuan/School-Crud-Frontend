export const useMetricsHandlers = (
  currentMetrics: Record<string, number>,
  updateField: (field: string, value: any) => void,
  adjustAfterRemoval: (newTotal: number) => void
) => {
  const handleAddMetric = (metric: string) => {
    if (metric && !currentMetrics[metric]) {
      updateField('metrics', {
        ...currentMetrics,
        [metric]: 0
      })
    }
  }

  const handleUpdateMetricValue = (metric: string, value: number) => {
    updateField('metrics', {
      ...currentMetrics,
      [metric]: value
    })
  }

  const handleRemoveMetric = (metric: string) => {
    const newMetrics = { ...currentMetrics }
    delete newMetrics[metric]
    updateField('metrics', newMetrics)
    
    // Ajustar visibleCount se necessário após remoção
    const newEntriesLength = Object.keys(newMetrics).length
    adjustAfterRemoval(newEntriesLength)
  }

  const getAvailableMetricsForSelection = (availableMetrics: string[]) => {
    return availableMetrics.filter(metric => !currentMetrics[metric])
  }

  return {
    handleAddMetric,
    handleUpdateMetricValue,
    handleRemoveMetric,
    getAvailableMetricsForSelection
  }
} 