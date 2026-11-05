import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

function ContentList({ items, ordered = false }) {
  const List = ordered ? "ol" : "ul";

  return (
    <List
      className={
        ordered
          ? "list-decimal space-y-3 pl-5"
          : "space-y-3"
      }
    >
      {items.map((item) => (
        <li
          key={item}
          className={
            ordered
              ? "pl-2 text-sm leading-6 text-gray-700 dark:text-gray-300"
              : "flex items-start gap-3 text-sm leading-6 text-gray-700 dark:text-gray-300"
          }
        >
          {!ordered && (
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-[#440D70] dark:bg-purple-950 dark:text-purple-200"
            >
              ✓
            </span>
          )}
          {item}
        </li>
      ))}
    </List>
  );
}

function DetailSection({ title, children }) {
  return (
    <section className="border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function CourseDetails() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setLoadError("");
    setCourse(null);

    api
      .get("/courses")
      .then(({ data }) => {
        const selectedCourse = data.find((item) => item.slug === courseSlug);
        if (!selectedCourse) {
          throw new Error("The requested course could not be found.");
        }
        if (active) setCourse(selectedCourse);
      })
      .catch((error) => {
        if (active) {
          setLoadError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load course details.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseSlug]);

  if (loading) {
    return (
      <main className="min-h-[65vh] bg-gray-50 px-4 py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </main>
    );
  }

  if (loadError || !course) {
    return (
      <main className="min-h-[65vh] px-4 py-20 text-center">
        <p role="alert" className="text-lg font-semibold text-red-600">
          {loadError || "Course details are unavailable."}
        </p>
        <Link
          to="/courses"
          className="mt-5 inline-flex font-semibold text-[#440D70] hover:underline dark:text-purple-300"
        >
          Browse all courses
        </Link>
      </main>
    );
  }

  const enrolled = user?.enrolled_courses?.includes(course.slug);
  const fee = Number(course.fee).toLocaleString("en-IN");

  return (
    <main className="bg-gray-50 dark:bg-gray-900">
      <header className="bg-[#1c1d1f] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
          <div className="max-w-3xl">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-200 hover:text-white"
            >
              <span aria-hidden="true">←</span> All courses
            </Link>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-purple-200">
              Corporates Guide course
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {course.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(course.technologies || []).map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white"
                >
                  {technology}
                </span>
              ))}
            </div>
            {enrolled && (
              <p className="mt-6 inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-200">
                ✓ You are enrolled
              </p>
            )}
          </div>
          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="order-2 space-y-6 py-8 lg:order-1">
          <DetailSection title="What you'll learn">
            <ContentList items={course.learning_outcomes || []} />
          </DetailSection>

          <DetailSection title="Course overview">
            <p className="leading-7 text-gray-700 dark:text-gray-300">
              {course.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                Duration: {course.duration}
              </span>
              {course.certificate && (
                <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                  Certificate included
                </span>
              )}
              {course.placement_support && (
                <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                  Placement support
                </span>
              )}
            </div>
          </DetailSection>

          <DetailSection title="Course syllabus">
            <ContentList items={course.syllabus || []} ordered />
          </DetailSection>

          <DetailSection title="Key features">
            <ContentList items={course.key_features || []} />
          </DetailSection>

          <DetailSection title="Course benefits">
            <ContentList items={course.benefits || []} />
          </DetailSection>
        </div>

        <aside className="relative z-10 order-1 lg:-mt-40 lg:order-2">
          <div className="overflow-hidden border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 lg:sticky lg:top-6">
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
              {course.image ? (
                <img
                  src={course.image}
                  alt={`${course.title} course`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">
                  📘
                </div>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-sm font-semibold text-white">
                Course overview
              </span>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Course fee
              </p>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                ₹{fee}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                One-time payment for this course.
              </p>
              <button
                type="button"
                onClick={() =>
                  navigate(`/payment/${encodeURIComponent(course.slug)}`)
                }
                className="mt-6 w-full rounded-lg bg-[#440D70] px-5 py-3.5 font-bold text-white transition-colors hover:bg-[#351057] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Proceed to Payment
              </button>
              <p className="mt-3 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                The existing course payment page will open next.
              </p>

              <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">
                  This course includes:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span aria-hidden="true">◷</span>
                    {course.duration} of course content
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true">▤</span>
                    {course.syllabus?.length || 0} syllabus topics
                  </li>
                  {course.certificate && (
                    <li className="flex gap-3">
                      <span aria-hidden="true">✓</span>
                      Certificate of completion
                    </li>
                  )}
                  {course.placement_support && (
                    <li className="flex gap-3">
                      <span aria-hidden="true">◆</span>
                      Placement support
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
