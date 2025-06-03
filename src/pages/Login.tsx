import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { PieChart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleGoogleSuccess = (credentialResponse: { credential: string }) => {
    try {
      login(credentialResponse.credential);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
          <PieChart size={36} className="text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">PulseCRM</h1>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to access your dashboard</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-error-50 border border-error-200 text-error-700 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
          <p className="mt-4 text-sm text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with demo account</span>
          </div>
        </div>

        <button
          onClick={() => {
            // For demo purposes, simulate a JWT token
            const demoToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZW1vLXVzZXIiLCJuYW1lIjoiRGVtbyBVc2VyIiwiZW1haWwiOiJkZW1vQGV4YW1wbGUuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vdWlmYWNlcy5jby9hcGk_bmFtZT1EZW1vK1VzZXImYmFja2dyb3VuZD1yYW5kb20iLCJleHAiOjE5OTk5OTk5OTl9.demotoken";
            login(demoToken);
            navigate('/', { replace: true });
          }}
          className="w-full py-3 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
        >
          Demo Login
        </button>
      </div>
    </div>
  );
};

export default Login;