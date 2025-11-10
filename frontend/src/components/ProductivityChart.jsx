import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity } from 'lucide-react';

const ProductivityChart = ({ tasks }) => {
  const statusData = [
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3B82F6' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#F59E0B' },
    { name: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const priorityData = [
    { name: 'Urgent', value: tasks.filter(t => t.priority === 'urgent').length, color: '#DC2626' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F97316' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#3B82F6' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#6B7280' }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">{payload[0].value} tasks</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Task Distribution</h3>
            <p className="text-sm text-gray-600">By Status & Priority</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-center text-sm font-semibold text-gray-700 mb-2">By Status</p>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              No data
            </div>
          )}
        </div>

        <div>
          <p className="text-center text-sm font-semibold text-gray-700 mb-2">By Priority</p>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              No data
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[...statusData, ...priorityData].slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-700">{item.name}: {item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductivityChart;
