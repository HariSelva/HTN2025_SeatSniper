import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionCard } from "@/components/ui/SectionCard";
import { CourseIntel } from "@/components/ui/CourseIntel";
import { apiClient, transformToCamelCase } from "@/utils/api";

interface Section {
  id: string;
  courseId?: string;
  course_id?: string;
  title?: string;
  instructor?: string;
  timeSlot?: string;
  time_slot?: string;
  days?: string[];
  availableSeats?: number;
  available_seats?: number;
  totalCapacity?: number;
  total_capacity?: number;
  location?: string;
  lastUpdated?: string;
  last_updated?: string;
  section?: string;
}

// Helper function to get course info based on course code
const getCourseInfo = (courseCode: string, courseTitle?: string) => {
  const subject = courseCode.substring(0, 2);
  const catalogNumber = courseCode.substring(2);
  
  const icons: { [key: string]: string } = {
    "CS": "💻",
    "ECE": "⚡",
    "ME": "🔧",
    "MATH": "📐",
    "PHYS": "🔬",
    "CHEM": "🧪",
  };
  
  const colors: { [key: string]: string } = {
    "CS": "from-blue-500 to-cyan-500",
    "ECE": "from-green-500 to-emerald-500", 
    "ME": "from-purple-500 to-violet-500",
    "MATH": "from-orange-500 to-red-500",
    "PHYS": "from-indigo-500 to-purple-500",
    "CHEM": "from-pink-500 to-rose-500",
  };
  
  return {
    name: courseTitle || `${subject} ${catalogNumber}`,
    code: courseCode,
    description: `${subject} course covering specialized topics and practical applications.`,
    icon: icons[subject] || "📚",
    color: colors[subject] || "from-gray-500 to-gray-600",
  };
};

export const SectionsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const course = courseId ? getCourseInfo(courseId) : null;

  // Fetch sections from API
  useEffect(() => {
    const fetchSections = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get("/api/sections/");
        // Transform snake_case to camelCase and extract data
        const transformedData = transformToCamelCase(response);
        
        // Filter sections for the specific course
        const courseSections = transformedData.filter((section: any) => {
          const sectionCourseCode = `${section.subject}${section.catalogNumber}`;
          return sectionCourseCode === courseId;
        });
        
        setSections(courseSections);
      } catch (err) {
        setError("Failed to fetch sections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  // Transform API data to match component expectations
  const courseSections = sections.map(section => ({
    id: section.classNumber || `${section.subject}${section.catalogNumber}-${section.componentSection}`,
    courseId: `${section.subject}${section.catalogNumber}`,
    title: `${section.subject}${section.catalogNumber} - ${section.componentSection}`,
    instructor: "TBD", // Not available in API
    timeSlot: "TBD", // Not available in API
    days: ["TBD"], // Not available in API
    availableSeats: section.availableSeats || 0,
    totalCapacity: section.enrollmentCapacity || 0,
    location: "TBD", // Not available in API
    lastUpdated: new Date().toISOString(),
  }));

  const totalSections = courseSections.length;
  const availableSections = courseSections.filter(
    (s) => (s.availableSeats || 0) > 0
  ).length;
  const totalSeats = courseSections.reduce(
    (sum, s) => sum + (s.totalCapacity || 0),
    0
  );
  const availableSeats = courseSections.reduce(
    (sum, s) => sum + (s.availableSeats || 0),
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
            {totalSections || 0}
          </div>
          <div className="text-sm text-gray-600">Total Sections</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-green-600">
            {availableSections || 0}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-gray-600">{totalSeats || 0}</div>
          <div className="text-sm text-gray-600">Total Seats</div>
        </div>
        <div className="card-linkedin text-center">
          <div className="text-2xl font-bold text-orange-600">
            {availableSeats || 0}
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

        {loading ? (
          <div className="card-linkedin">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading sections...</span>
            </div>
          </div>
        ) : error ? (
          <div className="card-linkedin">
            <div className="text-center p-8">
              <div className="text-red-600 mb-4">⚠️ {error}</div>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary-linkedin"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {courseSections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
            {courseSections.length === 0 && (
              <div className="card-linkedin text-center p-8">
                <div className="text-gray-600">No sections found for this course.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
