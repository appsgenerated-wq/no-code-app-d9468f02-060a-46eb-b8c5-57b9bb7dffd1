import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants.js';
import { ArrowLeftOnRectangleIcon, ShoppingBagIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Using useCallback to memoize functions and prevent re-renders
  const loadOwnerData = useCallback(async () => {
    const response = await manifest.from('Restaurant').find({ filter: { ownerId: user.id }, include: ['owner'] });
    setRestaurants(response.data);
  }, [manifest, user.id]);

  const loadCustomerData = useCallback(async () => {
    const [restaurantsResponse, ordersResponse] = await Promise.all([
      manifest.from('Restaurant').find({ include: ['owner'] }),
      manifest.from('Order').find({ filter: { customerId: user.id }, include: ['menuItems'] })
    ]);
    setRestaurants(restaurantsResponse.data);
    setOrders(ordersResponse.data);
  }, [manifest, user.id]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (user.role === 'owner') {
        await loadOwnerData();
      } else if (user.role === 'customer') {
        await loadCustomerData();
      }
      setIsLoading(false);
    };
    fetchData();
  }, [user.role, loadOwnerData, loadCustomerData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className='flex items-center space-x-3'>
            <ShoppingBagIcon className="h-8 w-8 text-indigo-600" />
            <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome, {user.name}!</h1>
                <p className='text-sm text-gray-500 capitalize'>{user.role} Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-500 transition-colors">Admin Panel</a>
            <button onClick={onLogout} className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? <p>Loading data...</p> :
          user.role === 'owner' ? <OwnerDashboard user={user} manifest={manifest} initialRestaurants={restaurants} refreshData={loadOwnerData} /> :
          user.role === 'customer' ? <CustomerDashboard user={user} manifest={manifest} restaurants={restaurants} initialOrders={orders} refreshData={loadCustomerData} /> :
          <p>Welcome, Admin! Use the Admin Panel to manage the platform.</p>
        }
      </main>
    </div>
  );
};

// --- OWNER COMPONENTS ---
const OwnerDashboard = ({ user, manifest, initialRestaurants, refreshData }) => {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  useEffect(() => setRestaurants(initialRestaurants), [initialRestaurants]);

  const handleCreateRestaurant = async (data) => {
    await manifest.from('Restaurant').create(data);
    refreshData();
  };

  return (
    <div className='space-y-8'>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Create a New Restaurant</h2>
        <RestaurantForm onSubmit={handleCreateRestaurant} />
      </div>
      <div className='space-y-6'>
        <h2 className='text-2xl font-semibold text-gray-800'>Your Restaurants</h2>
        {restaurants.length > 0 ? restaurants.map(r => (
          <RestaurantManager key={r.id} restaurant={r} manifest={manifest} refreshData={refreshData} user={user} />
        )) : <p className='text-gray-500'>You haven't added any restaurants yet.</p>}
      </div>
    </div>
  );
}

const RestaurantManager = ({ restaurant, manifest, refreshData, user }) => {
  const [menuItems, setMenuItems] = useState([]);

  const loadMenuItems = useCallback(async () => {
    const response = await manifest.from('MenuItem').find({ filter: { restaurantId: restaurant.id }});
    setMenuItems(response.data);
  }, [manifest, restaurant.id]);

  useEffect(() => { loadMenuItems() }, [loadMenuItems]);

  const handleCreateMenuItem = async (data) => {
    await manifest.from('MenuItem').create({ ...data, restaurantId: restaurant.id, ownerId: user.id });
    loadMenuItems();
  }

  const handleDeleteMenuItem = async (itemId) => {
    if(window.confirm('Are you sure?')) {
        await manifest.from('MenuItem').delete(itemId);
        loadMenuItems();
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow space-y-6'>
      <h3 className='text-xl font-bold text-indigo-700'>{restaurant.name}</h3>
      <div>
        <h4 className='font-semibold text-gray-700 mb-2'>Add Menu Item</h4>
        <MenuItemForm onSubmit={handleCreateMenuItem} />
      </div>
      <div>
        <h4 className='font-semibold text-gray-700 mb-4'>Current Menu</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {menuItems.map(item => (
            <div key={item.id} className='border p-4 rounded-md flex justify-between items-start'>
                <div>
                    <p className='font-bold'>{item.name}</p>
                    <p className='text-sm text-gray-600'>{item.description}</p>
                    <p className='text-green-600 font-semibold'>${item.price}</p>
                </div>
                <button onClick={() => handleDeleteMenuItem(item.id)} className='text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100'>
                    <TrashIcon className='h-5 w-5' />
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const RestaurantForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-4 items-end'>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Restaurant Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap">Add Restaurant</button>
    </form>
  )
}

const MenuItemForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, price: parseFloat(price) });
    setName(''); setDescription(''); setPrice('');
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col md:flex-row gap-4 items-end'>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Item Name" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"/>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 whitespace-nowrap">Add Item</button>
    </form>
  )
}

// --- CUSTOMER COMPONENTS ---
const CustomerDashboard = ({ user, manifest, restaurants, initialOrders, refreshData }) => {
    const [orders, setOrders] = useState(initialOrders);
    const [cart, setCart] = useState([]);
    
    useEffect(() => setOrders(initialOrders), [initialOrders]);

    const addToCart = (item) => {
        setCart(currentCart => [...currentCart, item]);
    }

    const placeOrder = async () => {
        if(cart.length === 0) return alert('Your cart is empty!');
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        const menuItemIds = cart.map(item => item.id);

        await manifest.from('Order').create({
            totalPrice,
            menuItems: { connect: menuItemIds },
            customerId: user.id
        });
        alert('Order placed successfully!');
        setCart([]);
        refreshData();
    }

    return (
        <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-6'>
                <h2 className='text-2xl font-semibold text-gray-800'>Restaurants</h2>
                {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} manifest={manifest} onAddToCart={addToCart} />)}
            </div>
            <div className='space-y-6'>
                <div className='bg-white p-6 rounded-lg shadow sticky top-24'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-800'>Your Cart ({cart.length})</h2>
                    <div className='space-y-2 mb-4 max-h-60 overflow-y-auto'>
                        {cart.map((item, index) => <p key={index} className='text-sm flex justify-between'><span>{item.name}</span><span className='font-medium'>${item.price.toFixed(2)}</span></p>)}
                    </div>
                    <div className='border-t pt-4 space-y-4'>
                        <p className='font-bold text-lg flex justify-between'><span>Total</span><span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span></p>
                        <button onClick={placeOrder} className='w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition'>Place Order</button>
                    </div>
                </div>
                <div className='bg-white p-6 rounded-lg shadow'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-800'>Your Orders</h2>
                    <div className='space-y-4'>
                        {orders.map(order => (
                            <div key={order.id} className='border-b pb-2'>
                                <p className='font-semibold'>Order #{order.id} - ${order.totalPrice.toFixed(2)}</p>
                                <p className='text-sm text-gray-500'>Status: <span className='font-medium text-indigo-600 capitalize'>{order.status}</span></p>
                                <p className='text-xs text-gray-500'>{order.menuItems.map(i => i.name).join(', ')}</p>
                            </div>
                        ))}
                        {orders.length === 0 && <p className='text-sm text-gray-500'>No past orders.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const RestaurantCard = ({ restaurant, manifest, onAddToCart }) => {
    const [menuItems, setMenuItems] = useState([]);
    useEffect(() => {
        const loadMenu = async () => {
            const response = await manifest.from('MenuItem').find({ filter: { restaurantId: restaurant.id }});
            setMenuItems(response.data);
        }
        loadMenu();
    }, [manifest, restaurant.id]);

    return (
        <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-xl font-bold text-indigo-700'>{restaurant.name}</h3>
            <p className='text-sm text-gray-600 mb-4'>{restaurant.description}</p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {menuItems.map(item => (
                    <div key={item.id} className='border p-3 rounded-md flex justify-between items-center'>
                        <div>
                            <p className='font-semibold'>{item.name}</p>
                            <p className='text-sm text-green-600'>${item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => onAddToCart(item)} className='text-indigo-600 p-1 rounded-full hover:bg-indigo-100'>
                            <PlusCircleIcon className='h-6 w-6'/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardPage;
