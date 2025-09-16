import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, DollarSign, Clock, Eye, BarChart3, Plus, Edit2, Save, X, Activity } from 'lucide-react';

const ServiceWriterDashboard = () => {
  const [currentPage, setCurrentPage] = useState('management');
  const [selectedWriter, setSelectedWriter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('Sales');
  const [showRollingAvg, setShowRollingAvg] = useState(true);
  const [showOnlyFlags, setShowOnlyFlags] = useState(false);

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

  // Extended data
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

  // Form state for adding/editing records
  const [formData, setFormData] = useState({
    serviceWriter: '',
    weekEnding: '',
    weekNumber: '',
    carCount: '',
    sales: '',
    avgInvoice: '',
    gpPercent: '',
    hoursPresented: '',
    hoursSold: '',
    inspectionViewed: '',
    hpPerRO: '',
    hsPerRO: ''
  });

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

    Object.keys(metrics).forEach(writer => {
      const records = metrics[writer].records.sort((a, b) => new Date(b.weekEnding) - new Date(a.weekEnding));
      metrics[writer].latest = records[0];
      
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

        metrics[writer].benchmarks = {
          hoursPresented: safeNumber(latest.hpPerRO) >= BENCHMARKS.hpPerRO,
          gpPercent: safeNumber(latest.gpPercent) >= BENCHMARKS.gpPercent,
          inspectionViewed: safeNumber(latest.inspectionViewed) >= BENCHMARKS.inspectionViewed
        };
      }
    });

    return metrics;
  }, [manualData, BENCHMARKS.hpPerRO, BENCHMARKS.gpPercent, BENCHMARKS.inspectionViewed]);

  const writers = Object.keys(writerMetrics).sort();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const carCount = parseInt(formData.carCount) || 0;
    const hoursPresented = parseFloat(formData.hoursPresented) || 0;
    const hoursSold = parseFloat(formData.hoursSold) || 0;
    
    const hpPerRO = formData.hpPerRO ? parseFloat(formData.hpPerRO) : (carCount > 0 ? hoursPresented / carCount : 0);
    const hsPerRO = formData.hsPerRO ? parseFloat(formData.hsPerRO) : (carCount > 0 ? hoursSold / carCount : 0);
    
    const newRecord = {
      serviceWriter: formData.serviceWriter,
      weekEnding: formData.weekEnding,
      weekNumber: parseInt(formData.weekNumber) || 0,
      carCount: carCount,
      sales: parseFloat(formData.sales) || 0,
      avgInvoice: parseFloat(formData.avgInvoice) || 0,
      gpPercent: parseFloat(formData.gpPercent) || 0,
      hoursPresented: hoursPresented,
      hoursSold: hoursSold,
      inspectionViewed: parseFloat(formData.inspectionViewed) || 0,
      hpPerRO: parseFloat(hpPerRO.toFixed(2)),
      hsPerRO: parseFloat(hsPerRO.toFixed(2))
    };

    if (editingRecord) {
      setManualData(prev => prev.map(record => 
        record.serviceWriter === editingRecord.serviceWriter && 
        record.weekEnding === editingRecord.weekEnding 
          ? newRecord 
          : record
      ));
      setEditingRecord(null);
    } else {
      setManualData(prev => [...prev, newRecord]);
    }

    setFormData({
      serviceWriter: '', weekEnding: '', weekNumber: '', carCount: '', sales: '',
      avgInvoice: '', gpPercent: '', hoursPresented: '', hoursSold: '',
      inspectionViewed: '', hpPerRO: '', hsPerRO: ''
    });
    setShowAddForm(false);
  };

  // Handle edit
  const handleEdit = (record) => {
    setFormData({
      serviceWriter: record.serviceWriter,
      weekEnding: record.weekEnding,
      weekNumber: record.weekNumber.toString(),
      carCount: record.carCount.toString(),
      sales: record.sales.toString(),
      avgInvoice: record.avgInvoice.toString(),
      gpPercent: record.gpPercent.toString(),
      hoursPresented: record.hoursPresented.toString(),
      hoursSold: record.hoursSold.toString(),
      inspectionViewed: record.inspectionViewed.toString(),
      hpPerRO: record.hpPerRO.toString(),
      hsPerRO: record.hsPerRO.toString()
    });
    setEditingRecord(record);
    setShowAddForm(true);
  };

  // Handle week selection change
  const handleWeekChange = (weekEnding) => {
    const selectedWeek = weekOptions.find(w => w.weekEnding === weekEnding);
    setFormData(prev => ({
      ...prev,
      weekEnding,
      weekNumber: selectedWeek ? selectedWeek.weekNumber.toString() : ''
    }));
  };

  // Convert writer data to chart format
  const toChartData = (writerName) => {
    const writer = writerMetrics[writerName];
    if (!writer) return [];
    
    const weeks = [33, 34, 35, 36, 37];
    return weeks.map(week => {
      const record = writer.records.find(r => r.weekNumber === week);
      return {
        week: week,
        Sales: record?.sales || null,
        "GP %": record?.gpPercent || null,
        "HP/RO": record?.hpPerRO || null,
        "Inspection %": record?.inspectionViewed || null,
        "Car Count": record?.carCount || null
      };
    });
  };

  // Analytics Components
  const PassBadge = ({ pass, label }) => (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
      pass ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-amber-100 border-amber-200 text-amber-700"
    }`}>
      {label}
    </span>
  );

  // Enhanced MiniSpark with CSS-based sparkline
  const MiniSpark = ({ writer, field, color = "#4f46e5" }) => {
    const data = toChartData(writer);
    const val37 = data.find(d => d.week === 37)?.[field] || null;
    const baseWeeks = writer === 'BEN' ? [33, 34, 35] : [33, 34, 35, 36];
    const baseValues = baseWeeks.map(wk => data.find(d => d.week === wk)?.[field] || null);
    const base = rollingAvg(baseValues);
    const up = val37 != null && base != null ? val37 >= base : false;

    const formatValue = (v) => {
      if (v == null) return "—";
      if (field === "Sales") return formatCurrency(v);
      if (field.includes("%")) return `${v}%`;
      if (field === "HP/RO") return formatNumber(v);
      return Math.round(v).toString();
    };

    // Create simple sparkline with CSS
    const values = [33, 34, 35, 36, 37].map(wk => {
      const record = data.find(d => d.week === wk);
      return record?.[field] || 0;
    }).filter(v => v > 0);

    if (values.length === 0) return null;

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{field}</div>
          <div className={`text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
            {up ? "Up" : "Down"}
          </div>
        </div>
        <div className="h-16 mt-1 flex items-end justify-between px-1">
          {values.map((value, index) => {
            const height = Math.max(4, ((value - minVal) / range) * 48);
            return (
              <div
                key={index}
                className="w-3 rounded-t"
                style={{ 
                  height: `${height}px`,
                  backgroundColor: color,
                  opacity: index === values.length - 1 ? 1 : 0.6
                }}
              />
            );
          })}
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <div className="text-gray-500">W37</div>
          <div className="font-medium">{formatValue(val37)}</div>
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[10px] text-gray-500">
          <div>Rolling</div>
          <div>{formatValue(base)}</div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, change, trend, benchmark, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-gray-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {benchmark !== undefined && (
          benchmark ? 
            <CheckCircle size={16} className="text-green-500" /> : 
            <AlertTriangle size={16} className="text-red-500" />
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );

  const selectedWriterData = selectedWriter === 'All' ? null : writerMetrics[selectedWriter];

  const getCoachingInsights = (data) => {
    if (!data || !data.latest || !data.benchmarks || !data.trends) return [];
    
    const insights = [];
    const latest = data.latest;
    const benchmarks = data.benchmarks;
    const trends = data.trends;

    if (!benchmarks.hoursPresented) {
      insights.push({
        type: 'critical',
        title: 'Hours Presented/RO Below Target',
        message: `Current: ${safeNumber(latest.hpPerRO).toFixed(1)} | Target: ≥4.0`,
        action: 'Focus on comprehensive vehicle inspections and proactive service recommendations.'
      });
    }

    if (!benchmarks.gpPercent) {
      insights.push({
        type: 'critical',
        title: 'Gross Profit % Below Target',
        message: `Current: ${safeNumber(latest.gpPercent).toFixed(1)}% | Target: ≥59%`,
        action: 'Review pricing strategies and parts markup. Consider value-added services.'
      });
    }

    if (!benchmarks.inspectionViewed) {
      insights.push({
        type: 'critical',
        title: 'Inspection Viewed % Below Target',
        message: `Current: ${safeNumber(latest.inspectionViewed).toFixed(1)}% | Target: ≥50%`,
        action: 'Improve customer engagement during inspection presentation.'
      });
    }

    if (safeNumber(trends.salesChange) < -10) {
      insights.push({
        type: 'warning',
        title: 'Sales Declining',
        message: `Down ${Math.abs(safeNumber(trends.salesChange)).toFixed(1)}% vs 4-week average`,
        action: 'Review customer retention and service advisor processes.'
      });
    }

    if (benchmarks.hoursPresented && benchmarks.gpPercent && benchmarks.inspectionViewed) {
      insights.push({
        type: 'success',
        title: 'All Benchmarks Met!',
        message: 'Excellent performance across all key metrics',
        action: 'Focus on maintaining consistency and mentoring other team members.'
      });
    }

    return insights;
  };

  // Get writer summaries for analytics cards
  const writerSummaries = useMemo(() => {
    return writers.map(writerName => {
      const data = writerMetrics[writerName];
      const passCount = data.benchmarks ? 
        Object.values(data.benchmarks).filter(Boolean).length : 0;
      
      return {
        writer: writerName,
        data: data,
        passCount: passCount,
        summary: {
          wk37: data.latest,
          passes: {
            hpPass: data.benchmarks?.hoursPresented || false,
            gpPass: data.benchmarks?.gpPercent || false,
            dviPass: data.benchmarks?.inspectionViewed || false
          }
        }
      };
    }).filter(item => {
      const matchesSearch = searchTerm ? 
        item.writer.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesFlags = showOnlyFlags ? item.passCount < 3 : true;
      
      return matchesSearch && matchesFlags;
    }).sort((a, b) => b.passCount - a.passCount || a.writer.localeCompare(b.writer));
  }, [writers, writerMetrics, searchTerm, showOnlyFlags]);

  // Only render Analytics view when explicitly requested
  if (currentPage === 'analytics') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Writer Performance Dashboard</h1>
              <p className="text-gray-600">Weekly KPI tracking and performance analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('management')}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Activity size={20} />
                Management
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <BarChart3 size={20} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-screen w-full bg-gray-50 text-gray-900">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Analytics View</h2>
                <p className="text-xs text-gray-500">
                  Weeks 33–37 (Week 37 = most recent) • Benchmarks: HP/RO &gt; 4.0 • GP% ≥ 59% • Inspection ≥ 50%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="h-9 w-44 border rounded-md px-2 text-sm"
                  placeholder="Search writer…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                  className="h-9 w-44 border rounded-md px-2 text-sm" 
                  value={selectedWriter} 
                  onChange={(e) => setSelectedWriter(e.target.value)}
                >
                  <option>All Writers</option>
                  {writers.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <select 
                  className="h-9 w-40 border rounded-md px-2 text-sm" 
                  value={selectedMetric} 
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  {["Sales", "GP %", "HP/RO", "Inspection %", "Car Count"].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <button
                  className={`h-9 px-3 rounded-md text-sm border ${
                    showOnlyFlags ? "bg-rose-600 text-white border-rose-700" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setShowOnlyFlags(prev => !prev)}
                >
                  {showOnlyFlags ? "Showing Flags" : "Show Only Flags"}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Writer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {writerSummaries.map(({ writer, data, passCount, summary }) => (
                <div key={writer} className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition bg-white">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{writer}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <PassBadge 
                            pass={summary.passes.hpPass} 
                            label={`HP/RO ${formatNumber(summary.wk37?.hpPerRO || 0)}`} 
                          />
                          <PassBadge 
                            pass={summary.passes.gpPass} 
                            label={`GP% ${formatNumber(summary.wk37?.gpPercent || 0)}`} 
                          />
                          <PassBadge 
                            pass={summary.passes.dviPass} 
                            label={`DVI ${Math.round(summary.wk37?.inspectionViewed || 0)}%`} 
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Week 37 Sales</div>
                        <div className="text-xl font-semibold">{formatCurrency(summary.wk37?.sales || 0)}</div>
                        <div className="text-xs text-gray-500">
                          GP$ {formatCurrency((summary.wk37?.sales || 0) * (summary.wk37?.gpPercent || 0) / 100)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <MiniSpark writer={writer} field="Sales" color="#4f46e5" />
                      <MiniSpark writer={writer} field="GP %" color="#059669" />
                      <MiniSpark writer={writer} field="HP/RO" color="#d97706" />
                      <MiniSpark writer={writer} field="Inspection %" color="#0ea5e9" />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className={`text-xs font-medium ${
                        passCount === 3 ? "text-emerald-600" :
                        passCount === 2 ? "text-amber-600" :
                        passCount === 1 ? "text-orange-600" :
                        "text-rose-600"
                      }`}>
                        {passCount}/3 benchmarks
                      </div>
                      <button 
                        className="text-sm border rounded-md px-3 py-1 hover:bg-gray-50" 
                        onClick={() => setSelectedWriter(writer)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">
                      {selectedWriterData ? `${selectedWriter} — Weeks 33–37 Performance Data` : "All Writers — Performance Overview"}
                    </h2>
                    <p className="text-xs text-gray-500">Detailed metrics and trend analysis</p>
                  </div>
                </div>

                <div className="w-full">
                  {selectedWriterData ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-600 border-b">
                            <th className="py-2 pr-4">Week</th>
                            <th className="py-2 pr-4">Cars</th>
                            <th className="py-2 pr-4">Sales</th>
                            <th className="py-2 pr-4">Avg Invoice</th>
                            <th className="py-2 pr-4">GP%</th>
                            <th className="py-2 pr-4">HP/RO</th>
                            <th className="py-2 pr-4">HS/RO</th>
                            <th className="py-2 pr-4">Inspection %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[37, 36, 35, 34, 33].map(wk => {
                            const record = selectedWriterData.records.find(r => r.weekNumber === wk);
                            if (!record) return null;
                            
                            return (
                              <tr key={wk} className={wk === 37 ? "bg-blue-50" : ""}>
                                <td className="py-2 pr-4 font-medium">W{wk}</td>
                                <td className="py-2 pr-4">{record.carCount}</td>
                                <td className="py-2 pr-4">{formatCurrency(record.sales)}</td>
                                <td className="py-2 pr-4">{formatCurrency(record.avgInvoice)}</td>
                                <td className={`py-2 pr-4 font-medium ${record.gpPercent >= BENCHMARKS.gpPercent ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPercent(record.gpPercent)}
                                </td>
                                <td className={`py-2 pr-4 font-medium ${record.hpPerRO >= BENCHMARKS.hpPerRO ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatNumber(record.hpPerRO)}
                                </td>
                                <td className="py-2 pr-4">{formatNumber(record.hsPerRO)}</td>
                                <td className={`py-2 pr-4 font-medium ${record.inspectionViewed >= BENCHMARKS.inspectionViewed ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatPercent(record.inspectionViewed)}
                                </td>
                              </tr>
                            );
                          })}
                          {selectedWriterData.rolling4Avg && (
                            <tr className="bg-gray-100 font-medium">
                              <td className="py-2 pr-4">Avg</td>
                              <td className="py-2 pr-4">{Math.round(selectedWriterData.rolling4Avg.carCount)}</td>
                              <td className="py-2 pr-4">{formatCurrency(selectedWriterData.rolling4Avg.sales)}</td>
                              <td className="py-2 pr-4">{formatCurrency(selectedWriterData.rolling4Avg.avgInvoice)}</td>
                              <td className="py-2 pr-4">{formatPercent(selectedWriterData.rolling4Avg.gpPercent)}</td>
                              <td className="py-2 pr-4">{formatNumber(selectedWriterData.rolling4Avg.hpPerRO)}</td>
                              <td className="py-2 pr-4">{formatNumber(selectedWriterData.rolling4Avg.hsPerRO)}</td>
                              <td className="py-2 pr-4">{formatPercent(selectedWriterData.rolling4Avg.inspectionViewed)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {writers.map(w => {
                        const data = writerMetrics[w];
                        if (!data.latest) return null;
                        
                        const benchmarksMet = data.benchmarks ? 
                          Object.values(data.benchmarks).filter(Boolean).length : 0;
                        
                        return (
                          <div key={w} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedWriter(w)}>
                            <h4 className="font-semibold mb-2">{w}</h4>
                            <div className="space-y-1 text-sm">
                              <div>Week 37 Sales: <span className="font-medium">{formatCurrency(data.latest.sales)}</span></div>
                              <div>GP%: <span className={`font-medium ${data.benchmarks?.gpPercent ? 'text-green-600' : 'text-red-600'}`}>
                                {formatPercent(data.latest.gpPercent)}
                              </span></div>
                              <div>HP/RO: <span className={`font-medium ${data.benchmarks?.hoursPresented ? 'text-green-600' : 'text-red-600'}`}>
                                {formatNumber(data.latest.hpPerRO)}
                              </span></div>
                              <div className="pt-1">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  benchmarksMet === 3 ? 'bg-green-100 text-green-800' :
                                  benchmarksMet >= 1 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {benchmarksMet}/3 benchmarks met
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Management View (your existing working code)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Writer Performance Dashboard</h1>
            <p className="text-gray-600">Weekly KPI tracking and performance analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Activity size={20} />
              Management
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <BarChart3 size={20} />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Management View Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Management View</h2>
                <p className="text-gray-600">Weekly KPI tracking with 4-week rolling averages and benchmark analysis</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Add Week Data
              </button>
            </div>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingRecord ? 'Edit Week Data' : 'Add New Week Data'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingRecord(null);
                      setFormData({
                        serviceWriter: '', weekEnding: '', weekNumber: '', carCount: '', sales: '',
                        avgInvoice: '', gpPercent: '', hoursPresented: '', hoursSold: '',
                        inspectionViewed: '', hpPerRO: '', hsPerRO: ''
                      });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Service Writer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Writer</label>
                    <select
                      value={formData.serviceWriter}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceWriter: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Writer</option>
                      {writers.map(writer => (
                        <option key={writer} value={writer}>{writer}</option>
                      ))}
                    </select>
                  </div>

                  {/* Week Ending */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week Ending (Saturday)</label>
                    <select
                      value={formData.weekEnding}
                      onChange={(e) => handleWeekChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select Week</option>
                      {weekOptions.map(week => (
                        <option key={week.weekEnding} value={week.weekEnding}>
                          {week.display}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Week Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Week Number</label>
                    <input
                      type="number"
                      value={formData.weekNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, weekNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  {/* Form fields */}
                  {[
                    { key: 'carCount', label: 'Car Count', type: 'number' },
                    { key: 'sales', label: 'Sales ($)', type: 'number', step: '0.01' },
                    { key: 'avgInvoice', label: 'Average Invoice ($)', type: 'number', step: '0.01' },
                    { key: 'gpPercent', label: 'Gross Profit %', type: 'number', step: '0.01' },
                    { key: 'hoursPresented', label: 'Hours Presented', type: 'number', step: '0.01' },
                    { key: 'hoursSold', label: 'Hours Sold', type: 'number', step: '0.01' },
                    { key: 'inspectionViewed', label: 'Inspection Viewed %', type: 'number', step: '0.01' },
                    { key: 'hpPerRO', label: 'HP/RO (Optional)', type: 'number', step: '0.01', placeholder: 'Auto-calculated if empty' },
                    { key: 'hsPerRO', label: 'HS/RO (Optional)', type: 'number', step: '0.01', placeholder: 'Auto-calculated if empty' }
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        step={field.step}
                        value={formData[field.key]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder={field.placeholder}
                        required={!field.placeholder}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 lg:col-span-3 flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Save size={20} />
                      {editingRecord ? 'Update Record' : 'Add Record'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingRecord(null);
                        setFormData({
                          serviceWriter: '', weekEnding: '', weekNumber: '', carCount: '', sales: '',
                          avgInvoice: '', gpPercent: '', hoursPresented: '', hoursSold: '',
                          inspectionViewed: '', hpPerRO: '', hsPerRO: ''
                        });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Writer</label>
                <select 
                  value={selectedWriter} 
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Writers</option>
                  {writers.map(writer => (
                    <option key={writer} value={writer}>{writer}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  Latest data: <span className="font-medium">Week 37 - September 13, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Writer View */}
          {selectedWriter !== 'All' && selectedWriterData && selectedWriterData.latest && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedWriter} - Week {safeNumber(selectedWriterData.latest.weekNumber)} Ending {selectedWriterData.latest.weekEnding}
                  </h2>
                  <button
                    onClick={() => handleEdit(selectedWriterData.latest)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                </div>
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <MetricCard
                    title="Car Count"
                    value={safeNumber(selectedWriterData.latest.carCount)}
                    icon={Users}
                  />
                  <MetricCard
                    title="Sales"
                    value={formatCurrency(selectedWriterData.latest.sales)}
                    change={selectedWriterData.trends ? `${selectedWriterData.trends.salesChange > 0 ? '+' : ''}${safeNumber(selectedWriterData.trends.salesChange).toFixed(1)}%` : null}
                    trend={selectedWriterData.trends?.sales}
                    icon={DollarSign}
                  />
                  <MetricCard
                    title="Gross Profit %"
                    value={formatPercent(selectedWriterData.latest.gpPercent)}
                    change={selectedWriterData.trends ? `${selectedWriterData.trends.gpPercentChange > 0 ? '+' : ''}${safeNumber(selectedWriterData.trends.gpPercentChange).toFixed(1)}pp` : null}
                    trend={selectedWriterData.trends?.gpPercent}
                    benchmark={selectedWriterData.benchmarks?.gpPercent}
                    icon={BarChart3}
                  />
                  <MetricCard
                    title="Hours Presented/RO"
                    subtitle="Target: ≥4.0"
                    value={safeNumber(selectedWriterData.latest.hpPerRO).toFixed(1)}
                    benchmark={selectedWriterData.benchmarks?.hoursPresented}
                    icon={Clock}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard
                    title="Average Invoice"
                    value={formatCurrency(selectedWriterData.latest.avgInvoice)}
                    icon={DollarSign}
                  />
                  <MetricCard
                    title="Hours Sold/RO"
                    value={safeNumber(selectedWriterData.latest.hsPerRO).toFixed(1)}
                    icon={Clock}
                  />
                  <MetricCard
                    title="Inspection Viewed %"
                    subtitle="Target: ≥50%"
                    value={formatPercent(selectedWriterData.latest.inspectionViewed)}
                    change={selectedWriterData.trends ? `${selectedWriterData.trends.inspectionViewedChange > 0 ? '+' : ''}${safeNumber(selectedWriterData.trends.inspectionViewedChange).toFixed(1)}pp` : null}
                    trend={selectedWriterData.trends?.inspectionViewed}
                    benchmark={selectedWriterData.benchmarks?.inspectionViewed}
                    icon={Eye}
                  />
                </div>

                {/* 4-Week Rolling Average Comparison */}
                {selectedWriterData.rolling4Avg && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">4-Week Rolling Average Comparison</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-blue-700">Sales Avg:</p>
                        <p className="font-medium text-blue-900">{formatCurrency(selectedWriterData.rolling4Avg.sales)}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">GP% Avg:</p>
                        <p className="font-medium text-blue-900">{formatPercent(selectedWriterData.rolling4Avg.gpPercent)}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">HP/RO Avg:</p>
                        <p className="font-medium text-blue-900">{safeNumber(selectedWriterData.rolling4Avg.hpPerRO).toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-blue-700">Insp% Avg:</p>
                        <p className="font-medium text-blue-900">{formatPercent(selectedWriterData.rolling4Avg.inspectionViewed)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Week History */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Performance History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">Week</th>
                          <th className="px-3 py-2 text-left">Date</th>
                          <th className="px-3 py-2 text-left">Cars</th>
                          <th className="px-3 py-2 text-left">Sales</th>
                          <th className="px-3 py-2 text-left">GP%</th>
                          <th className="px-3 py-2 text-left">HP/RO</th>
                          <th className="px-3 py-2 text-left">Insp%</th>
                          <th className="px-3 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedWriterData.records.slice(0, 6).map((record, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-3 py-2 font-medium">W{safeNumber(record.weekNumber)}</td>
                            <td className="px-3 py-2">{record.weekEnding}</td>
                            <td className="px-3 py-2">{safeNumber(record.carCount)}</td>
                            <td className="px-3 py-2">{formatCurrency(record.sales)}</td>
                            <td className="px-3 py-2 font-medium">{formatPercent(record.gpPercent)}</td>
                            <td className="px-3 py-2 font-medium">{safeNumber(record.hpPerRO).toFixed(1)}</td>
                            <td className="px-3 py-2 font-medium">{formatPercent(record.inspectionViewed)}</td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => handleEdit(record)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Coaching Insights */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Coaching Insights & Action Items</h3>
                
                <div className="space-y-3">
                  {getCoachingInsights(selectedWriterData).map((insight, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        insight.type === 'critical' ? 'bg-red-50' :
                        insight.type === 'warning' ? 'bg-yellow-50' :
                        'bg-green-50'
                      }`}
                    >
                      <div className={`mt-0.5 ${
                        insight.type === 'critical' ? 'text-red-500' :
                        insight.type === 'warning' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {insight.type === 'critical' ? <AlertTriangle size={20} /> :
                         insight.type === 'warning' ? <AlertTriangle size={20} /> :
                         <CheckCircle size={20} />}
                      </div>
                      <div>
                        <p className={`font-medium ${
                          insight.type === 'critical' ? 'text-red-800' :
                          insight.type === 'warning' ? 'text-yellow-800' :
                          'text-green-800'
                        }`}>
                          {insight.title}
                        </p>
                        <p className={`text-sm ${
                          insight.type === 'critical' ? 'text-red-700' :
                          insight.type === 'warning' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {insight.message}
                        </p>
                        <p className={`text-sm mt-1 ${
                          insight.type === 'critical' ? 'text-red-600' :
                          insight.type === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {insight.action}
                        </p>
                      </div>
                    </div>
                  ))}

                  {getCoachingInsights(selectedWriterData).length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p>No specific coaching insights available.</p>
                      <p className="text-sm mt-1">Continue monitoring weekly performance trends.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* All Writers Summary */}
          {selectedWriter === 'All' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">All Service Writers Summary</h2>
                <p className="text-gray-600 mt-1">Week 37 performance vs benchmarks (Click any row to view details)</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Writer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cars</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP%</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HP/RO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insp %</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {writers.map((writer) => {
                      const data = writerMetrics[writer];
                      if (!data.latest) return null;
                      
                      const benchmarksMet = data.benchmarks ? 
                        Object.values(data.benchmarks).filter(Boolean).length : 0;
                      
                      return (
                        <tr key={writer} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedWriter(writer)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{writer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">W{safeNumber(data.latest.weekNumber)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{safeNumber(data.latest.carCount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(data.latest.sales)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={data.benchmarks?.gpPercent ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {formatPercent(data.latest.gpPercent)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={data.benchmarks?.hoursPresented ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {safeNumber(data.latest.hpPerRO).toFixed(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={data.benchmarks?.inspectionViewed ? 'text-green-600 font-medium' : 'text-red-600'}>
                              {formatPercent(data.latest.inspectionViewed)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              {benchmarksMet === 3 ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle size={16} />
                                  <span className="text-xs font-medium">All Met</span>
                                </div>
                              ) : benchmarksMet >= 1 ? (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <AlertTriangle size={16} />
                                  <span className="text-xs">{benchmarksMet}/3</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                  <AlertTriangle size={16} />
                                  <span className="text-xs font-medium">Needs Focus</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="p-6 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Writers Meeting All Benchmarks</p>
                    <p className="text-2xl font-bold text-green-600">
                      {writers.filter(w => {
                        const data = writerMetrics[w];
                        return data.benchmarks && Object.values(data.benchmarks).filter(Boolean).length === 3;
                      }).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average Sales (Week 37)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        writers.reduce((sum, w) => sum + safeNumber(writerMetrics[w].latest?.sales), 0) / writers.length
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Cars Serviced</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {writers.reduce((sum, w) => sum + safeNumber(writerMetrics[w].latest?.carCount), 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Writers Needing Focus</p>
                    <p className="text-2xl font-bold text-red-600">
                      {writers.filter(w => {
                        const data = writerMetrics[w];
                        return data.benchmarks && Object.values(data.benchmarks).filter(Boolean).length === 0;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceWriterDashboard;