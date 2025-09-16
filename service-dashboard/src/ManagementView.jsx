import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, DollarSign, Clock, Eye, BarChart3, Plus, Edit2, Save, X } from 'lucide-react';
import { useServiceWriterData } from './hooks/useServiceWriterData';

const ManagementView = () => {
  const {
    manualData,
    setManualData,
    writerMetrics,
    writers,
    formatCurrency,
    formatPercent,
    safeNumber,
    weekOptions
  } = useServiceWriterData();

  const [selectedWriter, setSelectedWriter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

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

  return (
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
  );
};

export default ManagementView;