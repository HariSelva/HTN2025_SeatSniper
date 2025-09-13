import React, { useState, useEffect } from "react";
import { apiClient } from "@/utils/api";

interface CourseIntelData {
  course: string;
  term: string;
  summary: string;
  workload: {
    weekly_hours: string;
    assessment_mix: string[];
  };
  difficulty: string;
  tips: string[];
  pitfalls: string[];
  prof_notes: Array<{
    name: string;
    take: string;
  }>;
  sources: Array<{
    title: string;
    subreddit: string;
    permalink: string;
    score: number;
    age_days: number;
  }>;
}

interface CourseIntelProps {
  course: string;
  term?: string;
}

const getMockIntel = (): CourseIntelData => ({
  course: "CS101",
  term: "F2025",
  summary: "CS101 is an introductory computer science course that covers fundamental programming concepts, data structures, and problem-solving techniques. Students learn Python programming and basic algorithms.",
  workload: {
    weekly_hours: "8-12 hours",
    assessment_mix: ["Weekly programming assignments", "Midterm exam", "Final project", "Quizzes"]
  },
  difficulty: "Moderate - Good for beginners with some programming experience",
  tips: [
    "Start assignments early - they often take longer than expected",
    "Attend all lectures and take detailed notes",
    "Practice coding daily, even if just for 30 minutes",
    "Form study groups with classmates",
    "Use office hours when you're stuck"
  ],
  pitfalls: [
    "Procrastinating on programming assignments",
    "Not asking for help when stuck",
    "Skipping lectures thinking you can learn from slides alone",
    "Not testing your code thoroughly",
    "Leaving assignments until the last minute"
  ],
  prof_notes: [
    {
      name: "Dr. Smith",
      take: "Excellent professor, very clear explanations and helpful during office hours. Assignments are challenging but fair."
    },
    {
      name: "Prof. Johnson", 
      take: "Good lecturer but can be strict with deadlines. Make sure to submit assignments on time."
    }
  ],
  sources: [
    {
      title: "CS101 Course Review - Fall 2024",
      subreddit: "university",
      permalink: "/r/university/comments/abc123/cs101_review",
      score: 45,
      age_days: 7
    },
    {
      title: "Tips for CS101 Success",
      subreddit: "programming",
      permalink: "/r/programming/comments/def456/cs101_tips",
      score: 32,
      age_days: 14
    }
  ]
});

export const CourseIntel: React.FC<CourseIntelProps> = ({
  course,
  term = "F2025",
}) => {
  const [intel, setIntel] = useState<CourseIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchIntel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(
        `/api/course-intel?course=${course}&term=${term}`
      );

      if (response.status === "error") {
        setError(response.message || "Failed to fetch course intel");
      } else if (response.status === "miss" || response.stale) {
        // Trigger refresh if missing or stale
        await refreshIntel();
      } else if (response.intel) {
        setIntel(response.intel);
      }
    } catch (err) {
      setError("Failed to fetch course intel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshIntel = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      // For now, pass empty snippets - later this can be populated with real Reddit data
      const response = await apiClient.post("/api/course-intel/refresh", {
        course,
        term,
        official_desc: `Course information for ${course}`,
        snippets: [],
      });

      if (response.ok && response.intel) {
        setIntel(response.intel);
      } else {
        setError(response.error || "Failed to refresh course intel");
      }
    } catch (err) {
      setError("Failed to refresh course intel");
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, [course, term]);

  if (loading || isRefreshing) {
    return (
      <div className="card-linkedin">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">
            {isRefreshing ? "Building intel..." : "Loading course intel..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-linkedin">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <div className="text-sm text-gray-600 mb-4">
            The Course Intel feature is temporarily unavailable due to database connection issues.
          </div>
          <div className="space-x-3">
            <button onClick={fetchIntel} className="btn-primary-linkedin">
              Retry
            </button>
            <button onClick={() => setIntel(getMockIntel())} className="btn-secondary-linkedin">
              Show Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!intel) {
    return (
      <div className="card-linkedin">
        <div className="text-center p-8">
          <div className="text-gray-600 mb-4">No course intel available</div>
          <button onClick={refreshIntel} className="btn-primary-linkedin">
            Generate Intel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {intel.summary && (
        <div className="card-linkedin">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Summary
          </h3>
          <p className="text-gray-700">{intel.summary}</p>
        </div>
      )}

      {/* Workload & Difficulty */}
      <div className="grid md:grid-cols-2 gap-6">
        {intel.workload && (
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⏰ Workload
            </h3>
            {intel.workload.weekly_hours && (
              <div className="mb-3">
                <span className="font-medium">Weekly Hours:</span>{" "}
                {intel.workload.weekly_hours}
              </div>
            )}
            {intel.workload.assessment_mix &&
              intel.workload.assessment_mix.length > 0 && (
                <div>
                  <span className="font-medium">Assessments:</span>
                  <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    {intel.workload.assessment_mix.map((assessment, index) => (
                      <li key={index}>{assessment}</li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {intel.difficulty && (
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📊 Difficulty
            </h3>
            <p className="text-gray-700">{intel.difficulty}</p>
          </div>
        )}
      </div>

      {/* Tips & Pitfalls */}
      <div className="grid md:grid-cols-2 gap-6">
        {intel.tips && intel.tips.length > 0 && (
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              💡 Tips
            </h3>
            <ul className="space-y-2">
              {intel.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {intel.pitfalls && intel.pitfalls.length > 0 && (
          <div className="card-linkedin">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ⚠️ Pitfalls
            </h3>
            <ul className="space-y-2">
              {intel.pitfalls.map((pitfall, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-gray-700">{pitfall}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Professor Notes */}
      {intel.prof_notes && intel.prof_notes.length > 0 && (
        <div className="card-linkedin">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            👨‍🏫 Professor Notes
          </h3>
          <div className="space-y-3">
            {intel.prof_notes.map((note, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="font-medium text-gray-900">{note.name}</div>
                <div className="text-gray-700">{note.take}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {intel.sources && intel.sources.length > 0 && (
        <div className="card-linkedin">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🔗 Sources
          </h3>
          <div className="space-y-2">
            {intel.sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {source.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    r/{source.subreddit} • {source.score} points •{" "}
                    {source.age_days} days ago
                  </div>
                </div>
                <a
                  href={`https://reddit.com${source.permalink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={refreshIntel}
          disabled={isRefreshing}
          className="btn-secondary-linkedin"
        >
          {isRefreshing ? "Refreshing..." : "Refresh Intel"}
        </button>
      </div>
    </div>
  );
};
