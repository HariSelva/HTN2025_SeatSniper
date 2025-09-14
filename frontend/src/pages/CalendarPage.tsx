import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  type: 'lecture' | 'tutorial' | 'lab' | 'exam' | 'assignment';
  course: string;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'CS101 - Introduction to Computer Science',
    time: '9:00 AM - 10:20 AM',
    location: 'MC 2065',
    type: 'lecture',
    course: 'CS101',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'CS101 - Tutorial',
    time: '10:30 AM - 11:20 AM',
    location: 'MC 2017',
    type: 'tutorial',
    course: 'CS101',
    color: 'bg-blue-400'
  },
  {
    id: '3',
    title: 'MATH101 - Calculus I',
    time: '1:00 PM - 2:20 PM',
    location: 'MC 2065',
    type: 'lecture',
    course: 'MATH101',
    color: 'bg-green-500'
  },
  {
    id: '4',
    title: 'CS101 - Assignment 1 Due',
    time: '11:59 PM',
    location: 'Online',
    type: 'assignment',
    course: 'CS101',
    color: 'bg-red-500'
  },
  {
    id: '5',
    title: 'MATH101 - Midterm Exam',
    time: '2:30 PM - 4:00 PM',
    location: 'PAC 1001',
    type: 'exam',
    course: 'MATH101',
    color: 'bg-orange-500'
  }
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lecture':
        return '📚';
      case 'tutorial':
        return '👥';
      case 'lab':
        return '🔬';
      case 'exam':
        return '📝';
      case 'assignment':
        return '📋';
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lecture':
        return 'text-blue-600 bg-blue-100';
      case 'tutorial':
        return 'text-green-600 bg-green-100';
      case 'lab':
        return 'text-purple-600 bg-purple-100';
      case 'exam':
        return 'text-red-600 bg-red-100';
      case 'assignment':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="container-premium py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="heading-premium mb-2">Your Calendar</h1>
          <p className="subheading-premium">
            Manage your course schedule and stay organized
          </p>
        </div>
        
        {/* View Controls */}
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week View
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month View
          </button>
        </div>
      </div>

      {/* Calendar Demo Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="card-premium">
            <div className="card-premium-body p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {viewMode === 'week' ? 'This Week' : 'This Month'}
              </h3>
              
              {viewMode === 'week' ? (
                <div className="grid grid-cols-6 gap-2">
                  {/* Time column header */}
                  <div className="text-sm font-medium text-gray-500 p-2"></div>
                  {days.map((day) => (
                    <div key={day} className="text-sm font-medium text-gray-500 p-2 text-center">
                      {day}
                    </div>
                  ))}
                  
                  {/* Time slots */}
                  {timeSlots.map((time, timeIndex) => (
                    <React.Fragment key={time}>
                      <div className="text-xs text-gray-400 p-1 text-right">
                        {time}
                      </div>
                      {days.map((day, dayIndex) => (
                        <div
                          key={`${day}-${time}`}
                          className="border border-gray-200 h-16 p-1 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          {/* Events for this time slot */}
                          {mockEvents
                            .filter(event => {
                              const eventTime = event.time.split(' - ')[0];
                              return eventTime === time;
                            })
                            .map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded cursor-pointer ${event.color} text-white mb-1`}
                                onClick={() => setSelectedEvent(event)}
                              >
                                {event.title.split(' - ')[0]}
                              </div>
                            ))}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Month View Coming Soon</h4>
                  <p className="text-gray-600">Switch to week view to see your current schedule</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="card-premium">
            <div className="card-premium-body p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {mockEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 ${event.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-premium">
            <div className="card-premium-body p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📚</span>
                    <span className="text-sm font-medium">Add Course</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📝</span>
                    <span className="text-sm font-medium">Add Assignment</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">🔔</span>
                    <span className="text-sm font-medium">Set Reminder</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="card-premium">
            <div className="card-premium-body p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lectures</span>
                  <span className="text-sm font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tutorials</span>
                  <span className="text-sm font-medium">4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Assignments Due</span>
                  <span className="text-sm font-medium text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Exams</span>
                  <span className="text-sm font-medium text-orange-600">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getEventTypeIcon(selectedEvent.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedEvent.course}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">{selectedEvent.time}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-600">{selectedEvent.location}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Edit Event
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};