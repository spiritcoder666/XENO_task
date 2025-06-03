import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, Upload, Plus, 
  MoreHorizontal, ChevronDown, ChevronUp, 
  User, Mail, Calendar, DollarSign, ShoppingBag,
  RefreshCw, Eye, Clock, ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpend: number;
  orderCount: number;
  lastPurchase: Date | null;
  createdAt: Date;
  status: 'active' | 'inactive' | 'new';
  tags: string[];
}

const generateMockCustomers = (): Customer[] => {
  const statuses: Customer['status'][] = ['active', 'inactive', 'new'];
  const tags = [
    'High Value', 'Frequent Buyer', 'Discount Hunter', 
    'Mobile User', 'Desktop User', 'Newsletter',
    'Loyalty Program', 'First Purchase', 'Abandoned Cart'
  ];
  
  const firstNames = [
    'John', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa',
    'James', 'Jennifer', 'Robert', 'Maria', 'William', 'Linda',
    'Richard', 'Patricia', 'Joseph', 'Susan', 'Thomas', 'Jessica'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis',
    'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
    'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia'
  ];
  
  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 365));
    
    const lastPurchaseOffset = Math.floor(Math.random() * 90);
    const lastPurchase = lastPurchaseOffset < 60 ? 
      new Date(new Date().setDate(new Date().getDate() - lastPurchaseOffset)) : 
      null;
    
    const status = lastPurchase === null ? 
      'inactive' : 
      (new Date().getTime() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30) ? 
        'new' : 
        'active';
    
    const totalSpend = Math.floor(Math.random() * 15000) + 500;
    const orderCount = Math.floor(Math.random() * 20) + 1;
    
    // Randomly select 1-3 tags
    const customerTags = [];
    const tagCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < tagCount; j++) {
      const tag = tags[Math.floor(Math.random() * tags.length)];
      if (!customerTags.includes(tag)) {
        customerTags.push(tag);
      }
    }
    
    return {
      id: `cust-${i + 1}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: Math.random() > 0.3 ? `+1${Math.floor(Math.random() * 1000000000).toString().padStart(10, '0')}` : undefined,
      totalSpend,
      orderCount,
      lastPurchase,
      createdAt,
      status,
      tags: customerTags
    };
  });
};

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Customer['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Customer>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  useEffect(() => {
    // Simulate API call to get customers
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
      setIsLoading(false);
    }, 1200);
  }, []);
  
  useEffect(() => {
    // Filter and sort customers based on search query and filters
    let result = [...customers];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(customer => customer.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(customer => 
        customer.name.toLowerCase().includes(query) || 
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(query))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'lastPurchase' || sortField === 'createdAt') {
        const aValue = a[sortField] || new Date(0);
        const bValue = b[sortField] || new Date(0);
        
        return sortDirection === 'asc' 
          ? (aValue as Date).getTime() - (bValue as Date).getTime()
          : (bValue as Date).getTime() - (aValue as Date).getTime();
      }
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aString = String(aValue || '');
      const bString = String(bValue || '');
      
      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
    
    setFilteredCustomers(result);
  }, [customers, searchQuery, statusFilter, sortField, sortDirection]);
  
  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const getStatusBadgeClass = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'new':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const toggleCustomerDetails = (customer: Customer) => {
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(customer);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Upload size={16} className="mr-2" />
            Import
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200">
            <Plus size={16} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers by name, email, or phone..."
              className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Customer['status'] | 'all')}
                className="appearance-none bg-white pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              More Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Customer list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Customer
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('totalSpend')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Total Spend
                    {sortField === 'totalSpend' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('orderCount')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Orders
                    {sortField === 'orderCount' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('lastPurchase')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Last Purchase
                    {sortField === 'lastPurchase' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Created
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <User size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <>
                    <tr 
                      key={customer.id} 
                      className={`hover:bg-gray-50 ${selectedCustomer?.id === customer.id ? 'bg-gray-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden mr-3">
                            <User size={20} className="text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{customer.totalSpend.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.orderCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {customer.lastPurchase ? format(customer.lastPurchase, 'MMM d, yyyy') : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(customer.createdAt, 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleCustomerDetails(customer)}
                            className={`p-1.5 rounded-md transition-colors ${
                              selectedCustomer?.id === customer.id
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
                            }`}
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedCustomer?.id === customer.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-md bg-white border border-gray-200 shadow-sm overflow-hidden"
                          >
                            <div className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Customer Details
                                  </h3>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-start">
                                      <User size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Name</div>
                                        <div className="text-sm text-gray-900">{customer.name}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                      <Mail size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Email</div>
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                      </div>
                                    </div>
                                    
                                    {customer.phone && (
                                      <div className="flex items-start">
                                        <Phone size={16} className="mt-0.5 mr-3 text-gray-500" />
                                        <div>
                                          <div className="text-sm font-medium text-gray-700">Phone</div>
                                          <div className="text-sm text-gray-900">{customer.phone}</div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-start">
                                      <Calendar size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Customer Since</div>
                                        <div className="text-sm text-gray-900">
                                          {format(customer.createdAt, 'MMMM d, yyyy')}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {customer.tags.length > 0 && (
                                      <div className="flex items-start pt-2">
                                        <div className="mt-0.5 mr-3 w-4"></div>
                                        <div>
                                          <div className="text-sm font-medium text-gray-700 mb-1">Tags</div>
                                          <div className="flex flex-wrap gap-1">
                                            {customer.tags.map((tag, index) => (
                                              <span 
                                                key={index}
                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800"
                                              >
                                                {tag}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Purchase History
                                  </h3>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-start">
                                      <DollarSign size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Total Spend</div>
                                        <div className="text-sm text-gray-900">₹{customer.totalSpend.toLocaleString()}</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                      <ShoppingBag size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Order Count</div>
                                        <div className="text-sm text-gray-900">{customer.orderCount} orders</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                      <Clock size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Last Purchase</div>
                                        <div className="text-sm text-gray-900">
                                          {customer.lastPurchase 
                                            ? format(customer.lastPurchase, 'MMMM d, yyyy')
                                            : 'No purchases yet'}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                      <RefreshCw size={16} className="mt-0.5 mr-3 text-gray-500" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-700">Average Order Value</div>
                                        <div className="text-sm text-gray-900">
                                          {customer.orderCount > 0 
                                            ? `₹${Math.round(customer.totalSpend / customer.orderCount).toLocaleString()}`
                                            : '₹0'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Orders</h4>
                                    
                                    {customer.orderCount > 0 ? (
                                      <div className="space-y-2">
                                        {Array.from({ length: Math.min(3, customer.orderCount) }, (_, i) => {
                                          const orderDate = new Date(
                                            customer.lastPurchase || new Date()
                                          );
                                          orderDate.setDate(orderDate.getDate() - i * 15);
                                          
                                          return (
                                            <div key={i} className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                                              <div>
                                                <div className="text-xs font-medium">Order #{(10000 + i).toString()}</div>
                                                <div className="text-xs text-gray-500">{format(orderDate, 'MMM d, yyyy')}</div>
                                              </div>
                                              <div className="text-sm font-medium">
                                                ₹{(Math.floor(Math.random() * 5000) + 500).toLocaleString()}
                                              </div>
                                            </div>
                                          );
                                        })}
                                        
                                        <button className="mt-1 text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center">
                                          View all orders
                                          <ArrowRight size={12} className="ml-1" />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-gray-500">No orders yet</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Campaign History
                                  </h3>
                                  
                                  <div className="space-y-2">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="flex justify-between items-center mb-1">
                                        <div className="text-sm font-medium">Summer Collection</div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                          Opened
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">Sent on {format(new Date(new Date().setDate(new Date().getDate() - 5)), 'MMM d, yyyy')}</div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="flex justify-between items-center mb-1">
                                        <div className="text-sm font-medium">Spring Sale</div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                                          Clicked
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">Sent on {format(new Date(new Date().setDate(new Date().getDate() - 20)), 'MMM d, yyyy')}</div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="flex justify-between items-center mb-1">
                                        <div className="text-sm font-medium">Winter Promotion</div>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          Not Opened
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">Sent on {format(new Date(new Date().setDate(new Date().getDate() - 45)), 'MMM d, yyyy')}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Segment Membership</h4>
                                    
                                    <div className="space-y-2">
                                      <div className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                                        <div className="text-sm">High Value Customers</div>
                                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                                      </div>
                                      
                                      <div className="bg-gray-50 p-2 rounded-md flex justify-between items-center">
                                        <div className="text-sm">Recent Purchasers</div>
                                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                                      </div>
                                      
                                      <div className="bg-gray-50 p-2 rounded-md flex justify-between items-center opacity-50">
                                        <div className="text-sm">Inactive Customers</div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                                <div className="flex gap-2">
                                  <button className="px-3 py-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium">
                                    Edit Customer
                                  </button>
                                  <button className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition duration-200">
                                    Create Campaign
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowUploadModal(false)}></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Import Customers</h3>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Upload size={32} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop a CSV file here, or click to browse
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".csv"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                >
                  Select File
                </label>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p className="font-medium mb-1">File requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>CSV format with headers</li>
                  <li>Required columns: name, email</li>
                  <li>Optional: phone, tags, total_spend, orders</li>
                  <li>Maximum 5,000 records per import</li>
                </ul>
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium block mt-2">
                  Download sample template
                </a>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200 text-sm font-medium">
                Upload & Import
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Customers;