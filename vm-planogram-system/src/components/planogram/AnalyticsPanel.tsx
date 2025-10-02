import React, { useState } from 'react';
import { BarChart3, Brain, Lightbulb } from 'lucide-react';

const AnalyticsPanel: React.FC = () => {
  const [analyticsText, setAnalyticsText] = useState('');

  const handleApplyAnalytics = () => {
    // This would integrate with the analytics service
    console.log('Applying analytics:', analyticsText);
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="text-center">
        <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
        <h3 className="font-semibold text-gray-900">AI-Driven Placement</h3>
        <p className="text-sm text-gray-600">
          Input analytics insights to automatically optimize fixture placement
        </p>
      </div>

      <div className="space-y-3">
        <label className="form-label">Analytics Insights</label>
        <textarea
          value={analyticsText}
          onChange={(e) => setAnalyticsText(e.target.value)}
          placeholder="Paste your analytics insights here..."
          className="w-full h-32 input-field resize-none"
        />

        <button
          onClick={handleApplyAnalytics}
          disabled={!analyticsText.trim()}
          className="w-full btn-primary flex items-center justify-center"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Apply Analytics
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
          <div className="text-sm text-blue-700">
            <strong>Quick Start:</strong> Try entering insights like "Winter coats up 47%" or "Leather goods highest margin"
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;