import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const TaskTimeline = ({ tasks }) => {
  const upcomingTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'overdue':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'in-progress':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Calendar className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Upcoming Deadlines</h3>
            <p className="text-sm text-gray-600">Next 5 tasks to complete</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task, index) => (
            <div
              key={task._id}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {task.title}
                  </h4>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                  {task.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{getDaysUntilDue(task.dueDate)}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 text-sm">No upcoming tasks</p>
            <p className="text-gray-400 text-xs mt-1">All caught up! 🎉</p>
          </div>
        )}
      </div>

      {upcomingTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total pending tasks</span>
            <span className="font-bold text-gray-900">{tasks.filter(t => t.status !== 'completed').length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTimeline;
