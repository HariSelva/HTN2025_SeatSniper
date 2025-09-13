import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  professor: string;
  professorRating?: number;
  courseRating?: number;
  time: string;
  days: string[];
  location: string;
  credits: number;
  prerequisites?: string[];
  enrolled: number;
  capacity: number;
  tags: string[];
}

const mockCourses: Course[] = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    code: "CS101",
    description:
      "Learn the fundamentals of programming and computer science concepts including algorithms, data structures, and software development.",
    professor: "Dr. Sarah Johnson",
    professorRating: 4.8,
    courseRating: 4.6,
    time: "9:00 AM - 10:30 AM",
    days: ["Mon", "Wed", "Fri"],
    location: "MC 4020",
    credits: 3,
    prerequisites: [],
    enrolled: 85,
    capacity: 120,
    tags: ["Programming", "Beginner", "Popular"],
  },
  {
    id: "2",
    name: "Data Structures and Algorithms",
    code: "CS201",
    description:
      "Master essential data structures and algorithmic problem-solving techniques for efficient software development.",
    professor: "Prof. Michael Chen",
    professorRating: 4.5,
    courseRating: 4.4,
    time: "2:00 PM - 3:30 PM",
    days: ["Tue", "Thu"],
    location: "DC 1351",
    credits: 3,
    prerequisites: ["CS101"],
    enrolled: 72,
    capacity: 95,
    tags: ["Algorithms", "Intermediate", "Core"],
  },
  {
    id: "3",
    name: "Database Systems",
    code: "CS301",
    description:
      "Design and implement efficient database systems and learn query optimization techniques.",
    professor: "Dr. Emily Rodriguez",
    professorRating: 4.7,
    courseRating: 4.3,
    time: "11:00 AM - 12:30 PM",
    days: ["Mon", "Wed", "Fri"],
    location: "MC 2066",
    credits: 3,
    prerequisites: ["CS201"],
    enrolled: 45,
    capacity: 78,
    tags: ["Database", "Advanced", "Practical"],
  },
  {
    id: "4",
    name: "Machine Learning",
    code: "CS401",
    description:
      "Explore AI and machine learning algorithms for real-world applications and data analysis.",
    professor: "Prof. David Kim",
    professorRating: 4.9,
    courseRating: 4.8,
    time: "3:30 PM - 5:00 PM",
    days: ["Tue", "Thu"],
    location: "DC 1304",
    credits: 3,
    prerequisites: ["CS201", "MATH235"],
    enrolled: 58,
    capacity: 65,
    tags: ["AI", "Advanced", "Hot"],
  },
  {
    id: "5",
    name: "Web Development",
    code: "CS250",
    description:
      "Build modern web applications using HTML, CSS, JavaScript, and popular frameworks.",
    professor: "Dr. Alex Thompson",
    professorRating: 4.6,
    courseRating: 4.5,
    time: "10:00 AM - 11:30 AM",
    days: ["Mon", "Wed", "Fri"],
    location: "MC 3003",
    credits: 3,
    prerequisites: ["CS101"],
    enrolled: 92,
    capacity: 100,
    tags: ["Web", "Practical", "Popular"],
  },
  {
    id: "6",
    name: "Software Engineering",
    code: "CS350",
    description:
      "Learn software development methodologies, testing, and project management for large-scale applications.",
    professor: "Prof. Lisa Wang",
    professorRating: 4.4,
    courseRating: 4.2,
    time: "1:00 PM - 2:30 PM",
    days: ["Tue", "Thu"],
    location: "DC 2568",
    credits: 3,
    prerequisites: ["CS201", "CS250"],
    enrolled: 67,
    capacity: 80,
    tags: ["Engineering", "Project", "Core"],
  },
];

export const DiscoverPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const navigate = useNavigate();

  const allTags = Array.from(
    new Set(mockCourses.flatMap((course) => course.tags))
  );

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || course.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const renderStarRating = (rating?: number) => {
    if (!rating)
      return <span className="text-gray-400 text-sm">No rating</span>;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="container-linkedin py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-linkedin mb-4">Discover Courses</h1>
        <p className="subheading-linkedin mb-6">
          Find the perfect courses for your academic journey
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="search-container">
            <svg
              className="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search courses, professors, or course codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="input-linkedin md:w-48"
          >
            <option value="">All Categories</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid-linkedin-3">
        {filteredCourses.map((course, index) => (
          <div
            key={course.id}
            className="course-card animate-fade-in-linkedin"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="card-header-linkedin">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-blue-600 font-medium text-sm">
                    {course.code}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Credits</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {course.credits}
                  </div>
                </div>
              </div>

              {/* Professor Info */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {course.professor}
                  </span>
                  <div className="text-xs text-gray-500">Professor Rating</div>
                </div>
                {renderStarRating(course.professorRating)}
              </div>
            </div>

            <div className="card-body-linkedin">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Course Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{course.time}</span>
                </div>

                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {course.days.join(", ")}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{course.location}</span>
                </div>
              </div>

              {/* Enrollment Status */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Enrollment</span>
                  <span className="text-gray-600">
                    {course.enrolled}/{course.capacity}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(course.enrolled / course.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Course Rating and Tags */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Course Rating
                  </div>
                  {renderStarRating(course.courseRating)}
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-2">
                    Prerequisites
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.prerequisites.map((prereq) => (
                      <span
                        key={prereq}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                      >
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  className="btn-primary-linkedin flex-1"
                  onClick={() => navigate(`/courses/${course.code}/sections`)}
                >
                  View Sections
                </button>
                <button className="btn-secondary-linkedin">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};
