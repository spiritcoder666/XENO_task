import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, Target, Mail, ArrowUpRight, 
  TrendingUp, Activity, ChevronRight, BarChart3 
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

// Sample data
const generateCampaignData = () => {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return format(date, 'MMM dd');
  });
  
  return {
    labels: dates,
    datasets: [
      {
        label: 'Delivered',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 500) + 500),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
};

const generateSegmentData = () => {
  return {
    labels: ['High Value', 'Active', 'At Risk', 'Inactive'],
    datasets: [
      {
        data: [25, 40, 15, 20],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // success
          'rgba(59, 130, 246, 0.8)', // primary
          'rgba(249, 115, 22, 0.8)', // accent
          'rgba(156, 163, 175, 0.8)', // gray
        ],
        borderWidth: 0,
      },
    ],
  };
};

const Dashboard = () => {
  const [campaignData, setCampaignData] = useState(generateCampaignData());
  const [segmentData, setSegmentData] = useState(generateSegmentData());
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
        },
      },
    },
  };
  
  const recentCampaigns = [
    { 
      id: 1, 
      name: 'Summer Collection', 
      date: '2023-06-15', 
      status: 'Delivered', 
      sent: 1242, 
      opened: 876 
    },
    { 
      id: 2, 
      name: 'Special Discount', 
      date: '2023-06-10', 
      status: 'Delivered', 
      sent: 984, 
      opened: 721 
    },
    { 
      id: 3, 
      name: 'New Arrivals', 
      date: '2023-06-05', 
      status: 'Delivered', 
      sent: 1568, 
      opened: 1103 
    },
  ];
  
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200">
            Create Campaign
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">3,587</h3>
            </div>
            <div className="p-2 bg-primary-50 rounded-lg">
              <Users size={20} className="text-primary-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp size={16} className="text-success-500 mr-1" />
            <span className="text-success-600 font-medium">12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Segments</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
            </div>
            <div className="p-2 bg-secondary-50 rounded-lg">
              <Target size={20} className="text-secondary-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp size={16} className="text-success-500 mr-1" />
            <span className="text-success-600 font-medium">4</span>
            <span className="text-gray-500 ml-1">new this month</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Campaigns Sent</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">26</h3>
            </div>
            <div className="p-2 bg-accent-50 rounded-lg">
              <Mail size={20} className="text-accent-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <Activity size={16} className="text-primary-500 mr-1" />
            <span className="text-primary-600 font-medium">3</span>
            <span className="text-gray-500 ml-1">sent this week</span>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Open Rate</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">67.8%</h3>
            </div>
            <div className="p-2 bg-success-50 rounded-lg">
              <BarChart3 size={20} className="text-success-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp size={16} className="text-success-500 mr-1" />
            <span className="text-success-600 font-medium">5.2%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
            <select className="text-sm border-gray-300 rounded-md">
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
          <div className="h-64">
            <Line data={campaignData} options={chartOptions} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-5 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            <Link to="/segments" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="h-56">
            <Doughnut data={segmentData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>
      
      {/* Recent Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
            <Link to="/campaigns" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{campaign.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{campaign.sent}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {campaign.opened} ({Math.round((campaign.opened / campaign.sent) * 100)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/campaigns/${campaign.id}`} className="text-primary-600 hover:text-primary-900">
                      <ArrowUpRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;