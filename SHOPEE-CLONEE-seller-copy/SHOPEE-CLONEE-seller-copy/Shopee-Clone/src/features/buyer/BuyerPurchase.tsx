import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, RotateCw } from 'lucide-react';
import BuyerNavbar from './components/BuyerNavbar';
import BuyerFooter from './components/BuyerFooter';
import { useOrders, OrderStatus } from '../../contexts/OrderContext';

const BuyerPurchase: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  React.useEffect(() => {
    // Add style to make navbar static on this page
    const style = document.createElement('style');
    style.textContent = `
      .buyer-purchase-page nav {
        position: relative !important;
        top: auto !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const tabs: { label: string; value: OrderStatus; color: string }[] = [
    { label: 'All', value: 'all', color: 'text-gray-600' },
    { label: 'To Pay', value: 'to-pay', color: 'text-shopee-orange' },
    { label: 'To Ship', value: 'to-ship', color: 'text-blue-500' },
    { label: 'To Receive', value: 'to-receive', color: 'text-purple-500' },
    { label: 'Completed', value: 'completed', color: 'text-green-500' },
    { label: 'Cancelled', value: 'cancelled', color: 'text-red-500' },
    { label: 'Return Refund', value: 'return-refund', color: 'text-yellow-500' },
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const handlePayNow = (orderId: string) => {
    // Payment is processed by seller, so we just move to 'to-ship'
    updateOrderStatus(orderId, 'to-ship');
  };

  const handleRiderPickup = (orderId: string) => {
    // Simulate rider pickup - move from 'to-ship' to 'to-receive'
    updateOrderStatus(orderId, 'to-receive');
  };

  const handleConfirmDelivery = (orderId: string) => {
    // Simulate delivery confirmation - move from 'to-receive' to 'completed'
    updateOrderStatus(orderId, 'completed');
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'to-pay':
        return <Package size={18} className="text-shopee-orange" />;
      case 'to-ship':
        return <Package size={18} className="text-blue-500" />;
      case 'to-receive':
        return <Truck size={18} className="text-purple-500" />;
      case 'completed':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={18} className="text-red-500" />;
      case 'return-refund':
        return <RotateCw size={18} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'to-pay':
        return 'To Pay';
      case 'to-ship':
        return 'To Ship';
      case 'to-receive':
        return 'To Receive';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'return-refund':
        return 'Return/Refund';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col buyer-purchase-page">
      {/* Navbar - Static (not sticky) */}
      <BuyerNavbar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Sticky Tab Bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1200px] mx-auto px-5">
            <div className="flex items-center gap-8 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.value
                      ? 'text-shopee-orange border-shopee-orange'
                      : 'text-gray-600 border-transparent hover:text-gray-800 border-b-2'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="max-w-[1200px] mx-auto px-5 py-8">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <Package size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {order.product.image.startsWith('http') || order.product.image.startsWith('/') ? (
                          <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">{order.product.image}</span>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate mb-2">{order.product.fullName || order.product.name}</h3>
                      {order.paymentMethod && (
                        <p className="text-xs text-gray-500 mb-1">
                          Payment: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mb-2">Order ID: {order.id}</p>
                      <p className="text-sm text-gray-500">Order Date: {order.date}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Quantity: <span className="font-medium">{order.quantity}</span>
                      </p>
                    </div>

                      {/* Status Badge */}
                    <div className="flex-shrink-0 text-right">
                      <div className="flex items-center gap-2 mb-4 justify-end">
                        {getStatusIcon(order.status)}
                        <span className={`text-sm font-medium`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total Price</p>
                        <p className="text-xl font-bold text-shopee-orange">₱{order.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {order.status === 'to-pay' && (
                        <button 
                          onClick={() => handlePayNow(order.id)}
                          className="px-6 py-2 bg-shopee-orange text-white rounded text-sm font-medium hover:bg-shopee-orange-dark transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      {order.status === 'to-ship' && (
                        <button 
                          onClick={() => handleRiderPickup(order.id)}
                          className="px-6 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          Rider Picked Up
                        </button>
                      )}
                      {order.status === 'to-receive' && (
                        <button 
                          onClick={() => handleConfirmDelivery(order.id)}
                          className="px-6 py-2 bg-shopee-orange text-white rounded text-sm font-medium hover:bg-shopee-orange-dark transition-colors"
                        >
                          Confirm Delivery
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <button className="px-6 py-2 border border-shopee-orange text-shopee-orange rounded text-sm font-medium hover:bg-orange-50 transition-colors">
                          Review
                        </button>
                      )}
                      {order.status === 'return-refund' && (
                        <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                          View Status
                        </button>
                      )}
                      <button className="px-6 py-2 border border-gray-300 text-gray-600 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <BuyerFooter />
    </div>
  );
};

export default BuyerPurchase;
