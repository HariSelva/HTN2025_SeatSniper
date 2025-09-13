import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockCourses = [
  { id: '1', name: 'Introduction to Computer Science', code: 'CS101' },
  { id: '2', name: 'Data Structures and Algorithms', code: 'CS201' },
  { id: '3', name: 'Database Systems', code: 'CS301' },
  { id: '4', name: 'Machine Learning', code: 'CS401' },
];

export const CoursesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {course.name}
            </h2>
            <p className="text-gray-600 mb-4">{course.code}</p>
            <Link
              to={`/sections/${course.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View Sections
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
