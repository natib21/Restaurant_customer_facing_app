import { useEffect, useState } from 'react';
import socketService from '../services/socketService';

/**
 * Hook for real-time order tracking via Socket.IO
 * @param {string} orderId - Target order identifier
 * @param {string} sessionToken - JWT or customer session token
 */
export const useOrderTracking = (orderId, sessionToken) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [itemStatuses, setItemStatuses] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState(socketService.connectionState);

  // Connect to socket when component mounts
  useEffect(() => {
    if (!sessionToken) return;

    socketService.connect(sessionToken);

    // Join order room
    if (orderId) {
      socketService.joinOrderRoom(orderId);
    }

    // Listen for status changes
    const handleOrderStatusChange = (data) => {
      if (data && (data.orderId === orderId || data.id === orderId || data._id === orderId)) {
        setOrderStatus({
          status: data.status,
          timestamp: data.timestamp || new Date().toISOString(),
        });
      }
    };

    const handleItemStatusChange = (data) => {
      if (data && (data.orderId === orderId || data.id === orderId)) {
        setItemStatuses((prev) => ({
          ...prev,
          [data.itemId]: {
            itemName: data.itemName,
            status: data.status,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        }));
      }
    };

    const handleConnectionChange = (state) => {
      setConnectionState(state);
      setIsConnected(state === 'connected');
    };

    socketService.onOrderStatusChanged(handleOrderStatusChange);
    socketService.onItemStatusChanged(handleItemStatusChange);
    socketService.onConnectionChange(handleConnectionChange);

    return () => {
      socketService.offOrderStatusChanged(handleOrderStatusChange);
      socketService.offItemStatusChanged(handleItemStatusChange);
      socketService.offConnectionChange(handleConnectionChange);

      if (orderId) {
        socketService.leaveOrderRoom(orderId);
      }
    };
  }, [orderId, sessionToken]);

  return {
    orderStatus,
    itemStatuses,
    isConnected,
    connectionState,
  };
};

export default useOrderTracking;
