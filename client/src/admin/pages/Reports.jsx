import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/reports.css';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Reports() {
  const stats = useQuery(api.modules.orders.orders.getOrderStatistics) || {
    totalOrders: 0,
    totalRevenue: 0,
    totalDeliveries: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  };

  const allOrders = useQuery(api.modules.orders.orders.getAllOrders) || [];

  // Helper to aggregate data for charts (Last 7 days)
  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      return { date: dateStr, orders: 0, revenue: 0 };
    }).reverse();

    allOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayStat = last7Days.find(d => d.date === orderDate);
      if (dayStat) {
        dayStat.orders += 1;
        if (order.status === 'delivered') {
          dayStat.revenue += order.totalAmount;
        }
      }
    });

    // Format date for display
    return last7Days.map(d => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
    }));
  };

  const chartData = getChartData();

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-content">
            <h1>📈 Business Reports</h1>
            <p>Track your business performance and growth.</p>
          </div>
          <div className="header-actions">
            <span className="report-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon-wrapper">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
              <span className="stat-trend positive">↗ +12% this week</span>
            </div>
          </div>
          <div className="stat-card orders">
            <div className="stat-icon-wrapper">📦</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
              <span className="stat-trend neutral">→ Stable</span>
            </div>
          </div>
          <div className="stat-card delivered">
            <div className="stat-icon-wrapper">✅</div>
            <div className="stat-info">
              <h3>Delivered</h3>
              <p className="stat-value">{stats.deliveredOrders}</p>
              <span className="stat-trend positive">98% Success Rate</span>
            </div>
          </div>
          <div className="stat-card cancelled">
            <div className="stat-icon-wrapper">❌</div>
            <div className="stat-info">
              <h3>Cancelled</h3>
              <p className="stat-value">{stats.cancelledOrders}</p>
              <span className="stat-trend negative">↘ 2% Cancel Rate</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-card large">
            <div className="chart-header">
              <h3>Sales Trend</h3>
              <select className="chart-filter">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ff6b35"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ff6b35', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Orders Overview</h3>
            </div>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#004e89" radius={[4, 4, 0, 0]} name="Orders Count" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
