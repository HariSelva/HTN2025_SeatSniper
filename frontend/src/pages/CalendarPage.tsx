import React from 'react';

export const CalendarPage: React.FC = () => {
  return (
    <div className="container-premium py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="heading-premium mb-4">Your Calendar</h1>
        <p className="subheading-premium">
          Calendar functionality is currently under construction
        </p>
      </div>

      {/* Under Construction Content */}
      <div className="max-w-2xl mx-auto">
        <div className="card-premium text-center">
          <div className="card-premium-body py-12">
            {/* Construction Icon */}
            <div className="text-gray-400 mb-6">
              <svg 
                className="w-24 h-24 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                />
              </svg>
            </div>

            {/* Main Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Under Construction
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're working hard to bring you an amazing calendar experience. 
              This feature will help you manage your course schedule, track assignments, 
              and stay organized throughout your academic journey.
            </p>

            {/* Features Coming Soon */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Coming Soon:
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Interactive course schedule view
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Assignment and exam tracking
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Integration with course recommendations
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Smart scheduling suggestions
                </li>
              </ul>
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                In the meantime, you can explore other features like course discovery, 
                AI chat assistance, and your watchlist.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => window.location.href = '/discover'}
                  className="btn-primary-premium"
                >
                  Explore Courses
                </button>
                <button 
                  onClick={() => window.location.href = '/chat'}
                  className="btn-secondary-premium"
                >
                  Chat with AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Have questions? <span className="text-blue-600 hover:text-blue-700 cursor-pointer">Contact support</span>
          </p>
        </div>
      </div>
    </div>
  );
};