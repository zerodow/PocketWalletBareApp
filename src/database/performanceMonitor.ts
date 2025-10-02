export const queryPerformanceMonitor = {
  measureQuery: async <T>(queryName: string, queryFn: () => Promise<T>): Promise<T> => {
    const startTime = Date.now()
    const result = await queryFn()
    const duration = Date.now() - startTime

    if (__DEV__ && duration > 100) {
      console.warn(`Slow query: ${queryName} took ${duration}ms`)
    }

    return result
  },

  measureSyncQuery: <T>(queryName: string, queryFn: () => T): T => {
    const startTime = Date.now()
    const result = queryFn()
    const duration = Date.now() - startTime

    if (__DEV__ && duration > 50) {
      console.warn(`Slow sync operation: ${queryName} took ${duration}ms`)
    }

    return result
  },

  logStats: (operation: string, count: number, duration: number) => {
    if (__DEV__) {
      console.log(
        `[DB Stats] ${operation}: ${count} items in ${duration}ms (${(duration / count).toFixed(2)}ms per item)`,
      )
    }
  },
}
