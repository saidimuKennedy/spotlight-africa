import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  AppNotification,
} from "../../lib/api";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev: AppNotification[]) =>
        prev.map((n: AppNotification) =>
          n.id === id ? { ...n, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev: AppNotification[]) =>
        prev.map((n: AppNotification) => ({ ...n, is_read: true })),
      );
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const unreadCount = notifications.filter(
    (n: AppNotification) => !n.is_read,
  ).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/40 hover:text-white transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-gold animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-bg-surface border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[9px] text-accent-gold hover:underline uppercase font-bold"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 flex items-center justify-center">
                  <Loader2
                    className="animate-spin text-accent-gold"
                    size={16}
                  />
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif: AppNotification) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${!notif.is_read ? "bg-accent-gold/5" : ""}`}
                    onClick={() => handleMarkRead(notif.id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-xs font-bold text-white mb-1">
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-white/20 uppercase font-bold">
                      {formatDistanceToNow(new Date(notif.created_at))} ago
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-white/20 italic text-sm">
                  The signal is clear. No new alerts.
                </div>
              )}
            </div>

            <div className="p-3 bg-white/2 text-center">
              <button className="text-[9px] text-white/40 hover:text-white uppercase font-bold tracking-widest transition-colors">
                View All Activity
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
