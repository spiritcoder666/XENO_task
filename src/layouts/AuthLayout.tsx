import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
      
      {/* Right side - branding and info */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 text-white p-8 items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-lg"
        >
          <div className="flex items-center gap-3 mb-8">
            <PieChart size={48} className="text-white" />
            <h1 className="text-4xl font-bold">PulseCRM</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Transform your customer relationships</h2>
          
          <p className="text-lg mb-8 text-gray-100">
            Personalized campaigns, intelligent segmentation, and AI-powered insights
            to help you connect with your customers like never before.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Smart Segmentation</h3>
              <p className="text-sm">Create precise audience segments with our intuitive rule builder.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-sm">Get intelligent suggestions and analytics to optimize your campaigns.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Campaign Tracking</h3>
              <p className="text-sm">Monitor delivery and performance metrics in real-time.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Personalized Messaging</h3>
              <p className="text-sm">Craft tailored messages that resonate with your audience.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;