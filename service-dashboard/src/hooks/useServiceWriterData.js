import { useState, useMemo } from 'react';

export const useServiceWriterData = () => {
  // Benchmarks
  const BENCHMARKS = { hpPerRO: 4.0, gpPercent: 59.0, inspectionViewed: 50.0 };

  // Generate week ending dates for Q2-Q4 2025 (Saturdays)
  const generateWeekEndings = () => {
    const weeks = [];
    const startDate = new Date('2025-04-05');
    const endDate = new Date('2025-12-27');
    
    let currentDate = new Date(startDate);
    let weekNum = 14;
    
    while (currentDate <= endDate) {
      weeks.push({
        weekEnding: currentDate.toISOString().split('T')[0],
        weekNumber: weekNum,
        display: `Week ${weekNum} - ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      });
      currentDate.setDate(currentDate.getDate() + 7);
      weekNum++;
    }
    
    return weeks;
  };

  const weekOptions = generateWeekEndings();

  // Extended data with more complete records through 9/13/2025
  const [manualData, setManualData] = useState([
    // ERNIE - Complete data through 9/13/2025 (Week 37)
    { serviceWriter: 'ERNIE', weekEnding: '2025-09-13', weekNumber: 37, carCount: 50, sales: 41940.14, avgInvoice: 838.80, gpPercent: 61.63, hoursPresented: 207.65, hoursSold: 127.05, inspectionViewed: 58, hpPerRO: 4.15, hsPerRO: 2.54 },
    { serviceWriter: 'ERNIE', weekEnding: '2025-09-06', weekNumber: 36, carCount: 61, sales: 43714.19, avgInvoice: 716.63, gpPercent: 60.92, hoursPresented: 213.35, hoursSold: 125.55, inspectionViewed: 43, hpPerRO: 3.50, hsPerRO: 2.06 },
    { serviceWriter: 'ERNIE', weekEnding: '2025-08-30', weekNumber: 35, carCount: 56, sales: 41398.02, avgInvoice: 739.25, gpPercent: 61.28, hoursPresented: 229.2, hoursSold: 124.85, inspectionViewed: 40, hpPerRO: 4.09, hsPerRO: 2.23 },
    { serviceWriter: 'ERNIE', weekEnding: '2025-08-23', weekNumber: 34, carCount: 63, sales: 54053.71, avgInvoice: 858.00, gpPercent: 59.46, hoursPresented: 225.4, hoursSold: 160.75, inspectionViewed: 56, hpPerRO: 3.58, hsPerRO: 2.55 },
    { serviceWriter: 'ERNIE', weekEnding: '2025-08-16', weekNumber: 33, carCount: 69, sales: 54317.49, avgInvoice: 787.21, gpPercent: 63.27, hoursPresented: 285.4, hoursSold: 172.65, inspectionViewed: 66, hpPerRO: 4.14, hsPerRO: 2.50 },

    // SAM - Complete data through 9/13/2025
    { serviceWriter: 'SAM', weekEnding: '2025-09-13', weekNumber: 37, carCount: 39, sales: 38428.40, avgInvoice: 985.34, gpPercent: 62.58, hoursPresented: 183.53, hoursSold: 112.18, inspectionViewed: 58, hpPerRO: 4.71, hsPerRO: 2.88 },
    { serviceWriter: 'SAM', weekEnding: '2025-09-06', weekNumber: 36, carCount: 43, sales: 30855.33, avgInvoice: 717.57, gpPercent: 63.22, hoursPresented: 203.25, hoursSold: 93.75, inspectionViewed: 56, hpPerRO: 4.73, hsPerRO: 2.18 },
    { serviceWriter: 'SAM', weekEnding: '2025-08-30', weekNumber: 35, carCount: 43, sales: 35105.97, avgInvoice: 816.42, gpPercent: 58.36, hoursPresented: 230.7, hoursSold: 124.05, inspectionViewed: 68, hpPerRO: 5.37, hsPerRO: 2.88 },
    { serviceWriter: 'SAM', weekEnding: '2025-08-23', weekNumber: 34, carCount: 44, sales: 43782.36, avgInvoice: 995.05, gpPercent: 62.56, hoursPresented: 254.35, hoursSold: 132.2, inspectionViewed: 58, hpPerRO: 5.78, hsPerRO: 3.00 },
    { serviceWriter: 'SAM', weekEnding: '2025-08-16', weekNumber: 33, carCount: 49, sales: 58164.74, avgInvoice: 1187.04, gpPercent: 65.14, hoursPresented: 253.95, hoursSold: 218.15, inspectionViewed: 69, hpPerRO: 5.18, hsPerRO: 3.35 },

    // BEN - Extended data
    { serviceWriter: 'BEN', weekEnding: '2025-09-13', weekNumber: 37, carCount: 37, sales: 32980.64, avgInvoice: 891.37, gpPercent: 58.60, hoursPresented: 189.8, hoursSold: 87.1, inspectionViewed: 94, hpPerRO: 5.13, hsPerRO: 2.35 },
    { serviceWriter: 'BEN', weekEnding: '2025-08-30', weekNumber: 35, carCount: 42, sales: 35420.88, avgInvoice: 843.35, gpPercent: 59.85, hoursPresented: 198.45, hoursSold: 102.30, inspectionViewed: 88, hpPerRO: 4.72, hsPerRO: 2.43 },
    { serviceWriter: 'BEN', weekEnding: '2025-08-23', weekNumber: 34, carCount: 48, sales: 42824.70, avgInvoice: 892.18, gpPercent: 62.05, hoursPresented: 232.75, hoursSold: 124.55, inspectionViewed: 64, hpPerRO: 4.85, hsPerRO: 2.59 },
    { serviceWriter: 'BEN', weekEnding: '2025-08-16', weekNumber: 33, carCount: 12, sales: 8920.89, avgInvoice: 743.41, gpPercent: 59.30, hoursPresented: 79.9, hoursSold: 23.55, inspectionViewed: 50, hpPerRO: 6.66, hsPerRO: 1.96 },

    // FRANK - Extended data
    { serviceWriter: 'FRANK', weekEnding: '2025-09-13', weekNumber: 37, carCount: 34, sales: 32369.70, avgInvoice: 952.05, gpPercent: 62.95, hoursPresented: 113.89, hoursSold: 93.95, inspectionViewed: 41, hpPerRO: 3.35, hsPerRO: 2.76 },
    { serviceWriter: 'FRANK', weekEnding: '2025-09-06', weekNumber: 36, carCount: 61, sales: 42861.33, avgInvoice: 702.64, gpPercent: 58.57, hoursPresented: 175.74, hoursSold: 118.39, inspectionViewed: 22, hpPerRO: 2.88, hsPerRO: 1.94 },
    { serviceWriter: 'FRANK', weekEnding: '2025-08-30', weekNumber: 35, carCount: 45, sales: 43198.90, avgInvoice: 959.98, gpPercent: 62.00, hoursPresented: 179.99, hoursSold: 128.19, inspectionViewed: 32, hpPerRO: 4.00, hsPerRO: 2.85 },
    { serviceWriter: 'FRANK', weekEnding: '2025-08-23', weekNumber: 34, carCount: 37, sales: 32147.43, avgInvoice: 868.85, gpPercent: 62.58, hoursPresented: 164.95, hoursSold: 93.5, inspectionViewed: 53, hpPerRO: 4.46, hsPerRO: 2.53 },
    { serviceWriter: 'FRANK', weekEnding: '2025-08-16', weekNumber: 33, carCount: 45, sales: 32896.70, avgInvoice: 731.04, gpPercent: 64.09, hoursPresented: 125.54, hoursSold: 96.09, inspectionViewed: 29, hpPerRO: 2.79, hsPerRO: 2.14 },

    // DIMITIRI - Extended data  
    { serviceWriter: 'DIMITIRI', weekEnding: '2025-09-13', weekNumber: 37, carCount: 48, sales: 49966.75, avgInvoice: 1040.97, gpPercent: 62.16, hoursPresented: 220.71, hoursSold: 133.41, inspectionViewed: 50, hpPerRO: 4.60, hsPerRO: 2.78 },
    { serviceWriter: 'DIMITIRI', weekEnding: '2025-09-06', weekNumber: 36, carCount: 32, sales: 18101.89, avgInvoice: 565.68, gpPercent: 58.89, hoursPresented: 125.2, hoursSold: 48.65, inspectionViewed: 32, hpPerRO: 3.91, hsPerRO: 1.52 },
    { serviceWriter: 'DIMITIRI', weekEnding: '2025-08-30', weekNumber: 35, carCount: 58, sales: 56485.16, avgInvoice: 973.88, gpPercent: 62.59, hoursPresented: 287.95, hoursSold: 152.45, inspectionViewed: 49, hpPerRO: 4.96, hsPerRO: 2.63 },
    { serviceWriter: 'DIMITIRI', weekEnding: '2025-08-23', weekNumber: 34, carCount: 32, sales: 33051.53, avgInvoice: 1032.86, gpPercent: 58.60, hoursPresented: 185.8, hoursSold: 84.85, inspectionViewed: 74, hpPerRO: 5.81, hsPerRO: 2.65 },
    { serviceWriter: 'DIMITIRI', weekEnding: '2025-08-16', weekNumber: 33, carCount: 40, sales: 37383.41, avgInvoice: 934.59, gpPercent: 59.92, hoursPresented: 143.7, hoursSold: 95.2, inspectionViewed: 33, hpPerRO: 3.59, hsPerRO: 2.38 },

    // ARMANDO - Extended data
    { serviceWriter: 'ARMANDO', weekEnding: '2025-09-13', weekNumber: 37, carCount: 43, sales: 39468.41, avgInvoice: 917.87, gpPercent: 60.09, hoursPresented: 193.51, hoursSold: 92.76, inspectionViewed: 37, hpPerRO: 4.50, hsPerRO: 2.16 },
    { serviceWriter: 'ARMANDO', weekEnding: '2025-09-06', weekNumber: 36, carCount: 36, sales: 24526.49, avgInvoice: 681.29, gpPercent: 54.90, hoursPresented: 150.05, hoursSold: 58.91, inspectionViewed: 36, hpPerRO: 4.17, hsPerRO: 1.64 },
    { serviceWriter: 'ARMANDO', weekEnding: '2025-08-30', weekNumber: 35, carCount: 44, sales: 28758.59, avgInvoice: 653.60, gpPercent: 62.97, hoursPresented: 172.14, hoursSold: 79.65, inspectionViewed: 28, hpPerRO: 3.91, hsPerRO: 1.81 },
    { serviceWriter: 'ARMANDO', weekEnding: '2025-08-23', weekNumber: 34, carCount: 46, sales: 32828.71, avgInvoice: 713.67, gpPercent: 57.30, hoursPresented: 221.24, hoursSold: 90.86, inspectionViewed: 37, hpPerRO: 4.81, hsPerRO: 1.98 },
    { serviceWriter: 'ARMANDO', weekEnding: '2025-08-16', weekNumber: 33, carCount: 19, sales: 8791.85, avgInvoice: 462.73, gpPercent: 60.53, hoursPresented: 51.05, hoursSold: 24.75, inspectionViewed: 34, hpPerRO: 2.69, hsPerRO: 1.30 },

    // JAIME - Extended data
    { serviceWriter: 'JAIME', weekEnding: '2025-09-13', weekNumber: 37, carCount: 51, sales: 31862.10, avgInvoice: 624.75, gpPercent: 58.06, hoursPresented: 189.58, hoursSold: 90.65, inspectionViewed: 51, hpPerRO: 3.72, hsPerRO: 1.78 },
    { serviceWriter: 'JAIME', weekEnding: '2025-09-06', weekNumber: 36, carCount: 60, sales: 42244.07, avgInvoice: 704.07, gpPercent: 58.79, hoursPresented: 237.98, hoursSold: 103.73, inspectionViewed: 42, hpPerRO: 3.97, hsPerRO: 1.73 },
    { serviceWriter: 'JAIME', weekEnding: '2025-08-30', weekNumber: 35, carCount: 50, sales: 28919.77, avgInvoice: 578.40, gpPercent: 58.45, hoursPresented: 164.65, hoursSold: 78.6, inspectionViewed: 29, hpPerRO: 3.29, hsPerRO: 1.57 },
    { serviceWriter: 'JAIME', weekEnding: '2025-08-23', weekNumber: 34, carCount: 65, sales: 43485.37, avgInvoice: 669.01, gpPercent: 58.18, hoursPresented: 282.24, hoursSold: 122.45, inspectionViewed: 51, hpPerRO: 4.31, hsPerRO: 1.88 },
    { serviceWriter: 'JAIME', weekEnding: '2025-08-16', weekNumber: 33, carCount: 58, sales: 34791.07, avgInvoice: 599.85, gpPercent: 62.23, hoursPresented: 223.4, hoursSold: 94.39, inspectionViewed: 45, hpPerRO: 4.87, hsPerRO: 1.63 },

    // CRAIG - Extended data
    { serviceWriter: 'CRAIG', weekEnding: '2025-09-13', weekNumber: 37, carCount: 37, sales: 13496.68, avgInvoice: 364.78, gpPercent: 55.51, hoursPresented: 113.45, hoursSold: 37.2, inspectionViewed: 27, hpPerRO: 3.07, hsPerRO: 1.01 },
    { serviceWriter: 'CRAIG', weekEnding: '2025-09-06', weekNumber: 36, carCount: 24, sales: 9591.79, avgInvoice: 399.66, gpPercent: 60.45, hoursPresented: 92.7, hoursSold: 26.35, inspectionViewed: 39, hpPerRO: 3.86, hsPerRO: 1.10 },
    { serviceWriter: 'CRAIG', weekEnding: '2025-08-30', weekNumber: 35, carCount: 6, sales: 4572.31, avgInvoice: 762.05, gpPercent: 51.27, hoursPresented: 17.75, hoursSold: 9.4, inspectionViewed: 29, hpPerRO: 2.96, hsPerRO: 1.57 },
    { serviceWriter: 'CRAIG', weekEnding: '2025-08-23', weekNumber: 34, carCount: 18, sales: 7506.30, avgInvoice: 417.02, gpPercent: 54.01, hoursPresented: 58.05, hoursSold: 20.07, inspectionViewed: 18, hpPerRO: 3.23, hsPerRO: 1.12 },
    { serviceWriter: 'CRAIG', weekEnding: '2025-08-16', weekNumber: 33, carCount: 28, sales: 9484.88, avgInvoice: 338.75, gpPercent: 55.43, hoursPresented: 76.25, hoursSold: 23.6, inspectionViewed: 26, hpPerRO: 2.72, hsPerRO: 0.84 }
  ]);

  // Safe number formatter with fallbacks
  const safeNumber = (value, fallback = 0) => {
    return (typeof value === 'number' && !isNaN(value)) ? value : fallback;
  };

  // Formatting functions
  const formatCurrency = (value) => {
    const safeValue = safeNumber(value);
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    }).format(safeValue);
  };
  
  const formatPercent = (value) => {
    const safeValue = safeNumber(value);
    return `${safeValue.toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    const safeValue = safeNumber(value);
    return safeValue.toFixed(2);
  };

  // Rolling average calculation
  const rollingAvg = (arr) => {
    const vals = arr.filter(v => v != null && !isNaN(v));
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  // Calculate metrics for each writer
  const writerMetrics = useMemo(() => {
    const metrics = {};
    
    manualData.forEach(record => {
      if (!metrics[record.serviceWriter]) {
        metrics[record.serviceWriter] = {
          records: [],
          latest: null,
          rolling4Avg: {},
          trends: {},
          benchmarks: {}
        };
      }
      metrics[record.serviceWriter].records.push(record);
    });

    // Calculate latest week and rolling 4-week averages
    Object.keys(metrics).forEach(writer => {
      const records = metrics[writer].records.sort((a, b) => new Date(b.weekEnding) - new Date(a.weekEnding));
      metrics[writer].latest = records[0];
      
      // Use weeks 33-36 for rolling average (Ben uses 33-35 due to missing data)
      const baseWeeks = writer === 'BEN' ? records.slice(1, 4) : records.slice(1, 5);
      
      if (baseWeeks.length >= 3) {
        metrics[writer].rolling4Avg = {
          carCount: rollingAvg(baseWeeks.map(r => r.carCount)),
          sales: rollingAvg(baseWeeks.map(r => r.sales)),
          avgInvoice: rollingAvg(baseWeeks.map(r => r.avgInvoice)),
          gpPercent: rollingAvg(baseWeeks.map(r => r.gpPercent)),
          hoursPresented: rollingAvg(baseWeeks.map(r => r.hoursPresented)),
          hoursSold: rollingAvg(baseWeeks.map(r => r.hoursSold)),
          inspectionViewed: rollingAvg(baseWeeks.map(r => r.inspectionViewed)),
          hpPerRO: rollingAvg(baseWeeks.map(r => r.hpPerRO)),
          hsPerRO: rollingAvg(baseWeeks.map(r => r.hsPerRO))
        };

        // Calculate trends and percentage changes
        const latest = metrics[writer].latest;
        const avg = metrics[writer].rolling4Avg;
        
        const latestSales = safeNumber(latest.sales);
        const avgSales = safeNumber(avg.sales, 1);
        const latestGP = safeNumber(latest.gpPercent);
        const avgGP = safeNumber(avg.gpPercent);
        const latestHP = safeNumber(latest.hoursPresented);
        const avgHP = safeNumber(avg.hoursPresented, 1);
        const latestInsp = safeNumber(latest.inspectionViewed);
        const avgInsp = safeNumber(avg.inspectionViewed);

        metrics[writer].trends = {
          sales: latestSales > avgSales ? 'up' : 'down',
          salesChange: ((latestSales / avgSales - 1) * 100),
          gpPercent: latestGP > avgGP ? 'up' : 'down',
          gpPercentChange: (latestGP - avgGP),
          hoursPresented: latestHP > avgHP ? 'up' : 'down',
          hoursPresentedChange: ((latestHP / avgHP - 1) * 100),
          inspectionViewed: latestInsp > avgInsp ? 'up' : 'down',
          inspectionViewedChange: (latestInsp - avgInsp)
        };

        // Check benchmarks
        metrics[writer].benchmarks = {
          hoursPresented: safeNumber(latest.hpPerRO) >= BENCHMARKS.hpPerRO,
          gpPercent: safeNumber(latest.gpPercent) >= BENCHMARKS.gpPercent,
          inspectionViewed: safeNumber(latest.inspectionViewed) >= BENCHMARKS.inspectionViewed
        };
      }
    });

    return metrics;
  }, [manualData]);

  const writers = Object.keys(writerMetrics).sort();

  return {
    manualData,
    setManualData,
    writerMetrics,
    writers,
    weekOptions,
    formatCurrency,
    formatPercent,
    formatNumber,
    safeNumber,
    rollingAvg,
    BENCHMARKS
  };
};