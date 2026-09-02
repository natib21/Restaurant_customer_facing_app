import React from "react";

function OrderList({ orderPayload, tableNumber }) {
  const { items = [], totalAmount = 0 } = orderPayload || {};

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500 border border-gray-100">
        No items in your order yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Summary</h2>
          <p className="text-xs text-gray-500">Please review your items before confirming</p>
        </div>
        {tableNumber && (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-full">
            Table {tableNumber}
          </span>
        )}
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left text-xs uppercase tracking-wider">
              <th className="px-3 py-2.5 font-semibold">Item</th>
              <th className="px-3 py-2.5 font-semibold text-center">Qty</th>
              <th className="px-3 py-2.5 font-semibold text-right">Price</th>
              <th className="px-3 py-2.5 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                <td className="px-3 py-3 font-medium text-gray-900">
                  {item.name || `Item #${index + 1}`}
                  {item.notes ? (
                    <span className="block text-[11px] text-gray-500 italic mt-0.5">Note: {item.notes}</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-center text-gray-700 font-semibold">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-right text-gray-600">
                  ETB {item.unitPrice.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-right font-bold text-gray-900">
                  ETB {item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Grand Total</span>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-extrabold text-amber-600">
            ETB {totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderList;