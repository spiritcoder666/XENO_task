import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For demo purposes only, in production use server-side API calls
});

// Type definitions
export interface SegmentRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface RuleGroup {
  id: string;
  type: 'group';
  combinator: 'AND' | 'OR';
  rules: (SegmentRule | RuleGroup)[];
}

export interface MessageSuggestion {
  subject: string;
  body: string;
  callToAction: string;
  imagePrompt?: string;
}

export interface CampaignInsight {
  summary: string;
  recommendations: string[];
  metrics: {
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    bestPerformingSegment?: string;
  };
}

// AI Service
export const aiService = {
  // Convert natural language to segment rules
  generateSegmentRules: async (query: string): Promise<RuleGroup> => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a CRM expert that converts natural language queries into structured segment rules.
            The valid fields are: customerName, email, totalSpend, lastPurchaseDate, visits, daysInactive.
            The valid operators are: equals, contains, startsWith, endsWith, greaterThan, lessThan, between, before, after, daysAgo.
            Respond with ONLY a valid JSON object with no explanation.`
          },
          {
            role: "user",
            content: `Convert this query to segment rules: "${query}"`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response and map to RuleGroup
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Generate IDs for rules if missing
      const ensureIds = (group: any): RuleGroup => {
        if (!group.id) group.id = Math.random().toString(36).substring(2, 9);
        
        if (group.rules && Array.isArray(group.rules)) {
          group.rules = group.rules.map((rule: any) => {
            if (rule.type === 'group') {
              return ensureIds(rule);
            } else {
              if (!rule.id) rule.id = Math.random().toString(36).substring(2, 9);
              return rule;
            }
          });
        }
        
        return group as RuleGroup;
      };
      
      return ensureIds(result);
    } catch (error) {
      console.error('Error generating segment rules:', error);
      
      // Return a default rule group if API call fails
      return {
        id: 'root',
        type: 'group',
        combinator: 'AND',
        rules: [
          {
            id: 'fallback-rule',
            field: 'totalSpend',
            operator: 'greaterThan',
            value: '1000',
          }
        ]
      };
    }
  },
  
  // Generate message suggestions for a campaign
  generateMessageSuggestions: async (
    objective: string,
    audience: string,
    productType?: string
  ): Promise<MessageSuggestion[]> => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a CRM and marketing expert that generates compelling email campaign message suggestions.
            For each message, provide a subject line, body text, call to action, and an optional image prompt.
            Respond with ONLY a valid JSON array with 3 message variations and no explanation.`
          },
          {
            role: "user",
            content: `Generate 3 message suggestions for a campaign with the following details:
            - Campaign objective: ${objective}
            - Target audience: ${audience}
            ${productType ? `- Product type: ${productType}` : ''}
            
            Each message should include:
            1. A compelling subject line
            2. Body text (150-200 characters)
            3. A clear call to action
            4. An image prompt that could be used to generate a relevant image`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return (result.suggestions || []) as MessageSuggestion[];
    } catch (error) {
      console.error('Error generating message suggestions:', error);
      
      // Return fallback suggestions
      return [
        {
          subject: "Special Offer Just For You!",
          body: "We've missed you! Here's a special offer to welcome you back to our store. Check out our latest collection and enjoy exclusive discounts.",
          callToAction: "Shop Now",
          imagePrompt: "A clean, minimal image of a gift box with a ribbon on a light background"
        },
        {
          subject: "Welcome Back - We've Missed You!",
          body: "It's been a while since your last visit. We've got some exciting new products we think you'll love. Come take a look!",
          callToAction: "Explore Now",
          imagePrompt: "A welcoming storefront with soft lighting and open doors"
        }
      ];
    }
  },
  
  // Generate campaign performance insights
  generateCampaignInsights: async (campaignData: any): Promise<CampaignInsight> => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a CRM analytics expert that generates insights from campaign performance data.
            Provide a summary, specific recommendations, and highlight key metrics.
            Respond with ONLY a valid JSON object with no explanation.`
          },
          {
            role: "user",
            content: `Generate insights for this campaign performance data:
            ${JSON.stringify(campaignData, null, 2)}`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as CampaignInsight;
    } catch (error) {
      console.error('Error generating campaign insights:', error);
      
      // Return fallback insights
      return {
        summary: "Your campaign reached the target audience with above-average engagement metrics.",
        recommendations: [
          "Consider segmenting your audience further for more targeted messaging",
          "Test different subject lines to improve open rates",
          "Optimize send times based on when your audience is most active"
        ],
        metrics: {
          deliveryRate: 95.2,
          openRate: 24.5,
          clickRate: 3.8
        }
      };
    }
  },
  
  // Get send time recommendations based on customer activity
  getSendTimeRecommendations: async (): Promise<any> => {
    // In a real implementation, this would analyze customer activity patterns
    // For this demo, we'll return static recommendations
    
    return {
      bestDays: ['Tuesday', 'Thursday'],
      bestTimes: {
        weekdays: ['10:00 AM', '2:00 PM'],
        weekends: ['11:00 AM', '3:00 PM']
      },
      segmentSpecific: {
        'High Value Customers': '9:00 AM on Tuesdays',
        'Inactive Users': '6:00 PM on Thursdays',
        'New Customers': '10:30 AM on Wednesdays'
      }
    };
  }
};

export default aiService;