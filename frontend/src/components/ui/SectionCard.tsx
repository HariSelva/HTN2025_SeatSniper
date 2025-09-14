import React from 'react';
import { Section } from '@/types';
import { WatchButton } from './WatchButton';
import { HoldButton } from './HoldButton';
import { NotifyButton } from './NotifyButton';

interface SectionCardProps {
  section: Section;
}

export const SectionCard: React.FC<SectionCardProps> = ({ section }) => {
  const availableSeats = section.availableSeats || 0;
  const totalCapacity = section.totalCapacity || 1; // Avoid division by zero
  const isAvailable = availableSeats > 0;
  const seatPercentage = totalCapacity > 0 ? (availableSeats / totalCapacity) * 100 : 0;
  
  const getAvailabilityColor = () => {
    if (seatPercentage > 50) return 'text-green-600 bg-green-100';
    if (seatPercentage > 20) return 'text-yellow-600 bg-yellow-100';
    if (seatPercentage > 0) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getAvailabilityText = () => {
    if (seatPercentage > 50) return 'Plenty Available';
    if (seatPercentage > 20) return 'Limited Spots';
    if (seatPercentage > 0) return 'Almost Full';
    return 'Fully Booked';
  };

  return (
    <div className="card-premium group">
      <div className="card-premium-header">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {section.title}
            </h2>
            {section.instructor && section.instructor !== "TBD" && (
              <p className="text-gray-600 font-medium">{section.instructor}</p>
            )}
          </div>
          
          {/* Availability Badge */}
          <div className={`status-premium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </div>
        </div>
      </div>
      
      <div className="card-premium-body">
        {/* Section Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {section.timeSlot && section.timeSlot !== "TBD" && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</div>
                <div className="text-sm font-semibold text-gray-900">{section.timeSlot}</div>
              </div>
            </div>
          )}
          
          {section.days && section.days.length > 0 && !section.days.includes("TBD") && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Days</div>
                <div className="text-sm font-semibold text-gray-900">
                  {section.days.slice(0, 2).join(', ')}
                  {section.days.length > 2 && ' +'}
                </div>
              </div>
            </div>
          )}
          
          {section.location && section.location !== "TBD" && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</div>
                <div className="text-sm font-semibold text-gray-900">{section.location}</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Seat Availability */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Seat Availability</span>
            <span className="text-sm text-gray-500">
              {availableSeats} / {totalCapacity} seats
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                seatPercentage > 50 ? 'bg-green-500' :
                seatPercentage > 20 ? 'bg-yellow-500' :
                seatPercentage > 0 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${seatPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <WatchButton sectionId={section.id} />
          {isAvailable ? (
            <HoldButton sectionId={section.id} />
          ) : (
            <NotifyButton sectionId={section.id} />
          )}
        </div>
      </div>
    </div>
  );
};
