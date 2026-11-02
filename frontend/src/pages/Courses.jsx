import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const isEnrolled = (slug) =>
    user?.enrolled_courses?.includes(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="inline-block rounded-full bg-brand-light px-6 py-3 text-3xl font-bold tracking-tight text-brand-purple sm:text-4xl lg:text-5xl">
          Explore Our Programmes
        </h1>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-gray-200 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const enrolled = isEnrolled(course.slug);

            return (
              <div
                key={course.slug}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/course-placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="text-7xl">📘</div>
                  )}

                  {/* Enrolled Badge */}
                  {enrolled && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      ✓ Enrolled
                    </span>
                  )}

                  {/* Duration */}
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    ⏱ {course.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">
                    {course.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-6 flex-1">
                    {course.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    {course.certificate && (
                      <div className="flex items-center gap-2">
                        🎓
                        <span>
                          Certificate Awarded by Corporates Guide
                        </span>
                      </div>
                    )}

                    {course.placement_support && (
                      <div className="flex items-center gap-2">
                        💼
                        <span>100% Placement Support</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/courses/${encodeURIComponent(course.slug)}`)
                    }
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#440D70] to-indigo-600 py-3 font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}