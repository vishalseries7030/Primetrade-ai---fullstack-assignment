import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { taskService } from '../services/taskService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, CheckCircle, Clock, AlertCircle, TrendingUp, Activity, Target, Zap, Award } from 'lucide-react';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await taskService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const statusData = analytics?.tasksByStatus.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const priorityData = analytics?.tasksByPriority.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const performanceData = [
    { metric: 'Completion', value: analytics?.totalTasks > 0 ? Math.round((statusData.find(s => s._id === 'completed')?.count || 0) / analytics.totalTasks * 100) : 0 },
    { metric: 'On Time', value: analytics?.totalTasks > 0 ? Math.round(((analytics.totalTasks - analytics.overdueTasks) / analytics.totalTasks) * 100) : 0 },
    { metric: 'Efficiency', value: analytics?.recentTasks > 0 ? Math.min(100, analytics.recentTasks * 10) : 0 },
    { metric: 'Quality', value: 85 },
    { metric: 'Productivity', value: analytics?.activeUsers > 0 ? Math.min(100, analytics.activeUsers * 20) : 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Activity className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1 flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>Real-time insights and performance metrics</span>
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Target size={28} />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
                <p className="text-4xl font-bold mt-1">{analytics?.totalTasks || 0}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-xs text-blue-100">All time</span>
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users size={28} />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-medium">Active Users</p>
                <p className="text-4xl font-bold mt-1">{analytics?.activeUsers || 0}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-xs text-green-100">of {analytics?.totalUsers || 0} total</span>
              <CheckCircle size={16} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <AlertCircle size={28} />
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-sm font-medium">Overdue</p>
                <p className="text-4xl font-bold mt-1">{analytics?.overdueTasks || 0}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-xs text-orange-100">Needs attention</span>
              <Clock size={16} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Zap size={28} />
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm font-medium">This Week</p>
                <p className="text-4xl font-bold mt-1">{analytics?.recentTasks || 0}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <span className="text-xs text-purple-100">Last 7 days</span>
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Status Distribution */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Activity size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Task Status Distribution</h2>
                <p className="text-sm text-gray-600">Current task breakdown</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Analysis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Priority Analysis</h2>
                <p className="text-sm text-gray-600">Task priority breakdown</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#EC4899" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Radar & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Radar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
                <p className="text-sm text-gray-600">Overall system performance</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                <Radar name="Performance" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <TrendingUp size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quick Insights</h2>
                <p className="text-sm text-gray-600">Key performance indicators</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Completion Rate', value: `${analytics?.totalTasks > 0 ? Math.round((statusData.find(s => s._id === 'completed')?.count || 0) / analytics.totalTasks * 100) : 0}%`, color: 'from-green-500 to-emerald-500', icon: CheckCircle },
                { label: 'Active Users', value: `${analytics?.activeUsers || 0}/${analytics?.totalUsers || 0}`, color: 'from-blue-500 to-cyan-500', icon: Users },
                { label: 'Overdue Rate', value: `${analytics?.totalTasks > 0 ? Math.round((analytics.overdueTasks / analytics.totalTasks) * 100) : 0}%`, color: 'from-red-500 to-orange-500', icon: AlertCircle },
                { label: 'Weekly Tasks', value: analytics?.recentTasks || 0, color: 'from-purple-500 to-pink-500', icon: Zap }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                      <stat.icon size={20} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
