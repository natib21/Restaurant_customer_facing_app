import { useEffect, useState } from 'react';
import { useOrderTracking } from '../hooks/useOrderTracking';
import { getOrderUrl } from '../url/url';

/**
 * Standard OrderTracking component as per Socket.IO Integration Guide
 */
const OrderTracking = ({ orderId, sessionToken }) => {
  const token = sessionToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('sessionToken') : null);
  const { orderStatus, itemStatuses, isConnected } = useOrderTracking(orderId, token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId && token));

  // Fetch initial order details
  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(getOrderUrl(orderId), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data && (data.success || data.data) && isMounted) {
          setOrder(data.data?.order || data.data || data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        // Fallback to localStorage cache
        try {
          const stored = localStorage.getItem('recentOrders');
          if (stored && isMounted) {
            const list = JSON.parse(stored);
            const found = list.find((o) => (o.id || o._id) === orderId);
            if (found) setOrder(found);
          }
        } catch {
          // ignore
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (orderId && token) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId, token]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeeb] text-[#3f4943]">
        <div className="w-8 h-8 border-3 border-[#005136] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium">Loading live order tracking...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeeb] text-[#3f4943]">
        <p className="text-sm font-medium text-[#ba1a1a]">Order not found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const colors = {
      pending: '#fea619',
      accepted: '#005136',
      preparing: '#fe8219',
      ready: '#006c49',
      served: '#005136',
      completed: '#005136',
      cancelled: '#ba1a1a',
      canceled: '#ba1a1a',
    };
    return colors[normalized] || '#6f7a72';
  };

  const getStatusLabel = (status) => {
    const normalized = (status || 'pending').toLowerCase();
    const labels = {
      pending: 'Order Placed',
      accepted: 'Accepted by Kitchen',
      preparing: 'Being Prepared',
      ready: 'Ready to Serve',
      served: 'Served',
      completed: 'Completed',
      cancelled: 'Cancelled',
      canceled: 'Cancelled',
    };
    return labels[normalized] || status || 'Pending';
  };

  const currentStatus = (orderStatus?.status || order.status || 'pending').toLowerCase();
  const tableNum = order.table?.tableNumber || order.tableNumber || order.table || 'Table';

  return (
    <div className="p-5 bg-[#faf9f6] rounded-2xl border border-[#efeeeb] space-y-4">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-[#1a1c1a]">
            Order #{order.orderNumber || String(order.id || order._id || '').slice(-6).toUpperCase()}
          </h2>
          <p className="text-xs text-[#3f4943] mt-0.5">
            Table: {tableNum}
          </p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-[#efeeeb]">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#006c49] animate-pulse' : 'bg-[#ba1a1a]'
              }`}
            />
            <span className={isConnected ? 'text-[#006c49]' : 'text-[#ba1a1a]'}>
              {isConnected ? 'Live Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Order Status */}
      <div
        className="p-4 bg-white rounded-xl shadow-xs border-l-4 transition-all"
        style={{ borderLeftColor: getStatusColor(currentStatus) }}
      >
        <h3 className="text-xs font-bold text-[#3f4943] uppercase tracking-wider">
          Order Status
        </h3>
        <p className="text-base sm:text-lg font-bold text-[#1a1c1a] mt-1">
          {getStatusLabel(currentStatus)}
        </p>
        {orderStatus?.timestamp && (
          <p className="text-[11px] text-[#6f7a72] mt-1">
            Updated: {new Date(orderStatus.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Item-Level Status */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#1a1c1a]">Your Items</h3>
          <div className="space-y-2">
            {order.items.map((item, idx) => {
              const itemId = item._id || item.id || item.menuItemId || `item-${idx}`;
              const itemStatusObj = itemStatuses[itemId] || {};
              const itemStatus = itemStatusObj.status || item.status || 'pending';

              return (
                <div
                  key={itemId}
                  className="p-3 bg-white rounded-xl shadow-xs border-l-4 flex justify-between items-center"
                  style={{ borderLeftColor: getStatusColor(itemStatus) }}
                >
                  <div>
                    <p className="font-semibold text-sm text-[#1a1c1a]">
                      {item.menuItem?.name || item.name} x {item.quantity || 1}
                    </p>
                    <p className="text-xs text-[#6f7a72] mt-0.5">
                      {(Number(item.totalPrice || item.price || 0)).toFixed(2)} ETB
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#efeeeb] text-[#1a1c1a]">
                      {getStatusLabel(itemStatus)}
                    </span>
                    {itemStatusObj.timestamp && (
                      <p className="text-[10px] text-[#6f7a72] mt-1">
                        {new Date(itemStatusObj.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="p-4 bg-white rounded-xl shadow-xs space-y-1.5 text-sm">
        <h4 className="font-bold text-xs uppercase text-[#3f4943]">Summary</h4>
        {order.subtotal != null && (
          <div className="flex justify-between text-[#3f4943]">
            <span>Subtotal</span>
            <span>{Number(order.subtotal).toFixed(2)} ETB</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-[#1a1c1a] pt-1 border-t border-[#efeeeb]">
          <span>Total</span>
          <span className="text-[#005136]">
            {Number(order.totalAmount || order.total || 0).toFixed(2)} ETB
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
