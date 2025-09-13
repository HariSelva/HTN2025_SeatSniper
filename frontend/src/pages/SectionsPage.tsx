import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionCard } from "@/components/ui/SectionCard";
import { CourseIntel } from "@/components/ui/CourseIntel";

// Mock data for demonstration
const mockSections = [
  {
    id: "CS101-A",
    courseId: "CS101",
    title: "CS101 - Section A",
    instructor: "Dr. Smith",
    timeSlot: "9:00 AM - 10:30 AM",
    days: ["Monday", "Wednesday", "Friday"],
    availableSeats: 5,
    totalCapacity: 30,
    location: "Room 101",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "CS101-B",
    courseId: "CS101",
    title: "CS101 - Section B",
    instructor: "Dr. Johnson",
    timeSlot: "2:00 PM - 3:30 PM",
    days: ["Tuesday", "Thursday"],
    availableSeats: 0,
    totalCapacity: 25,
    location: "Room 102",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "CS101-C",
    courseId: "CS101",
    title: "CS101 - Section C",
    instructor: "Prof. Williams",
    timeSlot: "11:00 AM - 12:30 PM",
    days: ["Monday", "Wednesday", "Friday"],
    availableSeats: 12,
    totalCapacity: 35,
    location: "Room 103",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    courseId: '1',
    title: 'CS101 - Section D',
    instructor: 'Dr. Brown',
    timeSlot: '4:00 PM - 5:30 PM',
    days: ['Tuesday', 'Thursday'],
    availableSeats: 0,
    totalCapacity: 20,
    location: 'Room 104',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    courseId: '1',
    title: 'CS101 - Section E',
    instructor: 'Prof. Davis',
    timeSlot: '1:00 PM - 2:30 PM',
    days: ['Monday', 'Wednesday', 'Friday'],
    availableSeats: 0,
    totalCapacity: 28,
    location: 'Room 105',
    lastUpdated: new Date().toISOString(),
  },
];

const courseInfo = {
  CS101: {
    name: "Introduction to Computer Science",
    code: "CS101",
    description:
      "Learn the fundamentals of programming and computer science concepts.",
    icon: "💻",
    color: "from-blue-500 to-cyan-500",
  },
  CS201: {
    name: "Data Structures and Algorithms",
    code: "CS201",
    description:
      "Master essential data structures and algorithmic problem-solving techniques.",
    icon: "🔧",
    color: "from-green-500 to-emerald-500",
  },
  CS301: {
    name: "Database Systems",
    code: "CS301",
    description:
      "Design and implement efficient database systems and learn query optimization.",
    icon: "🗄️",
    color: "from-purple-500 to-violet-500",
  },
  CS401: {
    name: "Machine Learning",
    code: "CS401",
    description:
      "Explore AI and machine learning algorithms for real-world applications.",
    icon: "🤖",
    color: "from-orange-500 to-red-500",
  },
  CS250: {
    name: "Web Development",
    code: "CS250",
    description:
      "Build modern web applications using HTML, CSS, JavaScript, and frameworks.",
    icon: "🌐",
    color: "from-cyan-500 to-blue-500",
  },
  CS350: {
    name: "Software Engineering",
    code: "CS350",
    description:
      "Learn software development methodologies, testing, and project management.",
    icon: "⚙️",
    color: "from-indigo-500 to-purple-500",
  },
};

export const SectionsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = courseId
    ? courseInfo[courseId as keyof typeof courseInfo]
    : null;

  // Filter sections for the current course
  const courseSections = mockSections.filter((s) => s.courseId === courseId);

  const totalSections = courseSections.length;
  const availableSections = courseSections.filter(
    (s) => s.availableSeats > 0
  ).length;
  const totalSeats = courseSections.reduce(
    (sum, s) => sum + s.totalCapacity,
    0
  );
  const availableSeats = courseSections.reduce(
    (sum, s) => sum + s.availableSeats,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          ← Back to Courses
        </button>

        {course && (
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-3xl">{course.icon}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.name}
              </h1>
              <p className="text-gray-600 font-mono">{course.code}</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalSections}
          </div>
          <div className="text-sm text-gray-600">Total Sections</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-green-600">
            {availableSections}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-gray-600">{totalSeats}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-orange-600">
            {availableSeats}
          </div>
          <div className="text-sm text-gray-600">Available Seats</div>
        </div>
      </div>

      {/* Course Intel */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Course Intel
        </h2>
        <CourseIntel course={courseId || "CS101"} term="F2025" />
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Available Sections
        </h2>

        <div className="space-y-4">
          {courseSections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};
