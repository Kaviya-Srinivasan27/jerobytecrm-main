import { useEffect, useState, useCallback } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  created_at: string;
  user_id?: number;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "New Product Available",
    message: "Luminous Inverter Battery 150Ah is now in stock!",
    type: "product",
    read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Service Booking Confirmed",
    message: "Your service appointment has been scheduled for tomorrow.",
    type: "service",
    read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "Payment Received",
    message: "Payment of ₹12,500 has been successfully processed.",
    type: "payment",
    read: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: "Special Offer",
    message: "Get 20% off on all CCTV cameras this week!",
    type: "offer",
    read: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "Invoice Generated",
    message: "Your invoice #INV-2024-001 has been generated.",
    type: "invoice",
    read: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications (mock - no backend)
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load from localStorage or use mock data
      const stored = localStorage.getItem("notifications");
      const storedNotifications: Notification[] = stored ? JSON.parse(stored) : mockNotifications;
      
      setNotifications(storedNotifications);
      
      // Calculate unread count
      const unread = storedNotifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
      
      console.log(`✅ Fetched ${storedNotifications.length} notifications (${unread} unread)`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Failed to fetch notifications:", errorMessage);
      setError(errorMessage);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a notification as read (local only)
  const markAsRead = useCallback(async (id: number) => {
    try {
      // Update local state
      const updatedNotifications = notifications.map((n) => 
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      
      // Save to localStorage
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      
      console.log(`✅ Notification ${id} marked as read`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Failed to mark notification as read:", errorMessage);
      setError(errorMessage);
    }
  }, [notifications]);

  // Create a new notification (local only)
  const createNotification = useCallback(
    async (title: string, message: string, type?: string) => {
      try {
        const newNotification: Notification = {
          id: Date.now(),
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
        };

        const updatedNotifications = [newNotification, ...notifications];
        setNotifications(updatedNotifications);
        
        // Update unread count
        setUnreadCount((prev) => prev + 1);
        
        // Save to localStorage
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        
        console.log(`✅ Notification created: ${title}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Failed to create notification:", errorMessage);
        setError(errorMessage);
      }
    },
    [notifications]
  );

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    createNotification,
    refetch: fetchNotifications,
  };
}
