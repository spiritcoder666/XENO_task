import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { X, Plus, GripVertical } from 'lucide-react';

export type Rule = {
  id: string;
  field: string;
  operator: string;
  value: string;
};

export type RuleGroup = {
  id: string;
  type: 'group';
  combinator: 'AND' | 'OR';
  rules: (Rule | RuleGroup)[];
};

interface RuleBuilderProps {
  ruleGroup: RuleGroup;
  onRuleGroupChange: (ruleGroup: RuleGroup) => void;
}

interface RuleProps {
  rule: Rule;
  onRuleChange: (id: string, rule: Partial<Rule>) => void;
  onRemoveRule: (id: string) => void;
}

interface RuleGroupComponentProps {
  ruleGroup: RuleGroup;
  onRuleGroupChange: (ruleGroup: RuleGroup) => void;
  onRemoveGroup?: (id: string) => void;
  level?: number;
}

const DraggableRuleItem = ({ rule, onRuleChange, onRemoveRule }: RuleProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: rule.id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
  };
  
  const fieldOptions = [
    { value: 'customerName', label: 'Customer Name' },
    { value: 'email', label: 'Email' },
    { value: 'totalSpend', label: 'Total Spend' },
    { value: 'lastPurchaseDate', label: 'Last Purchase Date' },
    { value: 'visits', label: 'Visits' },
    { value: 'daysInactive', label: 'Days Inactive' },
  ];
  
  const operatorOptions = {
    string: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'startsWith', label: 'Starts With' },
      { value: 'endsWith', label: 'Ends With' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater Than' },
      { value: 'lessThan', label: 'Less Than' },
      { value: 'between', label: 'Between' },
    ],
    date: [
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' },
      { value: 'daysAgo', label: 'Days Ago' },
    ],
  };
  
  // Determine field type for appropriate operators
  const getFieldType = (fieldName: string): 'string' | 'number' | 'date' => {
    if (['totalSpend', 'visits', 'daysInactive'].includes(fieldName)) {
      return 'number';
    } else if (['lastPurchaseDate'].includes(fieldName)) {
      return 'date';
    }
    return 'string';
  };

  const fieldType = getFieldType(rule.field);
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 flex items-start"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="mr-3 cursor-move text-gray-400 hover:text-gray-600 mt-2"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={18} />
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
          <select
            value={rule.field}
            onChange={(e) => onRuleChange(rule.id, { field: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {fieldOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
          <select
            value={rule.operator}
            onChange={(e) => onRuleChange(rule.id, { operator: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            {operatorOptions[fieldType].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
          <input
            type={fieldType === 'date' ? 'date' : fieldType === 'number' ? 'number' : 'text'}
            value={rule.value}
            onChange={(e) => onRuleChange(rule.id, { value: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={() => onRemoveRule(rule.id)}
        className="ml-3 text-gray-400 hover:text-error-500 transition-colors"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

const RuleGroupComponent = ({ 
  ruleGroup, 
  onRuleGroupChange, 
  onRemoveGroup,
  level = 0 
}: RuleGroupComponentProps) => {
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  const handleAddRule = () => {
    const newRule: Rule = {
      id: generateId(),
      field: 'totalSpend',
      operator: 'greaterThan',
      value: '1000',
    };
    
    onRuleGroupChange({
      ...ruleGroup,
      rules: [...ruleGroup.rules, newRule],
    });
  };
  
  const handleAddGroup = () => {
    const newGroup: RuleGroup = {
      id: generateId(),
      type: 'group',
      combinator: 'AND',
      rules: [],
    };
    
    onRuleGroupChange({
      ...ruleGroup,
      rules: [...ruleGroup.rules, newGroup],
    });
  };
  
  const handleRemoveRule = (id: string) => {
    onRuleGroupChange({
      ...ruleGroup,
      rules: ruleGroup.rules.filter((rule) => rule.id !== id),
    });
  };
  
  const handleRemoveGroup = (id: string) => {
    onRuleGroupChange({
      ...ruleGroup,
      rules: ruleGroup.rules.filter((rule) => rule.id !== id),
    });
  };
  
  const handleRuleChange = (id: string, ruleUpdate: Partial<Rule>) => {
    onRuleGroupChange({
      ...ruleGroup,
      rules: ruleGroup.rules.map((rule) => {
        if (rule.id === id && 'field' in rule) {
          return { ...rule, ...ruleUpdate };
        }
        return rule;
      }),
    });
  };
  
  const handleNestedGroupChange = (id: string, updatedGroup: RuleGroup) => {
    onRuleGroupChange({
      ...ruleGroup,
      rules: ruleGroup.rules.map((rule) => {
        if (rule.id === id && 'type' in rule) {
          return updatedGroup;
        }
        return rule;
      }),
    });
  };
  
  const handleCombinatorChange = (combinator: 'AND' | 'OR') => {
    onRuleGroupChange({
      ...ruleGroup,
      combinator,
    });
  };
  
  return (
    <div 
      className={`p-4 rounded-lg ${
        level === 0 ? 'bg-gray-50' : 'bg-white border border-gray-200 shadow-sm mb-3'
      }`}
    >
      {level > 0 && (
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700">Nested Condition Group</h4>
          <button
            type="button"
            onClick={() => onRemoveGroup?.(ruleGroup.id)}
            className="text-gray-400 hover:text-error-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => handleCombinatorChange('AND')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:ring-2 focus:ring-primary-500 ${
              ruleGroup.combinator === 'AND'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            AND
          </button>
          <button
            type="button"
            onClick={() => handleCombinatorChange('OR')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:ring-2 focus:ring-primary-500 ${
              ruleGroup.combinator === 'OR'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            OR
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {ruleGroup.combinator === 'AND' 
            ? 'All conditions must be true' 
            : 'Any condition can be true'}
        </p>
      </div>
      
      <div className="space-y-3">
        {ruleGroup.rules.map((rule) => {
          if ('type' in rule && rule.type === 'group') {
            return (
              <RuleGroupComponent
                key={rule.id}
                ruleGroup={rule}
                onRuleGroupChange={(updatedGroup) => handleNestedGroupChange(rule.id, updatedGroup)}
                onRemoveGroup={handleRemoveGroup}
                level={level + 1}
              />
            );
          } else if ('field' in rule) {
            return (
              <DraggableRuleItem
                key={rule.id}
                rule={rule}
                onRuleChange={handleRuleChange}
                onRemoveRule={handleRemoveRule}
              />
            );
          }
          return null;
        })}
      </div>
      
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleAddRule}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          Add Condition
        </button>
        
        <button
          type="button"
          onClick={handleAddGroup}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          Add Group
        </button>
      </div>
    </div>
  );
};

const RuleBuilder = ({ ruleGroup, onRuleGroupChange }: RuleBuilderProps) => {
  return (
    <div className="rule-builder">
      <RuleGroupComponent 
        ruleGroup={ruleGroup} 
        onRuleGroupChange={onRuleGroupChange} 
      />
    </div>
  );
};

export default RuleBuilder;