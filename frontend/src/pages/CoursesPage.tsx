import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockCourses = [
  { 
    id: '1', 
    name: 'Introduction to Computer Science', 
    code: 'CS101',
    description: 'Learn the fundamentals of programming and computer science concepts.',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500',
    sections: 3,
    students: 120
  },
  { 
    id: '2', 
    name: 'Data Structures and Algorithms', 
    code: 'CS201',
    description: 'Master essential data structures and algorithmic problem-solving techniques.',
    icon: '🔧',
    color: 'from-purple-500 to-pink-500',
    sections: 2,
    students: 95
  },
  { 
    id: '3', 
    name: 'Database Systems', 
    code: 'CS301',
    description: 'Design and implement efficient database systems and query optimization.',
    icon: '🗄️',
    color: 'from-green-500 to-emerald-500',
    sections: 4,
    students: 78
  },
  { 
    id: '4', 
    name: 'Machine Learning', 
    code: 'CS401',
    description: 'Explore AI and machine learning algorithms for real-world applications.',
    icon: '🤖',
    color: 'from-orange-500 to-red-500',
    sections: 2,
    students: 65
  },
];

export const CoursesPage: React.FC = () => {
  return (
    <div className="container-premium py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="heading-premium mb-4">
          Available Courses
        </h1>
        <p className="subheading-premium max-w-2xl mx-auto">
          Discover and monitor course sections for Hack the North 2025. 
          Get real-time updates on seat availability and never miss an opportunity.
        </p>
      </div>
      
      {/* Courses Grid */}
      <div className="grid-premium-3">
        {mockCourses.map((course, index) => (
          <div
            key={course.id}
            className="card-premium animate-fade-in-premium group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="card-premium-header">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {course.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {course.name}
                    </h2>
                    <p className="text-sm text-primary-600 font-semibold">{course.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium">Sections</div>
                  <div className="text-2xl font-bold text-gray-900">{course.sections}</div>
                </div>
              </div>
            </div>
            
            <div className="card-premium-body">
              <p className="text-premium mb-6 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>{course.sections} sections</span>
                </div>
              </div>
              
              <Link
                to={`/sections/${course.id}`}
                className="btn-primary-premium w-full group-hover:shadow-medium transition-all duration-300"
              >
                View Sections
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
