import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Save, RefreshCw, Sparkles } from 'lucide-react';
import RuleBuilder, { RuleGroup } from '../components/segments/RuleBuilder';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';

const CreateSegment = () => {
  const navigate = useNavigate();
  const [segmentName, setSegmentName] = useState('');
  const [segmentDescription, setSegmentDescription] = useState('');
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  // Initial rule group structure
  const [ruleGroup, setRuleGroup] = useState<RuleGroup>({
    id: 'root',
    type: 'group',
    combinator: 'AND',
    rules: [
      {
        id: 'rule1',
        field: 'totalSpend',
        operator: 'greaterThan',
        value: '10000',
      },
      {
        id: 'rule2',
        field: 'visits',
        operator: 'lessThan',
        value: '3',
      },
    ],
  });
  
  const handleRuleGroupChange = (updatedRuleGroup: RuleGroup) => {
    setRuleGroup(updatedRuleGroup);
    // Reset audience calculation when rules change
    setAudienceSize(null);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    // Handle drag and drop reordering
    console.log('Drag ended', event);
    // In a real implementation, you would reorder the rules based on the drag event
  };
  
  const calculateAudienceSize = () => {
    setIsCalculating(true);
    
    // Simulate API call to calculate audience size based on rules
    setTimeout(() => {
      // This would typically be an API call to determine how many customers match the rules
      const calculatedSize = Math.floor(Math.random() * 2000) + 500;
      setAudienceSize(calculatedSize);
      setIsCalculating(false);
    }, 1500);
  };
  
  const handleSaveSegment = () => {
    if (!segmentName.trim()) {
      alert('Please provide a segment name');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call to save segment
    setTimeout(() => {
      // This would typically be an API call to save the segment
      setIsSaving(false);
      navigate('/segments', { state: { segmentCreated: true } });
    }, 1500);
  };
  
  const processNaturalLanguageQuery = () => {
    if (!naturalLanguageQuery.trim()) return;
    
    setIsProcessingAI(true);
    
    // Simulate AI processing of natural language to segment rules
    setTimeout(() => {
      // In a real implementation, this would call an AI service to convert
      // natural language to segment rules
      let newRuleGroup: RuleGroup = {
        id: 'root',
        type: 'group',
        combinator: 'AND',
        rules: [],
      };
      
      const query = naturalLanguageQuery.toLowerCase();
      
      if (query.includes('haven\'t shopped') || query.includes('inactive')) {
        // Example: "People who haven't shopped in 6 months and spent over ₹5K"
        newRuleGroup.rules.push({
          id: 'nlp-rule1',
          field: 'lastPurchaseDate',
          operator: 'daysAgo',
          value: '180', // 6 months
        });
      }
      
      if (query.includes('spent over') || query.includes('spent more than')) {
        newRuleGroup.rules.push({
          id: 'nlp-rule2',
          field: 'totalSpend',
          operator: 'greaterThan',
          value: '5000',
        });
      }
      
      if (query.includes('visited less than') || query.includes('fewer visits')) {
        newRuleGroup.rules.push({
          id: 'nlp-rule3',
          field: 'visits',
          operator: 'lessThan',
          value: '3',
        });
      }
      
      if (newRuleGroup.rules.length === 0) {
        // Fallback for queries we don't understand
        newRuleGroup.rules.push({
          id: 'nlp-fallback',
          field: 'totalSpend',
          operator: 'greaterThan',
          value: '1000',
        });
      }
      
      setRuleGroup(newRuleGroup);
      setIsProcessingAI(false);
      
      // Also calculate audience size with new rules
      setIsCalculating(true);
      setTimeout(() => {
        const calculatedSize = Math.floor(Math.random() * 2000) + 500;
        setAudienceSize(calculatedSize);
        setIsCalculating(false);
      }, 1000);
    }, 2000);
  };
  
  useEffect(() => {
    // When component mounts, calculate initial audience size
    calculateAudienceSize();
  }, []);
  
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/segments')}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Segment</h1>
          </div>
          
          <button
            onClick={handleSaveSegment}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Segment
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Segment Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Segment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="segment-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Segment Name
                  </label>
                  <input
                    type="text"
                    id="segment-name"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="E.g., High Value Customers"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="segment-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    id="segment-description"
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the purpose of this segment"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* AI Query Builder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Natural Language Segmentation</h2>
                  <p className="text-sm text-gray-600">Describe your target audience in plain English</p>
                </div>
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Sparkles size={20} className="text-primary-600" />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={naturalLanguageQuery}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  placeholder="E.g., People who haven't shopped in 6 months and spent over ₹5K"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-28"
                />
                <button
                  onClick={processNaturalLanguageQuery}
                  disabled={isProcessingAI || !naturalLanguageQuery.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm disabled:opacity-70"
                >
                  {isProcessingAI ? 'Processing...' : 'Generate'}
                </button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                <p>Try phrases like:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Customers who spent over 10K in the last 90 days</li>
                  <li>People who haven't visited our site in 30 days</li>
                  <li>Customers who made more than 5 purchases</li>
                </ul>
              </div>
            </motion.div>
            
            {/* Rule Builder */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Segment Rules</h2>
              <p className="text-sm text-gray-600 mb-6">
                Build your targeting rules to define which customers should be included in this segment.
              </p>
              
              <RuleBuilder 
                ruleGroup={ruleGroup} 
                onRuleGroupChange={handleRuleGroupChange} 
              />
            </motion.div>
          </div>
          
          {/* Segment Preview */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 sticky top-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Segment Preview</h2>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center py-6 px-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                    <Users size={32} className="text-primary-600" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Audience Size</h3>
                    {isCalculating ? (
                      <div className="text-sm text-gray-500">Calculating...</div>
                    ) : audienceSize !== null ? (
                      <div className="text-3xl font-bold text-primary-600">{audienceSize.toLocaleString()}</div>
                    ) : (
                      <div className="text-sm text-gray-500">Not calculated</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Segment Summary</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      {ruleGroup.rules.length > 0 ? (
                        <>
                          Targeting customers who match {ruleGroup.combinator === 'AND' ? 'all' : 'any'} of these criteria:
                          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                            {ruleGroup.rules.map((rule, index) => {
                              if ('field' in rule) {
                                let operator = '';
                                switch (rule.operator) {
                                  case 'greaterThan': operator = 'greater than'; break;
                                  case 'lessThan': operator = 'less than'; break;
                                  case 'equals': operator = 'equals'; break;
                                  case 'daysAgo': operator = 'days ago'; break;
                                  default: operator = rule.operator;
                                }
                                
                                let field = '';
                                switch (rule.field) {
                                  case 'totalSpend': field = 'Total Spend'; break;
                                  case 'visits': field = 'Number of Visits'; break;
                                  case 'lastPurchaseDate': field = 'Last Purchase'; break;
                                  case 'daysInactive': field = 'Days Inactive'; break;
                                  default: field = rule.field;
                                }
                                
                                return (
                                  <li key={index}>
                                    {field} is {operator} {rule.value}
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        </>
                      ) : (
                        'No rules defined yet.'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                  <button
                    onClick={calculateAudienceSize}
                    disabled={isCalculating}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} className="mr-2" />
                        Recalculate Size
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleSaveSegment}
                    disabled={isSaving}
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition duration-200 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Segment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default CreateSegment;