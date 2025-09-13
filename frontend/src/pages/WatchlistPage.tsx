import React from 'react';
import { useAppStore } from '@/store';

export const WatchlistPage: React.FC = () => {
  const { watchlist, sections } = useAppStore();

  const watchedSections = sections.filter(section =>
    watchlist.some(item => item.sectionId === section.id)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Watchlist</h1>
      
      {watchedSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sections in your watchlist yet.</p>
          <p className="text-gray-400 mt-2">Browse courses and add sections to watch for seat availability.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {watchedSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-600 mb-4">{section.instructor}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {section.timeSlot} • {section.days.join(', ')}
                </div>
                <div className="text-sm font-medium">
                  {section.availableSeats} / {section.totalCapacity} seats available
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
