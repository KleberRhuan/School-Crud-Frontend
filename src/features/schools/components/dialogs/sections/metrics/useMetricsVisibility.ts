import { useState } from 'react'

export const useMetricsVisibility = () => {
  const [visibleCount, setVisibleCount] = useState(10)

  const getVisibilityState = (totalMetrics: number) => {
    const remainingCount = Math.max(0, totalMetrics - visibleCount)
    const canShowMore = remainingCount > 0
    const canShowLess = visibleCount > 10

    return {
      visibleCount,
      remainingCount,
      canShowMore,
      canShowLess
    }
  }

  const showMore = (totalMetrics: number) => {
    setVisibleCount(prev => Math.min(prev + 10, totalMetrics))
  }

  const showLess = () => {
    setVisibleCount(prev => Math.max(10, prev - 10))
  }

  const adjustAfterRemoval = (newTotal: number) => {
    if (visibleCount > newTotal) {
      setVisibleCount(Math.max(10, newTotal))
    }
  }

  return {
    getVisibilityState,
    showMore,
    showLess,
    adjustAfterRemoval
  }
} 