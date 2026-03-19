import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAnalysisHistory, deleteAnalysisFromHistory } from '../services/firestoreService';
import { getLanguageByCode } from '../constants/languages';

const AnalysisHistory = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [currentUser]);

  const loadHistory = async () => {
    setLoading(true);
    const result = await getUserAnalysisHistory(currentUser.uid);
    if (result.success) {
      setHistory(result.history);
    }
    setLoading(false);
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    setDeleting(true);
    const result = await deleteAnalysisFromHistory(documentId);
    if (result.success) {
      // Refresh history
      await loadHistory();
      setSelectedAnalysis(null);
    } else {
      alert('Failed to delete analysis');
    }
    setDeleting(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Analysis History</h1>
            <p className="text-gray-600">View all your past plant disease analyses</p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-green-600">{history.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Plants Scanned</p>
                <p className="text-3xl font-bold text-blue-600">
                  {history.reduce((sum, item) => sum + (item.numberOfImages || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Last Analysis</p>
                <p className="text-lg font-bold text-purple-600">
                  {history.length > 0 ? formatDate(history[0].timestamp).split(',')[0] : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🕐</span>
              </div>
            </div>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📋</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-600 mb-6">Start analyzing plants to build your history</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Analyze Plants Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Analysis Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🔬</span>
                        <h3 className="text-xl font-bold text-gray-900">
                          Analysis on {formatDate(item.timestamp)}
                        </h3>
                        {item.language && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-1">
                            <span>{getLanguageByCode(item.language)?.flag || '🌐'}</span>
                            <span>{item.languageName || getLanguageByCode(item.language)?.name || 'Unknown'}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">
                        {item.numberOfImages} image{item.numberOfImages > 1 ? 's' : ''} analyzed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAnalysis(selectedAnalysis === item.id ? null : item.id)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-semibold transition-all text-sm"
                      >
                        {selectedAnalysis === item.id ? 'Hide Details' : 'View Details'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-semibold transition-all text-sm disabled:opacity-50"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {item.results?.map((result, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">Plant {idx + 1}</p>
                        <p className="font-semibold text-gray-900 text-sm truncate">{result.plantName}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          result.diseasePresent 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.diseasePresent ? '⚠️ Disease' : '✓ Healthy'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Results - Expandable */}
                  {selectedAnalysis === item.id && (
                    <div className="border-t pt-4 mt-4 space-y-4">
                      {/* Image Previews */}
                      {item.images && item.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Analyzed Images:</h4>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {item.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Analysis ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detailed Analysis Results */}
                      {item.results?.map((result, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                          {/* Plant Info */}
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-xl">🌿</span>
                                <h4 className="text-lg font-bold text-gray-900">{result.plantName}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                  result.diseasePresent 
                                    ? 'bg-red-100 text-red-700' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {result.diseasePresent ? '⚠️ Disease Detected' : '✓ Healthy'}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                  {result.confidenceLevel}% Confidence
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Disease Info */}
                          {result.diseasePresent && (
                            <div className="bg-white rounded-lg p-3 mb-3 border border-red-200">
                              <h5 className="font-bold text-red-800 mb-1">🦠 {result.diseaseName}</h5>
                              <div className="text-sm text-gray-700">
                                <span className="font-semibold">Stage:</span> {result.diseaseStage} | 
                                <span className="font-semibold ml-2">Severity:</span> {result.severity}
                              </div>
                            </div>
                          )}

                          {/* Organic Recommendations */}
                          {result.organicRecommendations && result.organicRecommendations.length > 0 && (
                            <div className="bg-white rounded-lg p-3 mb-2 border border-green-200">
                              <h5 className="font-bold text-green-800 mb-2 text-sm">🌱 Organic Treatments</h5>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {result.organicRecommendations.map((rec, idx) => (
                                  <li key={idx}>• {rec.treatment}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Chemical Recommendations */}
                          {result.inorganicRecommendations && result.inorganicRecommendations.length > 0 && (
                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                              <h5 className="font-bold text-blue-800 mb-2 text-sm">💊 Chemical Treatments</h5>
                              <ul className="text-xs text-gray-700 space-y-1">
                                {result.inorganicRecommendations.map((rec, idx) => (
                                  <li key={idx}>• {rec.treatment}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisHistory;
