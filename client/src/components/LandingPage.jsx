import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function ElectionDashboardLanding({ onEnterDashboard }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track voting patterns and results as they happen"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Geographic Insights",
      description: "Interactive maps showing constituency-wise data"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trend Analysis",
      description: "Historical comparisons and predictive insights"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Voter Demographics",
      description: "Comprehensive demographic breakdowns and patterns"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Sachin Varahe
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-orange-100">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Powered by Advanced Analytics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                Indian Election
              </span>
              <br />
              <span className="text-gray-800">Data Visualization</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore comprehensive election data through interactive visualizations. 
              Make sense of complex political trends with our intuitive dashboard.
            </p>

            {/* CTA Button */}
            <button 
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              onClick={onEnterDashboard}
            >
              <span className="relative z-10">Go to Dashboard</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </span>
              <span>•</span>
              <span>545 Constituencies</span>
              <span>•</span>
              <span>28 States & 8 UTs</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className={`mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 ${hoveredCard === index ? 'bg-gradient-to-br from-orange-500 to-green-600 text-white' : 'bg-orange-50 text-orange-600'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className={`mt-20 bg-white rounded-3xl p-8 shadow-lg border border-gray-100 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  900M+
                </div>
                <div className="text-gray-600">Eligible Voters</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
                  2000+
                </div>
                <div className="text-gray-600">Political Parties</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <div className="text-gray-600">Polling Stations</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 mt-20">
          <div className="text-center text-gray-500 text-sm">
            <p>Made By Sachin For Varahe Assignment</p>
          </div>
        </footer>
      </div>
    </div>
  );
}