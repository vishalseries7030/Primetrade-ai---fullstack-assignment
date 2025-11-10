import { Edit2, Trash2, Calendar, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusConfig = {
    pending: { 
      bg: 'from-yellow-400 to-orange-400', 
      text: 'text-yellow-800', 
      badge: 'bg-yellow-100 border-yellow-200',
      icon: Clock,
      label: '⏳ Pending'
    },
    'in-progress': { 
      bg: 'from-blue-400 to-cyan-400', 
      text: 'text-blue-800', 
      badge: 'bg-blue-100 border-blue-200',
      icon: Clock,
      label: '🔄 In Progress'
    },
    completed: { 
      bg: 'from-green-400 to-emerald-400', 
      text: 'text-green-800', 
      badge: 'bg-green-100 border-green-200',
      icon: CheckCircle2,
      label: '✅ Completed'
    },
    overdue: { 
      bg: 'from-red-400 to-pink-400', 
      text: 'text-red-800', 
      badge: 'bg-red-100 border-red-200',
      icon: AlertCircle,
      label: '⚠️ Overdue'
    }
  };

  const priorityConfig = {
    low: { color: 'bg-gray-500', label: '🟢 Low' },
    medium: { color: 'bg-blue-500', label: '🟡 Medium' },
    high: { color: 'bg-orange-500', label: '🟠 High' },
    urgent: { color: 'bg-red-500', label: '🔴 Urgent' }
  };

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;

  const getDaysUntilDue = () => {
    const today = new Date();
    const due = new Date(task.dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: 'Due tomorrow', color: 'text-yellow-600' };
    return { text: `${diffDays} days left`, color: 'text-gray-600' };
  };

  const dueInfo = getDaysUntilDue();

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${status.bg}`}></div>
      
      <div className="p-6">
        {/* Title and Actions */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <StatusIcon size={18} className={status.text} />
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                {task.title}
              </h3>
            </div>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${status.badge} ${status.text}`}>
            {status.label}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${priority.color}`}>
            {priority.label}
          </span>
        </div>

        {/* Info Section */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <span className={`text-xs font-semibold ${dueInfo.color}`}>
              {dueInfo.text}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User size={16} className="text-gray-400" />
            <span className="truncate">{task.assignedTo?.name || 'Unassigned'}</span>
          </div>
        </div>

        {/* Progress Bar (for in-progress tasks) */}
        {task.status === 'in-progress' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">In Progress</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
