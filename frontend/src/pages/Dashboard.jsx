import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import TaskStats from '../components/TaskStats';
import TaskTimeline from '../components/TaskTimeline';
import ProductivityChart from '../components/ProductivityChart';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';
import { Plus, Filter, TrendingUp, Calendar, Clock, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

  const calculateStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, pending, overdue, completionRate });
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks(filters);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with gradient */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Track your productivity and manage tasks efficiently</span>
            </p>
          </div>
          <button
            onClick={handleCreateTask}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <Plus size={20} />
            <span className="font-semibold">New Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <TaskStats stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProductivityChart tasks={tasks} />
          <TaskTimeline tasks={tasks} />
        </div>

        {/* Filters with enhanced design */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Filter size={20} className="text-white" />
              </div>
              <span className="font-semibold text-gray-700">Filter Tasks</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
                <option value="overdue">⚠️ Overdue</option>
              </select>
              <select
                className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white"
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All Priority</option>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid with enhanced design */}
        {loading ? (
          <div className="text-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle2 className="text-blue-600 animate-pulse" size={24} />
              </div>
            </div>
            <p className="text-gray-600 mt-6 font-medium">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
            <div className="mb-4">
              <Calendar className="mx-auto text-gray-400" size={64} />
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">No tasks found</p>
            <p className="text-gray-500 mb-6">Create your first task to get started!</p>
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition"
            >
              <Plus size={20} />
              <span>Create Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Dashboard;
