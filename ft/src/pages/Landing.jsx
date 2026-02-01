import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Users, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const stats = [
    { label: 'Active Projects', value: '24K+', icon: Film },
    { label: 'Verified Filmmakers', value: '15K+', icon: Users },
    { label: 'Completion Rate', value: '89%', icon: CheckCircle },
    { label: 'Average Rating', value: '4.8★', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl shadow-lg">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              FilmCrew
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
              Build Your Crew.
            </span>
            <br />
            <span className="text-gray-900">Ship Your Film.</span>
          </h1>
          
          <p className="text-2xl text-gray-700 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
            The only platform where every project proves it's real. No ghost listings. 
            Just filmmakers who ship.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => navigate('/signup')}
              className="w-72 px-10 py-5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-yellow-600 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-1"
            >
              Start a Project
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-72 px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl border-2 border-gray-300 transform hover:scale-105"
            >
              Browse Projects
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-orange-100"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl mb-5 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-gray-900 mb-3">{stat.value}</div>
                <div className="text-sm text-gray-600 font-bold uppercase tracking-wide">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-5xl font-black text-center mb-20 text-gray-900">
          Why Filmmakers Choose Us
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-orange-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <Film className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-5">Real Projects Only</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Every project is verified. No spam, no ghost listings. Just serious filmmakers 
              building real crews.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-orange-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-5">Find Your Crew</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Connect with talented cinematographers, editors, sound designers, and more. 
              Build your dream team.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 border border-orange-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-5">Ship Faster</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Streamlined workflow from application to acceptance. Get your project moving 
              in days, not weeks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 rounded-3xl p-16 shadow-3xl transform hover:scale-105 transition-all">
          <h2 className="text-5xl font-black text-white mb-8">
            Ready to Build Your Crew?
          </h2>
          <p className="text-2xl text-white/95 mb-10 font-medium">
            Join thousands of filmmakers creating amazing projects together.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-12 py-5 bg-white text-orange-600 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-110"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-orange-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">FilmCrew</span>
          </div>
          <p className="text-gray-600 font-medium">&copy; 2025 FilmCrew Platform. Built for filmmakers, by filmmakers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;