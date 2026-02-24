import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationBell() {
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={`${unreadCount} unread notifications`}
      >
        <Bell className="w-6 h-6 text-gray-700" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50 max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 sticky top-0">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && notifications.length > 0 && (
          <div className="overflow-y-auto flex-1">
            {notifications.map((n, index) => (
              <div
                key={n.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0 ${
                  !n.read ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(n.id)}
              >
                {/* Unread Indicator */}
                {!n.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}

                <div className="flex items-start gap-3 ml-2">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      !n.read ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-gray-900 ${
                      !n.read ? "font-bold" : "font-semibold"
                    }`}>
                      {n.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Type Badge */}
                  {n.type && (
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 flex-shrink-0">
                      {n.type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-center">
            <button className="text-xs text-primary hover:text-blue-600 font-semibold">
              View all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
