import React from 'react';
import { useParams, Link } from 'react-router-dom';
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
  {
    id: '3',
    courseId: '1',
    title: 'CS101 - Section C',
    instructor: 'Prof. Williams',
    timeSlot: '11:00 AM - 12:30 PM',
    days: ['Monday', 'Wednesday', 'Friday'],
    availableSeats: 12,
    totalCapacity: 35,
    location: 'Room 103',
    lastUpdated: new Date().toISOString(),
  },
];

const courseInfo = {
  '1': {
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Learn the fundamentals of programming and computer science concepts.',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500'
  }
};

export const SectionsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? courseInfo[courseId as keyof typeof courseInfo] : null;

  const totalSections = mockSections.length;
  const availableSections = mockSections.filter(s => s.availableSeats > 0).length;
  const totalSeats = mockSections.reduce((sum, s) => sum + s.totalCapacity, 0);
  const availableSeats = mockSections.reduce((sum, s) => sum + s.availableSeats, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/courses" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back to Courses
        </Link>
        
        {course && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl">{course.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.name}</h1>
              <p className="text-gray-600 font-mono">{course.code}</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{totalSections}</div>
          <div className="text-sm text-gray-600">Total Sections</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{availableSections}</div>
          <div className="text-sm text-gray-600">Available</div>
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
      
      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Available Sections</h2>
        
        <div className="space-y-4">
          {mockSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};
