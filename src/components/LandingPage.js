import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🔬",
      title: "AI-Powered Detection",
      description: "Advanced CNN algorithms analyze plant images with 95%+ accuracy to identify diseases instantly."
    },
    {
      icon: "🌿",
      title: "Multiple Plant Species",
      description: "Support for 50+ plant species including crops, fruits, vegetables, and ornamental plants."
    },
    {
      icon: "💊",
      title: "Smart Recommendations",
      description: "Get personalized treatment plans and prevention strategies powered by machine learning."
    },
    {
      icon: "📊",
      title: "Real-time Analysis",
      description: "Upload images and receive detailed diagnostic reports in seconds, not hours."
    }
  ];

  const diseases = [
    { name: "Early Blight", severity: "Medium", plants: "Tomato, Potato" },
    { name: "Powdery Mildew", severity: "Low", plants: "Cucumber, Grape" },
    { name: "Bacterial Spot", severity: "High", plants: "Pepper, Tomato" },
    { name: "Leaf Rust", severity: "Medium", plants: "Wheat, Corn" }
  ];

  const stats = [
    { number: "50+", label: "Plant Species" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "100K+", label: "Diagnoses" },
    { number: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                PlantCare AI
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 transition-colors font-medium">How It Works</a>
              <a href="#diseases" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Diseases</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Contact</a>
            </div>
            <Link to="/login" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 md:px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Detect Plant Diseases with
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> AI Precision</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Harness the power of Convolutional Neural Networks and advanced AI to identify plant diseases instantly and get expert treatment recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2">
                  <span>Upload Plant Image</span>
                  <span>📸</span>
                </Link>
                <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all flex items-center justify-center space-x-2">
                  <span>Watch Demo</span>
                  <span>▶️</span>
                </button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-green-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <img 
                  src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&h=600&fit=crop" 
                  alt="Healthy plant leaf"
                  className="w-full h-80 object-cover rounded-2xl mb-4"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Analysis Status</div>
                    <div className="text-lg font-semibold text-green-600">✓ Healthy Plant</div>
                  </div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Plant Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced CNN-based system provides comprehensive plant disease detection and management solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl transform transition-all duration-500 hover:scale-105 cursor-pointer ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className={activeFeature === index ? 'text-white/90' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple 3-step process to diagnose your plants</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Capture Image",
                description: "Take a clear photo of the affected plant leaf or area using your phone or camera",
                image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400&h=300&fit=crop"
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our CNN model processes the image through multiple layers to identify patterns and diseases",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive instant diagnosis with detailed treatment recommendations and prevention tips",
                image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-xl mb-4 mt-6"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-green-500">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases Database */}
      <section id="diseases" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Extensive Disease Database
            </h2>
            <p className="text-xl text-gray-600">We can detect and treat hundreds of plant diseases</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {diseases.map((disease, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{disease.name}</h3>
                    <p className="text-gray-600 mb-3">Affects: {disease.plants}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Severity:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        disease.severity === 'High' ? 'bg-red-100 text-red-700' :
                        disease.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {disease.severity}
                      </span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                    🦠
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/register" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all inline-block">
              View All Diseases →
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-green-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-300">Cutting-edge AI and machine learning algorithms</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tech: "CNN", desc: "Convolutional Neural Networks for image recognition", icon: "🧠" },
              { tech: "TensorFlow", desc: "Industry-leading ML framework", icon: "⚡" },
              { tech: "Cloud AI", desc: "Scalable cloud infrastructure", icon: "☁️" }
            ].map((item, index) => (
              <div key={index} className="glass-effect rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{item.tech}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Protect Your Plants?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Start detecting diseases and getting recommendations today with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all">
              Start Free Trial
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌱</span>
                </div>
                <span className="text-xl font-bold">PlantCare AI</span>
              </div>
              <p className="text-gray-400">Protecting plants with artificial intelligence</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-green-500 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-green-500 transition-colors">Pricing</a></li>
                <li><a href="#api" className="hover:text-green-500 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-green-500 transition-colors">About</a></li>
                <li><a href="#blog" className="hover:text-green-500 transition-colors">Blog</a></li>
                <li><a href="#careers" className="hover:text-green-500 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help" className="hover:text-green-500 transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-green-500 transition-colors">Contact</a></li>
                <li><a href="#privacy" className="hover:text-green-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 PlantCare AI. All rights reserved. Built with ❤️ for healthier plants.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
