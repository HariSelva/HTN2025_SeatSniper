import React from 'react';
import { useParams } from 'react-router-dom';
import { SectionCard } from '@/components/ui/SectionCard';

// Mock data for demonstration
const mockSections = [
  {
    id: '1',
    courseId: '1',
    title: 'CS101 - Section A',
    instructor: 'Dr. Smith',
    timeSlot: '9:00 AM - 10:30 AM',
    days: ['Monday', 'Wednesday', 'Friday'],
    availableSeats: 5,
    totalCapacity: 30,
    location: 'Room 101',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    courseId: '1',
    title: 'CS101 - Section B',
    instructor: 'Dr. Johnson',
    timeSlot: '2:00 PM - 3:30 PM',
    days: ['Tuesday', 'Thursday'],
    availableSeats: 0,
    totalCapacity: 25,
    location: 'Room 102',
    lastUpdated: new Date().toISOString(),
  },
];

export const SectionsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Sections</h1>
      
      <div className="space-y-4">
        {mockSections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};
