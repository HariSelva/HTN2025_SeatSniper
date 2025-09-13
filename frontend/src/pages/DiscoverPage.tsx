import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, transformToCamelCase } from "@/utils/api";

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
  isFull?: boolean;
}

interface ApiCourse {
  subject: string;
  catalog_number: string;
  title: string;
  class_number: string;
  component_section: string;
  enrollment_capacity: number;
  enrollment_total: number;
  available_seats: number;
}

// Helper function to generate course tags based on subject and catalog number
const generateCourseTags = (subject: string, catalogNumber: string): string[] => {
  const tags: string[] = [];
  
  // Subject-based tags
  if (subject === "CS") {
    tags.push("Computer Science");
    if (parseInt(catalogNumber) < 200) tags.push("Beginner");
    else if (parseInt(catalogNumber) < 400) tags.push("Intermediate");
    else tags.push("Advanced");
  } else if (subject === "ECE") {
    tags.push("Electrical Engineering");
    if (parseInt(catalogNumber) < 200) tags.push("Beginner");
    else if (parseInt(catalogNumber) < 400) tags.push("Intermediate");
    else tags.push("Advanced");
  } else if (subject === "ME") {
    tags.push("Mechanical Engineering");
    if (parseInt(catalogNumber) < 200) tags.push("Beginner");
    else if (parseInt(catalogNumber) < 400) tags.push("Intermediate");
    else tags.push("Advanced");
  }
  
  // Component section based tags
  if (catalogNumber.includes("6")) tags.push("Graduate");
  if (catalogNumber.includes("7")) tags.push("Graduate");
  if (catalogNumber.includes("8")) tags.push("Graduate");
  
  return tags;
};

// Helper function to generate course description
const generateCourseDescription = (title: string, subject: string, catalogNumber: string): string => {
  const descriptions: { [key: string]: string } = {
    "CS": "Computer Science course covering fundamental concepts and practical applications.",
    "ECE": "Electrical and Computer Engineering course focusing on hardware and software systems.",
    "ME": "Mechanical Engineering course covering design, analysis, and manufacturing principles."
  };
  
  return descriptions[subject] || `${title} - Advanced course covering specialized topics in ${subject}.`;
};

export const DiscoverPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<ApiCourse[]>("/api/sections/");
        const transformedData = transformToCamelCase(response);
        
        // Group courses by subject + catalog_number to avoid duplicates
        const courseMap = new Map<string, Course>();
        
        transformedData.forEach((apiCourse: ApiCourse) => {
          const courseCode = `${apiCourse.subject}${apiCourse.catalogNumber}`;
          
          if (!courseMap.has(courseCode)) {
            const course: Course = {
              id: courseCode,
              name: apiCourse.title,
              code: courseCode,
              description: generateCourseDescription(apiCourse.title, apiCourse.subject, apiCourse.catalogNumber),
              professor: "TBD", // Not available in API
              professorRating: undefined,
              courseRating: undefined,
              time: "TBD", // Not available in API
              days: ["TBD"], // Not available in API
              location: "TBD", // Not available in API
              credits: 3, // Default value
              prerequisites: [],
              enrolled: apiCourse.enrollmentTotal,
              capacity: apiCourse.enrollmentCapacity,
              tags: generateCourseTags(apiCourse.subject, apiCourse.catalogNumber),
              isFull: apiCourse.availableSeats <= 0,
            };
            courseMap.set(courseCode, course);
          } else {
            // Update enrollment info if this section has more students
            const existingCourse = courseMap.get(courseCode)!;
            existingCourse.enrolled += apiCourse.enrollmentTotal;
            existingCourse.capacity += apiCourse.enrollmentCapacity;
            existingCourse.isFull = existingCourse.enrolled >= existingCourse.capacity;
          }
        });
        
        setCourses(Array.from(courseMap.values()));
      } catch (err) {
        setError("Failed to fetch courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const allTags = Array.from(
    new Set(courses.flatMap((course) => course.tags))
  );

  const filteredCourses = courses.filter((course) => {
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

  if (loading) {
    return (
      <div className="container-linkedin py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading courses...</h3>
          <p className="text-gray-600">Fetching real-time course data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-linkedin py-8">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courses</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary-linkedin"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-linkedin py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-linkedin mb-4">Available Courses</h1>
        <p className="subheading-linkedin mb-6">
          Discover and monitor course sections for Hack the North 2025. Get
          real-time updates on seat availability and never miss an opportunity.
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
                  {course.isFull && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Full
                      </span>
                    </div>
                  )}
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
                {course.isFull ? (
                  <button className="btn-linkedin flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200">
                    Notify me when available
                  </button>
                ) : (
                  <button className="btn-primary-linkedin flex-1">
                    Enroll Now
                  </button>
                )}
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
