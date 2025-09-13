import React from 'react';
import { Section } from '@/types';
import { WatchButton } from './WatchButton';
import { HoldButton } from './HoldButton';

interface SectionCardProps {
  section: Section;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            {section.title}
          </h2>
          <p className="text-gray-600">{section.instructor}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {section.availableSeats} / {section.totalCapacity} seats
          </div>
          <div className={`text-sm font-medium ${
            section.availableSeats > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {section.availableSeats > 0 ? 'Available' : 'Full'}
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Time:</span> {section.timeSlot}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Days:</span> {section.days.join(', ')}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Location:</span> {section.location}
        </p>
      </div>
      
      <div className="flex space-x-3">
        <WatchButton sectionId={section.id} />
        {section.availableSeats > 0 && (
          <HoldButton sectionId={section.id} />
        )}
      </div>
    </div>
  );
};
