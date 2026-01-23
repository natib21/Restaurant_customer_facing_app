import React from "react";

function OrderList({ orderPayload }) {
  const { items = [], customer = 0, totalAmount = 0 } = orderPayload || {};

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        No items in your order yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Summary</h2>
      
      {customer && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-amber-500 font-medium">
            Logged in as customer: <span className="font-bold">{customer}</span>
          </p>
        </div>
      )}

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-stone-700 border-b">
                Quantity
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-stone-700 border-b">
                Unit Price
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-stone-700 border-b">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {item.unitPrice.toFixed(2)} <span>ETB</span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b font-regular">
                  {item.totalPrice.toFixed(2)} <span>ETB</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-4 text-right">
        {/* <div>
          <p className="text-lg text-gray-700">Subtotal:</p>
          <p className="text-xl font-bold text-gray-900">ETB {subtotal.toFixed(2)}</p>
        </div> */}
        <div>
          <p className="text-lg text-gray-700">Total:</p>
          <p className="text-xl font-bold text-green-600">ETB {totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderList;