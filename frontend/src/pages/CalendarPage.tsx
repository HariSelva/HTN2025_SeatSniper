import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  course: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'exam' | 'assignment';
  startTime: string;
  endTime: string;
  location: string;
  professor: string;
  color: string;
}

interface EnrolledCourse {
  id: string;
  name: string;
  code: string;
  professor: string;
  color: string;
  schedule: {
    day: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string;
    endTime: string;
    type: 'lecture' | 'lab' | 'tutorial';
    location: string;
  }[];
}

const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    professor: 'Dr. Sarah Johnson',
    color: 'bg-blue-500',
    schedule: [
      { day: 1, startTime: '09:00', endTime: '10:30', type: 'lecture', location: 'MC 4020' },
      { day: 3, startTime: '09:00', endTime: '10:30', type: 'lecture', location: 'MC 4020' },
      { day: 5, startTime: '09:00', endTime: '10:30', type: 'lecture', location: 'MC 4020' },
    ]
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    professor: 'Prof. Michael Chen',
    color: 'bg-purple-500',
    schedule: [
      { day: 2, startTime: '14:00', endTime: '15:30', type: 'lecture', location: 'DC 1351' },
      { day: 4, startTime: '14:00', endTime: '15:30', type: 'lecture', location: 'DC 1351' },
      { day: 4, startTime: '16:00', endTime: '17:00', type: 'tutorial', location: 'MC 2066' },
    ]
  },
  {
    id: '3',
    name: 'Web Development',
    code: 'CS250',
    professor: 'Dr. Alex Thompson',
    color: 'bg-green-500',
    schedule: [
      { day: 1, startTime: '10:00', endTime: '11:30', type: 'lecture', location: 'MC 3003' },
      { day: 3, startTime: '10:00', endTime: '11:30', type: 'lecture', location: 'MC 3003' },
      { day: 2, startTime: '15:00', endTime: '17:00', type: 'lab', location: 'MC 3003' },
    ]
  }
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (selectedWeek * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();

  const getEventsForTimeSlot = (day: number, time: string) => {
    const events: CalendarEvent[] = [];
    
    mockEnrolledCourses.forEach(course => {
      course.schedule.forEach(schedule => {
        if (schedule.day === day) {
          const scheduleStart = schedule.startTime.replace(':', '');
          const scheduleEnd = schedule.endTime.replace(':', '');
          const currentTime = time.replace(':', '');
          
          if (currentTime >= scheduleStart && currentTime < scheduleEnd) {
            events.push({
              id: `${course.id}-${schedule.day}-${schedule.startTime}`,
              title: course.code,
              course: course.name,
              type: schedule.type,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              location: schedule.location,
              professor: course.professor,
              color: course.color
            });
          }
        }
      });
    });
    
    return events;
  };

  const getEventDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    return Math.floor((end - start) / 30); // Duration in 30-minute slots
  };

  const formatTime = (time: string) => {
    const hour = parseInt(time.substring(0, 2));
    const minute = time.substring(3);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <div className="container-premium py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-premium mb-2">Your Calendar</h1>
          <p className="subheading-premium">
            View your course schedule and manage your time effectively
          </p>
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedWeek(selectedWeek - 1)}
            className="btn-secondary-premium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {weekDates[1].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600">
              {weekDates[1].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </div>
          </div>
          
          <button
            onClick={() => setSelectedWeek(selectedWeek + 1)}
            className="btn-secondary-premium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Enrolled Courses Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {mockEnrolledCourses.map(course => (
          <div key={course.id} className="card-premium">
            <div className="card-premium-body">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-4 h-4 ${course.color} rounded-full`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{course.code}</h3>
                  <p className="text-sm text-gray-600">{course.professor}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">{course.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-4 bg-gray-50 font-semibold text-gray-900">Time</div>
              {daysOfWeek.map((day, index) => (
                <div key={day} className="p-4 bg-gray-50 text-center">
                  <div className="font-semibold text-gray-900">{day}</div>
                  <div className="text-sm text-gray-600">
                    {weekDates[index].getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="grid grid-cols-8 border-b border-gray-100">
                <div className="p-2 bg-gray-50 text-sm text-gray-600 font-medium">
                  {formatTime(time)}
                </div>
                
                {daysOfWeek.map((day, dayIndex) => {
                  const events = getEventsForTimeSlot(dayIndex, time);
                  const isFirstSlotOfEvent = events.length > 0 && 
                    !getEventsForTimeSlot(dayIndex, timeSlots[timeIndex - 1] || '00:00').some(
                      prevEvent => events.some(event => event.id === prevEvent.id)
                    );
                  
                  return (
                    <div key={`${day}-${time}`} className="p-1 border-r border-gray-100 h-12 relative">
                      {events.map(event => {
                        if (isFirstSlotOfEvent) {
                          const duration = getEventDuration(event.startTime, event.endTime);
                          return (
                            <div
                              key={event.id}
                              className={`absolute inset-x-1 ${event.color} text-white text-xs p-1 rounded shadow-sm z-10`}
                              style={{
                                height: `${duration * 48 - 4}px`, // 48px per slot minus margin
                                top: '2px'
                              }}
                            >
                              <div className="font-semibold">{event.title}</div>
                              <div className="text-xs opacity-90">{event.location}</div>
                              <div className="text-xs opacity-75">
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {mockEnrolledCourses
            .flatMap(course => 
              course.schedule.map(schedule => ({
                ...schedule,
                courseName: course.name,
                courseCode: course.code,
                professor: course.professor,
                color: course.color
              }))
            )
            .filter(event => event.day === new Date().getDay())
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((event, index) => (
              <div key={index} className="card-premium">
                <div className="card-premium-body">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${event.color} rounded-full`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.courseCode}</h3>
                        <p className="text-sm text-gray-600">{event.courseName}</p>
                        <p className="text-sm text-gray-500">{event.professor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                      <div className="text-xs text-gray-500 capitalize">{event.type}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {mockEnrolledCourses
          .flatMap(course => course.schedule)
          .filter(event => event.day === new Date().getDay()).length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600">No classes scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
};
