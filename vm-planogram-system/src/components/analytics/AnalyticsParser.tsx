import React, { useState } from 'react';
import { analyticsService } from '../../services/analytics.service';
import { AnalyticsInsight, PlacementRule } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Link,
  Clock,
  AlertTriangle,
  Eye,
  ArrowUp,
  ArrowDown,
  Package
} from 'lucide-react';

const AnalyticsParser: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [placementRules, setPlacementRules] = useState<PlacementRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'insights' | 'rules'>('input');

  const handleParseAnalytics = async () => {
    if (!inputText.trim()) {
      setError('Please enter some analytics text to parse');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyticsService.parseAnalytics(inputText);
      setInsights(response.data.insights);

      if (response.data.insights.length > 0) {
        const rulesResponse = await analyticsService.generateRules(response.data.insights);
        setPlacementRules(rulesResponse.data.rules);
        setActiveTab('insights');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'sales_trend':
        return <TrendingUp className="w-5 h-5" />;
      case 'profitability':
        return <DollarSign className="w-5 h-5" />;
      case 'relationship':
        return <Link className="w-5 h-5" />;
      case 'seasonality':
        return <Clock className="w-5 h-5" />;
      case 'urgency':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'sales_trend':
        return 'text-green-600 bg-green-100';
      case 'profitability':
        return 'text-blue-600 bg-blue-100';
      case 'relationship':
        return 'text-purple-600 bg-purple-100';
      case 'seasonality':
        return 'text-orange-600 bg-orange-100';
      case 'urgency':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRuleIcon = (action: string) => {
    switch (action) {
      case 'eye_level':
        return <Eye className="w-4 h-4" />;
      case 'promote':
        return <ArrowUp className="w-4 h-4" />;
      case 'clear':
        return <ArrowDown className="w-4 h-4" />;
      case 'feature':
        return <Package className="w-4 h-4" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };

  const exampleText = `Winter coats up 47%, scarves up 23%
Leather goods are highest margin items
Customers who buy coats usually buy accessories
Clear summer inventory, down 89%
Boots selling 65% faster than last year`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Parser</h1>
        <p className="text-gray-600">Transform plain text analytics into actionable placement rules</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'input', label: 'Input Text', count: null },
            { id: 'insights', label: 'Insights', count: insights.length },
            { id: 'rules', label: 'Placement Rules', count: placementRules.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'input' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Analytics Input</h2>
              <button
                onClick={() => setInputText(exampleText)}
                className="text-sm text-primary hover:text-primary/80"
              >
                Load Example
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your analytics insights here...\n\nExample:\nWinter coats up 47%, scarves up 23%\nLeather goods are highest margin items\nCustomers who buy coats usually buy accessories"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleParseAnalytics}
                disabled={loading || !inputText.trim()}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Parse Analytics
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No insights parsed yet</h3>
              <p className="text-gray-500">Enter analytics text in the Input tab to see extracted insights</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {insight.type.replace('_', ' ')}
                      </h3>
                      <p className="text-gray-600 mt-1">{insight.text}</p>
                      {insight.entities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {insight.entities.map((entity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                            >
                              {entity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(insight.confidence * 100)}% confidence
                    </div>
                    {insight.value && (
                      <div className={`text-sm ${
                        insight.value > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.value > 0 ? '+' : ''}{insight.value}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="space-y-4">
          {placementRules.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No placement rules generated</h3>
              <p className="text-gray-500">Parse analytics insights first to generate placement rules</p>
            </div>
          ) : (
            placementRules.map((rule, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {getRuleIcon(rule.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {rule.action.replace('_', ' ')}
                        </h3>
                        {rule.zone && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            rule.zone === 'EYE' ? 'bg-green-100 text-green-800' :
                            rule.zone === 'REACH' ? 'bg-blue-100 text-blue-800' :
                            rule.zone === 'STRETCH' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.zone} Level
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{rule.reasoning}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(rule.confidence * 100)}% confidence
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {rule.type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsParser;