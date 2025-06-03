import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Filter, Search, 
  Plus, RefreshCw, Mail, Eye, ArrowUpRight, 
  MoreHorizontal, Sparkles, FileText, Calendar,
  Check, X, ArrowRight, Clock, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface Campaign {
  id: string;
  name: string;
  segmentName: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdAt: Date;
  sentAt: Date | null;
  audience: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  aiTags?: string[];
  aiInsights?: string;
}

const generateMockCampaigns = (): Campaign[] => {
  const statuses: Campaign['status'][] = ['draft', 'scheduled', 'sending', 'sent', 'failed'];
  
  const campaignNames = [
    'Summer Collection', 'Spring Sale', 'New Arrivals', 
    'Flash Sale', 'Holiday Special', 'Weekend Discount',
    'Loyalty Program', 'Customer Appreciation', 'Product Launch',
    'Re-engagement', 'Welcome Series', 'Limited Offer',
    'Exclusive Preview', 'Feedback Request', 'Abandoned Cart'
  ];
  
  const segmentNames = [
    'High Value Customers', 'Active Users', 'New Customers',
    'Inactive 90+ Days', 'Weekend Shoppers', 'Mobile App Users',
    'Loyalty Tier 1', 'Repeat Customers', 'One-time Buyers',
    'Cart Abandoners', 'Newsletter Subscribers', 'Birthday Month',
    'Recent Product Viewers', 'High CLV Segment', 'Discount Hunters'
  ];
  
  const aiTags = [
    'Win-back', 'Engagement', 'Promotional',
    'Loyalty', 'Seasonal', 'Educational',
    'Transactional', 'Retention', 'Acquisition',
    'Special Offer', 'Event', 'Product-focused'
  ];
  
  const aiInsights = [
    'This campaign had a 78% open rate, 15% higher than your average. Subject lines with emojis performed best.',
    'Customers who spent over ₹10K had a 95% delivery rate. Consider creating more premium offers for this segment.',
    'This re-engagement campaign brought back 23% of inactive customers. Timing was optimal at Tuesday morning.',
    'Weekend delivery of this campaign showed 32% higher click rates than weekday delivery for similar content.',
    'Personalized subject lines improved open rates by 18% compared to generic alternatives.',
    'Users from metro cities showed 27% higher engagement with this campaign compared to other regions.',
    'This campaign saw a 12% conversion rate, outperforming similar campaigns by 5% on average.',
    'Product recommendations in this campaign had 3.5x higher click-through rates than static content.',
    'Mobile users engaged 41% more with this campaign than desktop users. Consider optimizing for mobile.',
    'First-time customers responded particularly well, with 38% making a repeat purchase within 14 days.'
  ];
  
  return Array.from({ length: 15 }, (_, i) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
    
    const status = i < 10 ? 'sent' : statuses[Math.floor(Math.random() * statuses.length)];
    const sentAt = status === 'sent' ? new Date(createdAt.getTime() + 86400000) : null;
    
    const audience = Math.floor(Math.random() * 1000) + 500;
    const sent = status === 'sent' ? audience : 0;
    const delivered = sent > 0 ? Math.floor(sent * (0.9 + Math.random() * 0.1)) : 0;
    const opened = delivered > 0 ? Math.floor(delivered * (0.4 + Math.random() * 0.4)) : 0;
    const clicked = opened > 0 ? Math.floor(opened * (0.1 + Math.random() * 0.3)) : 0;
    const failed = sent > 0 ? sent - delivered : 0;
    
    return {
      id: `campaign-${i + 1}`,
      name: campaignNames[i % campaignNames.length],
      segmentName: segmentNames[i % segmentNames.length],
      status,
      createdAt,
      sentAt,
      audience,
      sent,
      delivered,
      opened,
      clicked,
      failed,
      aiTags: status === 'sent' ? [
        aiTags[Math.floor(Math.random() * aiTags.length)],
        aiTags[Math.floor(Math.random() * aiTags.length)]
      ] : undefined,
      aiInsights: status === 'sent' ? aiInsights[i % aiInsights.length] : undefined
    };
  });
};

const Campaigns = () => {
  const location = useLocation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Campaign['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Campaign>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  useEffect(() => {
    // Simulate API call to get campaigns
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockCampaigns();
      setCampaigns(data);
      setIsLoading(false);
      
      // Check if redirected from segment creation
      if (location.state?.segmentCreated) {
        // Show notification or any feedback to user
        console.log('Segment created successfully, campaign initiated!');
      }
    }, 1200);
  }, [location.state]);
  
  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredCampaigns = campaigns
    .filter(campaign => 
      (statusFilter === 'all' || campaign.status === statusFilter) &&
      (campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       campaign.segmentName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'createdAt' || sortField === 'sentAt') {
        const aValue = a[sortField] || new Date(0);
        const bValue = b[sortField] || new Date(0);
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
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
  
  const getStatusBadgeClass = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-primary-100 text-primary-800';
      case 'sending':
        return 'bg-warning-100 text-warning-800';
      case 'sent':
        return 'bg-success-100 text-success-800';
      case 'failed':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return <FileText size={14} />;
      case 'scheduled':
        return <Calendar size={14} />;
      case 'sending':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'sent':
        return <Check size={14} />;
      case 'failed':
        return <X size={14} />;
      default:
        return null;
    }
  };
  
  const toggleCampaignInsights = (campaign: Campaign) => {
    if (selectedCampaign?.id === campaign.id) {
      setSelectedCampaign(null);
    } else {
      setSelectedCampaign(campaign);
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
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="/segments/create"
          className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200"
        >
          <Plus size={18} className="mr-2" />
          Create Campaign
        </Link>
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
              placeholder="Search campaigns..."
              className="block w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Campaign['status'] | 'all')}
                className="appearance-none bg-white pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown size={16} className="text-gray-500" />
              </div>
            </div>
            
            <button
              onClick={() => setShowAiInsights(!showAiInsights)}
              className={`inline-flex items-center px-3 py-2 rounded-md border ${
                showAiInsights 
                  ? 'bg-primary-50 text-primary-600 border-primary-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Sparkles size={16} className={`mr-2 ${showAiInsights ? 'text-primary-500' : 'text-gray-500'}`} />
              AI Insights
            </button>
          </div>
        </div>
      </div>
      
      {/* Campaign list */}
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
                    Campaign
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('segmentName')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Segment
                    {sortField === 'segmentName' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('audience')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Audience
                    {sortField === 'audience' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('delivered')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Delivered
                    {sortField === 'delivered' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('opened')}
                    className="flex items-center gap-1 focus:outline-none"
                  >
                    Opened
                    {sortField === 'opened' && (
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
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Mail size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No campaigns found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <>
                    <tr 
                      key={campaign.id} 
                      className={`hover:bg-gray-50 ${selectedCampaign?.id === campaign.id ? 'bg-gray-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="ml-1">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            {campaign.aiTags && campaign.aiTags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {campaign.aiTags.map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campaign.segmentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {format(campaign.createdAt, 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.audience.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campaign.status === 'sent' ? (
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {campaign.delivered.toLocaleString()}
                            </span>
                            <span className="text-gray-500 ml-1">
                              ({Math.round((campaign.delivered / campaign.sent) * 100)}%)
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {campaign.status === 'sent' ? (
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {campaign.opened.toLocaleString()}
                            </span>
                            <span className="text-gray-500 ml-1">
                              ({Math.round((campaign.opened / campaign.delivered) * 100)}%)
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {campaign.status === 'sent' && (
                            <button
                              onClick={() => toggleCampaignInsights(campaign)}
                              className={`p-1.5 rounded-md transition-colors ${
                                selectedCampaign?.id === campaign.id
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'
                              }`}
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button className="p-1.5 rounded-md text-gray-400 hover:text-primary-600 hover:bg-gray-100">
                            <ArrowUpRight size={16} />
                          </button>
                          <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedCampaign?.id === campaign.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={8} className="px-6 py-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-md bg-white border border-gray-200 shadow-sm overflow-hidden"
                          >
                            <div className="px-6 py-4">
                              <div className="flex items-start">
                                <div className="p-2 bg-primary-50 rounded-lg mr-4">
                                  <Sparkles size={20} className="text-primary-500" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    AI-Generated Campaign Insights
                                  </h3>
                                  <p className="text-gray-700">
                                    {campaign.aiInsights || 'No insights available for this campaign.'}
                                  </p>
                                  
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="text-sm font-medium text-gray-500 mb-1">
                                        Delivery Rate
                                      </div>
                                      <div className="text-xl font-bold text-success-600">
                                        {Math.round((campaign.delivered / campaign.sent) * 100)}%
                                      </div>
                                      <div className="mt-1 flex items-center text-xs text-gray-500">
                                        <ArrowRight size={12} className="mr-1" />
                                        {campaign.failed} failed deliveries
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="text-sm font-medium text-gray-500 mb-1">
                                        Open Rate
                                      </div>
                                      <div className="text-xl font-bold text-primary-600">
                                        {Math.round((campaign.opened / campaign.delivered) * 100)}%
                                      </div>
                                      <div className="mt-1 flex items-center text-xs text-gray-500">
                                        <Clock size={12} className="mr-1" />
                                        Most opens within 2 hours
                                      </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-3 rounded-md">
                                      <div className="text-sm font-medium text-gray-500 mb-1">
                                        Click Rate
                                      </div>
                                      <div className="text-xl font-bold text-accent-600">
                                        {Math.round((campaign.clicked / campaign.opened) * 100)}%
                                      </div>
                                      <div className="mt-1 flex items-center text-xs text-gray-500">
                                        <ArrowRight size={12} className="mr-1" />
                                        {campaign.clicked} total clicks
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <div className="text-sm">
                                      <span className="font-medium">Sent on:</span>{' '}
                                      {campaign.sentAt ? format(campaign.sentAt, 'MMM d, yyyy') : 'Not sent yet'}
                                    </div>
                                    
                                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                      View Full Report
                                    </button>
                                  </div>
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
      
      {/* Smart recommendations */}
      {showAiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-start mb-4">
            <div className="p-2 bg-secondary-50 rounded-lg mr-4">
              <Sparkles size={20} className="text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Campaign Recommendations</h3>
              <p className="text-gray-600">Insights based on your campaign history and customer behavior</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition duration-200">
              <div className="flex items-center text-primary-600 mb-2">
                <Clock size={16} className="mr-2" />
                <h4 className="font-medium">Optimal Send Times</h4>
              </div>
              <p className="text-gray-700 mb-3">Based on your audience engagement patterns, the best times to send campaigns are:</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="text-sm space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Weekdays:</span>
                    <span className="font-medium">10:00 AM - 11:30 AM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Weekends:</span>
                    <span className="font-medium">12:00 PM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Best day:</span>
                    <span className="font-medium">Tuesday</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition duration-200">
              <div className="flex items-center text-accent-600 mb-2">
                <Users size={16} className="mr-2" />
                <h4 className="font-medium">Suggested Audience</h4>
              </div>
              <p className="text-gray-700 mb-3">We've identified a high-potential segment you haven't targeted recently:</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium mb-2">Inactive High-Value Customers</div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Previously spent over ₹15,000</li>
                  <li>• No purchase in last 60 days</li>
                  <li>• Opened emails in the last 30 days</li>
                </ul>
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-sm font-medium text-primary-600">Estimated size: 482 customers</div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition duration-200">
              <div className="flex items-center text-success-600 mb-2">
                <Mail size={16} className="mr-2" />
                <h4 className="font-medium">Subject Line Suggestions</h4>
              </div>
              <p className="text-gray-700 mb-3">Based on your best performing campaigns, try these subject lines:</p>
              <div className="bg-gray-50 p-3 rounded-md space-y-3">
                <div className="text-sm">
                  <div className="font-medium">For re-engagement:</div>
                  <div className="text-gray-600 mt-1">"We've missed you! Here's 15% off your next purchase"</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">For promotions:</div>
                  <div className="text-gray-600 mt-1">"[First Name], don't miss out on these exclusive deals 🛍️"</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">For announcements:</div>
                  <div className="text-gray-600 mt-1">"Introducing our newest collection - Early access inside ✨"</div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition duration-200">
              <div className="flex items-center text-warning-600 mb-2">
                <AlertTriangle size={16} className="mr-2" />
                <h4 className="font-medium">Delivery Optimization</h4>
              </div>
              <p className="text-gray-700 mb-3">We've detected some delivery issues that could be improved:</p>
              <div className="bg-gray-50 p-3 rounded-md">
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <div className="mt-0.5 mr-2 w-4 h-4 bg-error-100 rounded-full flex items-center justify-center">
                      <span className="text-error-600 text-xs">!</span>
                    </div>
                    <span className="text-gray-600">
                      Gmail deliverability dropped 8% in your last campaign
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="mt-0.5 mr-2 w-4 h-4 bg-warning-100 rounded-full flex items-center justify-center">
                      <span className="text-warning-600 text-xs">!</span>
                    </div>
                    <span className="text-gray-600">
                      Image-heavy emails are triggering spam filters
                    </span>
                  </li>
                  <li className="flex items-start text-primary-600 font-medium mt-3">
                    <ArrowRight size={14} className="mt-0.5 mr-1" />
                    <span>View detailed recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Campaigns;