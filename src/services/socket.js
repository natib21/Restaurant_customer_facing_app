import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.connectionState = 'disconnected'; // 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
    this.sessionToken = null;
    this.joinedRooms = new Set();
    this.connectionListeners = new Set();
  }

  /**
   * Connect to WebSocket server using customer session token
   * @param {string} sessionToken - JWT or session token from QR login
   */
  connect(sessionToken) {
    if (this.socket && this.isConnected && this.sessionToken === sessionToken) {
      return;
    }

    if (this.socket && this.sessionToken !== sessionToken) {
      this.disconnect();
    }

    this.sessionToken = sessionToken;
    this.setConnectionState('connecting');

    const backendUrl =
      (typeof window !== 'undefined' && window.__BACKEND_URL__) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) 

    this.socket = io(backendUrl, {
      auth: {
        sessionToken: sessionToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
      timeout: 20000,
    });

    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server. Socket ID:', this.socket.id);
      this.isConnected = true;
      this.setConnectionState('connected');

      // Re-join previously registered rooms on reconnect
      this.joinedRooms.forEach((orderId) => {
        this.socket.emit('order:join', { orderId });
        console.log(`Re-joined order room after reconnect: ${orderId}`);
      });
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      console.warn('❌ WebSocket connection error:', error.message || error);
      this.isConnected = false;
      this.setConnectionState('reconnecting');
    });

    // Reconnecting attempt
    this.socket.on('reconnect_attempt', () => {
      this.setConnectionState('reconnecting');
    });

    this.socket.on('reconnect', () => {
      this.isConnected = true;
      this.setConnectionState('connected');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed');
      this.isConnected = false;
      this.setConnectionState('disconnected');
    });

    // Disconnected
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket server:', reason);
      this.isConnected = false;
      this.setConnectionState('disconnected');
    });
  }

  setConnectionState(state) {
    this.connectionState = state;
    this.connectionListeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('Error in connection listener:', err);
      }
    });
  }

  onConnectionChange(callback) {
    if (typeof callback === 'function') {
      this.connectionListeners.add(callback);
      callback(this.connectionState);
    }
  }

  offConnectionChange(callback) {
    this.connectionListeners.delete(callback);
  }

  /**
   * Join a specific order room to receive updates
   * @param {string} orderId - Order ID
   */
  joinOrderRoom(orderId) {
    if (!orderId) return;
    this.joinedRooms.add(orderId);

    if (this.socket && this.isConnected) {
      this.socket.emit('order:join', { orderId });
      console.log(`📡 Emitted order:join for room: ${orderId}`);
    }
  }

  /**
   * Leave a specific order room
   * @param {string} orderId - Order ID
   */
  leaveOrderRoom(orderId) {
    if (!orderId) return;
    this.joinedRooms.delete(orderId);
    if (this.socket && this.isConnected) {
      this.socket.emit('order:leave', { orderId });
    }
  }

  /**
   * Listen for order status changes
   * @param {function} callback - Function called with { orderId, status, timestamp }
   */
  onOrderStatusChanged(callback) {
    if (!this.socket) return;
    this.socket.on('order:status_changed', callback);
  }

  /**
   * Remove listener for order status changes
   */
  offOrderStatusChanged(callback) {
    if (!this.socket) return;
    this.socket.off('order:status_changed', callback);
  }

  /**
   * Listen for item-level status changes
   * @param {function} callback - Function called with { orderId, itemId, itemName, status, timestamp }
   */
  onItemStatusChanged(callback) {
    if (!this.socket) return;
    this.socket.on('order:item_status_changed', callback);
  }

  /**
   * Remove listener for item status changes
   */
  offItemStatusChanged(callback) {
    if (!this.socket) return;
    this.socket.off('order:item_status_changed', callback);
  }

  /**
   * Listen for new order notification
   */
  onOrderNew(callback) {
    if (!this.socket) return;
    this.socket.on('order:new', callback);
  }

  /**
   * Remove listener for new order notification
   */
  offOrderNew(callback) {
    if (!this.socket) return;
    this.socket.off('order:new', callback);
  }

  /**
   * Disconnect socket and clear state
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.sessionToken = null;
      this.joinedRooms.clear();
      this.setConnectionState('disconnected');
    }
  }
}

const socketService = new SocketService();
export default socketService;
