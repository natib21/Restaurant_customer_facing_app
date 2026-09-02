import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';
import { getOrderUrl } from '../url/url';

/**
 * Custom hook to subscribe to real-time order and item status updates
 * @param {string} orderId - Target order identifier
 * @param {string} sessionToken - JWT/Customer session token
 */
export function useOrderStatus(orderId, sessionToken) {
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [itemStatuses, setItemStatuses] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isLoading, setIsLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  // Fetch initial order details from backend on mount or orderId change
  useEffect(() => {
    if (!orderId) {
      return;
    }

    let isMounted = true;

    const loadOrder = async () => {
      try {
        const token = sessionToken || localStorage.getItem('sessionToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(getOrderUrl(orderId), { headers });

        if (response.ok) {
          const result = await response.json();
          const fetchedOrder = result?.data?.order || result?.data || null;

          if (fetchedOrder && isMounted) {
            setOrder(fetchedOrder);
            const initialStatus = (fetchedOrder.status || 'pending').toLowerCase();
            setOrderStatus(initialStatus);

            // Populate initial item statuses if present
            if (Array.isArray(fetchedOrder.items)) {
              const initialItemMap = {};
              fetchedOrder.items.forEach((item) => {
                const itemId = item._id || item.id || item.menuItemId;
                if (itemId) {
                  initialItemMap[itemId] = item.status || initialStatus;
                }
              });
              setItemStatuses(initialItemMap);
            }
            setIsLoading(false);
            return;
          }
        }

        // Check localStorage recent orders as immediate state cache
        const storedHistory = localStorage.getItem('recentOrders');
        if (storedHistory && isMounted) {
          try {
            const parsed = JSON.parse(storedHistory);
            const localOrder = parsed.find(
              (o) => (o.id || o._id) === orderId || (o.orderNumber && String(o.orderNumber) === String(orderId))
            );
            if (localOrder) {
              setOrder(localOrder);
              setOrderStatus((localOrder.status || 'pending').toLowerCase());
              setIsLoading(false);
              return;
            }
          } catch {
            // ignore parsing error
          }
        }

        if (!response.ok && isMounted) {
          setError('Order not found or access token expired.');
        }
      } catch (err) {
        console.warn('Order fetch warning, checking local cache:', err);
        const storedHistory = localStorage.getItem('recentOrders');
        if (storedHistory && isMounted) {
          try {
            const parsed = JSON.parse(storedHistory);
            const localOrder = parsed.find(
              (o) => (o.id || o._id) === orderId || (o.orderNumber && String(o.orderNumber) === String(orderId))
            );
            if (localOrder) {
              setOrder(localOrder);
              setOrderStatus((localOrder.status || 'pending').toLowerCase());
              setIsLoading(false);
              return;
            }
          } catch {
            // fallback
          }
        }
        if (isMounted) {
          setError('Unable to load order details. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, sessionToken]);

  const refreshOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setIsLoading(true);
      setError(null);
      const token = sessionToken || localStorage.getItem('sessionToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(getOrderUrl(orderId), { headers });
      if (response.ok) {
        const result = await response.json();
        const fetchedOrder = result?.data?.order || result?.data || null;
        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setOrderStatus((fetchedOrder.status || 'pending').toLowerCase());
        }
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, sessionToken]);

  // Handle Socket.IO connection and room lifecycle
  useEffect(() => {
    const token = sessionToken || localStorage.getItem('sessionToken');

    if (token) {
      socketService.connect(token);
    }

    const handleConnectionChange = (state) => {
      setConnectionStatus(state);
    };

    socketService.onConnectionChange(handleConnectionChange);

    if (orderId) {
      // Join targeted order room
      socketService.joinOrderRoom(orderId);

      // Handler for order:status_changed
      const handleStatusChanged = (data) => {
        if (!data) return;
        const targetId = data.orderId || data.id || data._id;
        if (targetId && String(targetId) === String(orderId)) {
          const newStatus = (data.status || 'pending').toLowerCase();
          console.log(`📢 Live status update for order ${orderId}: ${newStatus}`);
          setOrderStatus(newStatus);

          setOrder((prevOrder) => {
            if (!prevOrder) return prevOrder;
            return {
              ...prevOrder,
              status: newStatus,
              updatedAt: data.timestamp || new Date().toISOString(),
            };
          });

          // Also update recentOrders in localStorage so History view is in sync
          try {
            const stored = localStorage.getItem('recentOrders');
            if (stored) {
              const list = JSON.parse(stored);
              const updated = list.map((item) =>
                (item.id || item._id) === orderId ? { ...item, status: newStatus } : item
              );
              localStorage.setItem('recentOrders', JSON.stringify(updated));
            }
          } catch (e) {
            console.error('Storage sync error:', e);
          }
        }
      };

      // Handler for order:item_status_changed
      const handleItemStatusChanged = (data) => {
        if (!data) return;
        const targetId = data.orderId || data.id;
        if (targetId && String(targetId) === String(orderId) && data.itemId) {
          console.log(`📢 Live item update for item ${data.itemId}: ${data.status}`);
          setItemStatuses((prev) => ({
            ...prev,
            [data.itemId]: (data.status || '').toLowerCase(),
          }));

          setOrder((prevOrder) => {
            if (!prevOrder || !Array.isArray(prevOrder.items)) return prevOrder;
            const updatedItems = prevOrder.items.map((item) => {
              const currentId = item._id || item.id || item.menuItemId;
              if (currentId === data.itemId) {
                return { ...item, status: (data.status || '').toLowerCase() };
              }
              return item;
            });
            return { ...prevOrder, items: updatedItems };
          });
        }
      };

      socketService.onOrderStatusChanged(handleStatusChanged);
      socketService.onItemStatusChanged(handleItemStatusChanged);

      return () => {
        socketService.offOrderStatusChanged(handleStatusChanged);
        socketService.offItemStatusChanged(handleItemStatusChanged);
        socketService.offConnectionChange(handleConnectionChange);
      };
    }

    return () => {
      socketService.offConnectionChange(handleConnectionChange);
    };
  }, [orderId, sessionToken]);

  return {
    order,
    orderStatus,
    itemStatuses,
    connectionStatus,
    isLoading,
    error,
    refreshOrder,
  };
}

export default useOrderStatus;
