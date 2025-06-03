import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, Search, Filter, Target, Users, 
  Calendar, MoreHorizontal, ArrowRight, Sparkles,
  ChevronDown, ChevronUp, RefreshCw, Play,
  Edit, Trash2, Copy
} from 'lucide-react';
import { format } from 'date-fns';

interface Segment {
  id: string;
  name: string;
  description: string;
  audienceSize: number;
  createdAt: Date;
  updatedAt: Date;
  lastCampaignDate: Date | null;
  rules: {
    type: 'group';
    combinator: 'AND' | 'OR';
    rules: any[];
  };
  isAiGenerated?: boolean;
}

const generateMockSegments = (): Segment[] => {
  const names = [
    'High Value Customers', 'Active Users', 'Inactive 90+ Days',
    'Discount Hunters', 'Weekend Shoppers', 'New Customers',
    'Loyalty Tier 1', 'Abandoned Carts', 'Mobile App Users',
    'Repeat Customers', 'Single Purchase Only', 'Product Viewers',
    'Email Subscribers', 'Birthday Month', 'Seasonal Shoppers'
  ];
  
  const descriptions = [
    'Customers who have spent over ₹10,000 in the last 90 days',
    'Users who have visited the site at least 3 times in the last 30 days',
    'Customers who haven\'t made a purchase in over 90 days',
    'Users who primarily purchase items on sale or with coupons',
    'Customers who tend to shop on weekends (Saturday/Sunday)',
    'Customers who made their first purchase in the last 30 days',
    'Top tier customers in our loyalty program',
    'Users who added items to cart but didn\'t checkout in the last 14 days',
    'Customers who primarily use our mobile app',
    'Customers who have made at least 3 purchases',
    'Customers who have only made a single purchase',
    'Users who viewed products but didn\'t purchase in the last 7 days',
    'Customers who are subscribed to our email newsletter',
    'Customers whose birthdays are in the current month',
    'Customers who shop primarily during holiday seasons'
  ];
  
  return Array.from({ length: 15 }, (_, i) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 90));
    
    const updatedAt = new Date(createdAt);
    updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 30));
    
    const lastCampaignDate = Math.random() > 0.3 ? 
      new Date(updatedAt.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) : 
      null;
    
    return {
      id: `segment-${i + 1}`,
      name: names[i % names.length],
      description: descriptions[i % descriptions.length],
      audienceSize: Math.floor(Math.random() * 1500) + 300,
      createdAt,
      updatedAt,
      lastCampaignDate,
      rules: {
        type: 'group',
        combinator: Math.random() > 0.5 ? 'AND' : 'OR',
        rules: []
      },
      isAiGenerated: i % 5 === 0
    };
  });
};

const Segments = () => {
  const location = useLocation();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [filteredSegments, setFilteredSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Segment>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<Segment | null>(null);
  
  useEffect(() => {
    // Simulate API call to get segments
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockSegments();
      setSegments(data);
      setFilteredSegments(data);
      setIsLoading(false);
      
      // Check if redirected from segment creation
      if (location.state?.segmentCreated) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    }, 1200);
  }, [location.state]);
  
  useEffect(() => {
    // Filter and sort segments based on search query
    let result = [...segments];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(segment => 
        segment.name.toLowerCase().includes(query) || 
        segment.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortField === 'lastCampaignDate' || sortField === 'createdAt' || sortField === 'updatedAt') {
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
    
    setFilteredSegments(result);
  }, [segments, searchQuery, sortField, sortDirection]);
  
  const handleSort = (field: keyof Segment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleDeleteClick = (segment: Segment) => {
    setSegmentToDelete(segment);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (segmentToDelete) {
      // Simulate API call to delete segment
      const updatedSegments = segments.filter(s => s.id !== segmentToDelete.id);
      setSegments(updatedSegments);
      setShowDeleteModal(false);
      setSegmentToDelete(null);
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
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-md flex items-start"
        >
          <div className="flex-shrink-0 mr-3">
            <svg className="h-5 w-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Segment created successfully!</p>
            <p className="text-sm mt-1">Your segment has been created and is ready to use in campaigns.</p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto -mx-1.5 -my-1.5 bg-success-50 text-success-500 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-success-100"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      )}
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customer Segments</h1>
        <Link
          to="/segments/create"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200"
        >
          <Plus size={18} className="mr-2" />
          Create Segment
        </Link>
      </div>
      
      {/* Search */}
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
              placeholder="Search segments..."
              className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filter
            </button>
          </div>
        </div>
      </div>
      
      {/* Segment grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSegments.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
            <div className="flex flex-col items-center">
              <Target size={48} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No segments found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search or create a new segment</p>
              <Link
                to="/segments/create"
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200"
              >
                <Plus size={18} className="mr-2" />
                Create Segment
              </Link>
            </div>
          </div>
        ) : (
          filteredSegments.map((segment) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 mr-2">{segment.name}</h3>
                      {segment.isAiGenerated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800">
                          <Sparkles size={12} className="mr-1" />
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{segment.description}</p>
                  </div>
                  
                  <div className="dropdown relative">
                    <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm text-gray-500">Audience Size</div>
                    <div className="text-lg font-semibold text-gray-900">{segment.audienceSize.toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Calendar size={12} className="mr-1" />
                    Updated {format(segment.updatedAt, 'MMM d, yyyy')}
                  </span>
                  
                  {segment.lastCampaignDate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      <Play size={12} className="mr-1" />
                      Last sent {format(segment.lastCampaignDate, 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleDeleteClick(segment)}
                    className="p-1.5 rounded text-gray-500 hover:text-error-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    <Edit size={16} />
                  </button>
                  <button className="p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    <Copy size={16} />
                  </button>
                </div>
                
                <Link
                  to="/campaigns"
                  className="inline-flex items-center px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-sm text-white rounded-md transition duration-200"
                >
                  <Play size={14} className="mr-1.5" />
                  Create Campaign
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Delete Segment</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 size={20} className="text-error-600" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Confirm Deletion</h4>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the segment "{segmentToDelete?.name}"? 
                This will permanently remove the segment and it cannot be recovered.
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                <p>This segment contains {segmentToDelete?.audienceSize.toLocaleString()} customers.</p>
                {segmentToDelete?.lastCampaignDate && (
                  <p className="mt-1">
                    Last campaign sent on {format(segmentToDelete.lastCampaignDate, 'MMMM d, yyyy')}.
                  </p>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-md transition duration-200 text-sm font-medium"
              >
                Delete Segment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Segments;