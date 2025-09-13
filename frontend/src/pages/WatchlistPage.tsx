import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store';
import { SectionCard } from '@/components/ui/SectionCard';

export const WatchlistPage: React.FC = () => {
  const { watchlist, sections } = useAppStore();

  const watchedSections = sections.filter(section =>
    watchlist.some(item => item.sectionId === section.id)
  );

  const totalWatched = watchedSections.length;
  const availableWatched = watchedSections.filter(s => s.availableSeats > 0).length;
  const totalSeats = watchedSections.reduce((sum, s) => sum + s.totalCapacity, 0);
  const availableSeats = watchedSections.reduce((sum, s) => sum + s.availableSeats, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Watchlist
        </h1>
        <p className="text-gray-600">
          Keep track of your favorite course sections and get notified when seats become available.
        </p>
      </div>

      {watchedSections.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">👀</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Watchlist is Empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start building your watchlist by browsing courses and adding sections you're interested in.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/courses" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Browse Courses
                </Link>
                <Link to="/sections/1" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  View Sections
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{totalWatched}</div>
              <div className="text-sm text-gray-600">Watched Sections</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{availableWatched}</div>
              <div className="text-sm text-gray-600">Available Now</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-gray-600">{totalSeats}</div>
              <div className="text-sm text-gray-600">Total Seats</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{availableSeats}</div>
              <div className="text-sm text-gray-600">Available Seats</div>
            </div>
          </div>

          {/* Watchlist Sections */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Watched Sections ({totalWatched})
            </h2>
            
            <div className="space-y-4">
              {watchedSections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
