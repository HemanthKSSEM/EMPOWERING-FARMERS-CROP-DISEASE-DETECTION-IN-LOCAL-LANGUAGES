import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analyzePlantImages } from '../services/geminiService';
import { saveAnalysisToHistory, getUserStatistics } from '../services/firestoreService';
import AnalysisHistory from './AnalysisHistory';
import { SUPPORTED_LANGUAGES, getDefaultLanguage } from '../constants/languages';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userStats, setUserStats] = useState({
    totalScans: 0,
    healthyPlants: 0,
    diseasedPlants: 0,
    successRate: 95
  });
  const [showHistory, setShowHistory] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(getDefaultLanguage());

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Load user statistics on mount
  useEffect(() => {
    const loadStats = async () => {
      if (currentUser) {
        const statsResult = await getUserStatistics(currentUser.uid);
        if (statsResult.success) {
          setUserStats(statsResult.stats);
        }
        
        // Load recent scans
        const { getUserAnalysisHistory } = require('../services/firestoreService');
        const historyResult = await getUserAnalysisHistory(currentUser.uid);
        if (historyResult.success && historyResult.history.length > 0) {
          // Get last 4 analyses
          const recent = historyResult.history.slice(0, 4).flatMap(item => 
            item.results?.map(result => ({
              id: item.id,
              plant: result.plantName?.split('(')[0]?.trim() || 'Unknown Plant',
              disease: result.diseasePresent ? result.diseaseName : 'Healthy',
              date: new Date(item.timestamp).toLocaleDateString(),
              status: result.diseasePresent ? 'sick' : 'healthy',
              confidence: result.confidenceLevel || 0
            })) || []
          ).slice(0, 4);
          setRecentScans(recent);
        }
      }
    };
    loadStats();
  }, [currentUser]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Store actual files for API
      setImageFiles(files);
      
      // Create preview URLs
      const previews = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(previews).then(results => {
        setUploadedImages(results);
      });
    }
  };

  const handleAnalyzeImages = async () => {
    if (imageFiles.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const result = await analyzePlantImages(imageFiles, selectedLanguage.code);
      
      if (result.success) {
        setAnalysisResults(result.results);
        
        // Automatically save to Firestore
        setSaving(true);
        const saveResult = await saveAnalysisToHistory(currentUser.uid, {
          results: result.results,
          images: uploadedImages, // Store base64 previews
          language: selectedLanguage.code,
          languageName: selectedLanguage.name
        });
        
        if (saveResult.success) {
          // Refresh statistics
          const statsResult = await getUserStatistics(currentUser.uid);
          if (statsResult.success) {
            setUserStats(statsResult.stats);
          }
        }
        setSaving(false);
      } else {
        setError(result.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during analysis. Please try again.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUploadedImages([]);
    setImageFiles([]);
    setAnalysisResults(null);
    setError(null);
  };

  const stats = [
    { label: 'Total Scans', value: userStats.totalScans || '0', change: '+12%', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { label: 'Healthy Plants', value: userStats.healthyPlants || '0', change: '+8%', icon: '🌿', color: 'from-green-500 to-green-600' },
    { label: 'Issues Detected', value: userStats.diseasedPlants || '0', change: '-5%', icon: '⚠️', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Success Rate', value: `${userStats.successRate || 0}%`, change: '+2%', icon: '✓', color: 'from-purple-500 to-purple-600' },
  ];

  const recommendations = [
    { title: 'Water Schedule', desc: 'Water your tomato plants every 2-3 days', priority: 'high' },
    { title: 'Fungicide Treatment', desc: 'Apply fungicide to rose bush affected area', priority: 'urgent' },
    { title: 'Pruning Needed', desc: 'Remove affected leaves from apple tree', priority: 'medium' },
  ];

  return (
    <>
      {showHistory ? (
        <AnalysisHistory onClose={() => setShowHistory(false)} />
      ) : (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                PlantCare AI
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-semibold text-gray-900">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-gray-500">{currentUser?.email}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.displayName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor your plant health and get AI-powered insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📸</span>
                <span>CNN Model Analysis</span>
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                {uploadedImages.length === 0 ? (
                  <div>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📷</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Plant Images</h3>
                    <p className="text-gray-600 mb-4">Select one or multiple images for analysis</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer hover:shadow-lg transition-all"
                    >
                      Choose Images
                    </label>
                    <p className="text-sm text-gray-500 mt-3">Supports: JPG, PNG, WebP • Multiple files allowed</p>
                  </div>
                ) : (
                  <div>
                    {/* Image Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={img} 
                            alt={`Upload ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Language Selection */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        🌐 Select Analysis Language
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => setSelectedLanguage(lang)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all ${
                              selectedLanguage.code === lang.code
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              <span>{lang.flag}</span>
                              <span>{lang.nativeName}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        Selected: <span className="font-semibold text-green-600">{selectedLanguage.name}</span>
                      </p>
                    </div>

                    {/* Analysis Status */}
                    {!analyzing && !analysisResults && (
                      <div className="space-y-3">
                        <p className="text-gray-700 font-medium">
                          {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} ready for analysis
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleAnalyzeImages}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            Analyze with CNN Model
                          </button>
                          <button
                            onClick={handleReset}
                            className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Analyzing State */}
                    {analyzing && (
                      <div className="py-8">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl">🧠</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-green-600 mb-1">
                              CNN Model Processing...
                            </p>
                            <p className="text-sm text-gray-600">
                              Deep learning analysis in progress
                            </p>
                          </div>
                          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-700 font-semibold">⚠️ {error}</p>
                        <button
                          onClick={handleReset}
                          className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {/* Analysis Results */}
                    {analysisResults && (
                      <div className="space-y-4">
                        {analysisResults.map((result, index) => (
                          <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-left">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-2xl">🌿</span>
                                  <h3 className="text-xl font-bold text-gray-900">{result.plantName}</h3>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
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

                            {/* Disease Information */}
                            {result.diseasePresent && (
                              <div className="mb-4 bg-white rounded-lg p-4 border border-red-200">
                                <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                                  <span>🦠</span>
                                  <span>{result.diseaseName}</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-600">Stage:</span>
                                    <span className={`ml-2 font-semibold ${
                                      result.diseaseStage === 'Critical' ? 'text-red-700' :
                                      result.diseaseStage === 'Advanced' ? 'text-orange-700' :
                                      result.diseaseStage === 'Medium' ? 'text-yellow-700' :
                                      'text-green-700'
                                    }`}>
                                      {result.diseaseStage}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Severity:</span>
                                    <span className={`ml-2 font-semibold ${
                                      result.severity === 'Critical' || result.severity === 'High' ? 'text-red-700' :
                                      result.severity === 'Medium' ? 'text-yellow-700' :
                                      'text-green-700'
                                    }`}>
                                      {result.severity}
                                    </span>
                                  </div>
                                </div>
                                
                                {result.symptoms && result.symptoms.length > 0 && (
                                  <div className="mt-3">
                                    <p className="font-semibold text-gray-700 text-sm mb-1">Symptoms:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                      {result.symptoms.map((symptom, idx) => (
                                        <li key={idx}>{symptom}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Organic Recommendations */}
                            {result.organicRecommendations && result.organicRecommendations.length > 0 && (
                              <div className="mb-4 bg-white rounded-lg p-4 border border-green-200">
                                <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                  <span>🌱</span>
                                  <span>Organic Treatment Options</span>
                                </h4>
                                <div className="space-y-3">
                                  {result.organicRecommendations.map((rec, idx) => (
                                    <div key={idx} className="border-l-4 border-green-500 pl-3 py-1">
                                      <p className="font-semibold text-gray-900 text-sm">{rec.treatment}</p>
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-semibold">Application:</span> {rec.application}
                                      </p>
                                      {rec.effectiveness && (
                                        <p className="text-xs text-green-700 mt-1">
                                          <span className="font-semibold">Effectiveness:</span> {rec.effectiveness}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Inorganic Recommendations */}
                            {result.inorganicRecommendations && result.inorganicRecommendations.length > 0 && (
                              <div className="mb-4 bg-white rounded-lg p-4 border border-blue-200">
                                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                  <span>💊</span>
                                  <span>Chemical Treatment Options</span>
                                </h4>
                                <div className="space-y-3">
                                  {result.inorganicRecommendations.map((rec, idx) => (
                                    <div key={idx} className="border-l-4 border-blue-500 pl-3 py-1">
                                      <p className="font-semibold text-gray-900 text-sm">{rec.treatment}</p>
                                      {rec.activeIngredient && (
                                        <p className="text-xs text-gray-600 mt-1">
                                          <span className="font-semibold">Active Ingredient:</span> {rec.activeIngredient}
                                        </p>
                                      )}
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-semibold">Application:</span> {rec.application}
                                      </p>
                                      {rec.precautions && (
                                        <p className="text-xs text-red-600 mt-1">
                                          <span className="font-semibold">⚠️ Precautions:</span> {rec.precautions}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Preventive Measures */}
                            {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                              <div className="bg-white rounded-lg p-4 border border-purple-200">
                                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                                  <span>🛡️</span>
                                  <span>Preventive Measures</span>
                                </h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {result.preventiveMeasures.map((measure, idx) => (
                                    <li key={idx}>{measure}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Urgency Badge */}
                            {result.urgency && (
                              <div className="mt-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <span className="text-sm font-semibold text-gray-700">Action Timeline:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  result.urgency === 'Immediate' ? 'bg-red-100 text-red-700' :
                                  result.urgency.includes('3 days') ? 'bg-orange-100 text-orange-700' :
                                  result.urgency.includes('week') ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {result.urgency}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center mt-6">
                          <button
                            onClick={handleReset}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                          >
                            Analyze New Images
                          </button>
                          <button
                            onClick={() => setShowHistory(true)}
                            className="border-2 border-green-600 text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
                          >
                            View History
                          </button>
                        </div>

                        {/* Save Confirmation */}
                        {!saving && (
                          <div className="mt-4 text-center">
                            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
                              ✓ Analysis saved to your history
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Scans */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📋</span>
                <span>Recent Scans</span>
              </h2>
              
              {recentScans.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">📋</span>
                  </div>
                  <p className="text-gray-600">No scans yet. Start analyzing plants to see your history here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div key={scan.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                          scan.status === 'healthy' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {scan.status === 'healthy' ? '✓' : '⚠️'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{scan.plant}</div>
                          <div className="text-sm text-gray-600">{scan.disease}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-700">{scan.confidence}%</div>
                        <div className="text-xs text-gray-500">{scan.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recommendations & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowHistory(false)}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all flex items-center space-x-3"
                >
                  <span className="text-2xl">🔍</span>
                  <span className="font-semibold">Scan Plant</span>
                </button>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all flex items-center space-x-3"
                >
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold">View Analysis History</span>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span className="font-semibold">View Reports</span>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-3 text-left transition-all flex items-center space-x-3">
                  <span className="text-2xl">⚙️</span>
                  <span className="font-semibold">Settings</span>
                </button>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>💡</span>
                <span>AI Recommendations</span>
              </h2>
              
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="border-l-4 pl-4 py-2" style={{
                    borderColor: rec.priority === 'urgent' ? '#ef4444' : rec.priority === 'high' ? '#f59e0b' : '#10b981'
                  }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{rec.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rec.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'high' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Health Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Plant Health Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Healthy</span>
                    <span className="font-semibold text-green-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Minor Issues</span>
                    <span className="font-semibold text-yellow-600">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Critical</span>
                    <span className="font-semibold text-red-600">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full" style={{width: '5%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default Dashboard;
