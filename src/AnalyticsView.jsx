import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { useServiceWriterData } from './hooks/useServiceWriterData';

const AnalyticsView = () => {
  const {
    writerMetrics,
    writers,
    formatCurrency,
    formatPercent,
    formatNumber,
    safeNumber,
    rollingAvg
  } = useServiceWriterData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWriter, setSelectedWriter] = useState('All Writers');
  const [selectedMetric, setSelectedMetric] = useState('Sales');
  const [showRollingAvg, setShowRollingAvg] = useState(true);
  const [showOnlyFlags, setShowOnlyFlags] = useState(false);

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

  // Pass Badge Component
  const PassBadge = ({ pass, label }) => (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${
      pass ? "bg-emerald-100 border-emerald-200 text-emerald-700" : "bg-amber-100 border-amber-200 text-amber-700"
    }`}>
      {label}
    </span>
  );

  // Mini Sparkline Component
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

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-2">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">{field}</div>
          <div className={`text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
            {up ? "Up" : "Down"}
          </div>
        </div>
        <div className="h-16 mt-1">
          <ResponsiveContainer>
            <LineChart data={data}>
              <Line type="monotone" dataKey={field} stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
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

  // Get writer summaries for analytics cards
  const writerSummaries = React.useMemo(() => {
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

  const selectedWriterData = selectedWriter === 'All Writers' ? null : writerMetrics[selectedWriter];

  return (
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
            <label className="flex items-center gap-1 text-xs text-gray-600">
              <input 
                type="checkbox" 
                checked={showRollingAvg} 
                onChange={(e) => setShowRollingAvg(e.target.checked)} 
              />
              Rolling line
            </label>
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
                  {selectedWriterData ? `${selectedWriter} — Weeks 33–37` : "All Writers — Compare by Metric"}
                </h2>
                <p className="text-xs text-gray-500">Rolling average = Weeks 33–36 (Ben uses 33–35)</p>
              </div>
            </div>

            <div className="w-full h-72 md:h-80">
              <ResponsiveContainer>
                {selectedWriterData ? (
                  <LineChart data={toChartData(selectedWriter)} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "Sales" ? formatCurrency(value) : 
                        name.includes("%") ? `${value}%` : 
                        formatNumber(value), 
                        name
                      ]}
                    />
                    <Line type="monotone" dataKey={selectedMetric} stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
                    {showRollingAvg && selectedWriterData.rolling4Avg && (
                      <Line
                        type="monotone"
                        dataKey={() => {
                          const avgValue = selectedWriterData.rolling4Avg[
                            selectedMetric === "Sales" ? "sales" :
                            selectedMetric === "GP %" ? "gpPercent" :
                            selectedMetric === "HP/RO" ? "hpPerRO" :
                            selectedMetric === "Inspection %" ? "inspectionViewed" :
                            "carCount"
                          ];
                          return avgValue;
                        }}
                        stroke="#10b981"
                        strokeDasharray="6 6"
                        dot={false}
                        name="Rolling Avg (33–36)"
                      />
                    )}
                  </LineChart>
                ) : (
                  <BarChart
                    data={writers.map(w => ({
                      name: w,
                      value: writerMetrics[w].latest?.[
                        selectedMetric === "Sales" ? "sales" :
                        selectedMetric === "GP %" ? "gpPercent" :
                        selectedMetric === "HP/RO" ? "hpPerRO" :
                        selectedMetric === "Inspection %" ? "inspectionViewed" :
                        "carCount"
                      ] || 0
                    }))}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value) => 
                        selectedMetric === "Sales" ? formatCurrency(value) : 
                        selectedMetric.includes("%") ? `${value}%` : 
                        formatNumber(value)
                      } 
                    />
                    <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;