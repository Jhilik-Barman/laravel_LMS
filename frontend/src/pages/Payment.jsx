import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "qrcode";
import api from "../utils/api";
import { createUpiPaymentUri, UPI_ID } from "../utils/upiPayment";

const QR_LIFETIME_SECONDS = 120;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function createPaymentReference() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `LMS${crypto.randomUUID().replaceAll("-", "").toUpperCase()}`;
  }

  return `LMS${Date.now()}${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
}

export default function Payment() {
  const { courseSlug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [qr, setQr] = useState(null);
  const [qrError, setQrError] = useState("");
  const [generation, setGeneration] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setLoadError("");
    setCourse(null);

    api
      .get("/courses")
      .then(({ data }) => {
        const selectedCourse = data.find((item) => item.slug === courseSlug);
        if (!selectedCourse) throw new Error("The requested course could not be found.");
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

  useEffect(() => {
    if (!course) return undefined;

    let active = true;
    setQr(null);
    setQrError("");
    setExpired(false);

    try {
      const paymentUri = createUpiPaymentUri(course, createPaymentReference());
      QRCode.toDataURL(paymentUri, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 280,
        color: {
          dark: "#250B3F",
          light: "#FFFFFF",
        },
      })
        .then((dataUrl) => {
          if (!active) return;
          setNow(Date.now());
          setQr({
            dataUrl,
            expiresAt: Date.now() + QR_LIFETIME_SECONDS * 1000,
          });
        })
        .catch((error) => {
          if (active) {
            setQrError(error.message || "Unable to generate the payment QR code.");
          }
        });
    } catch (error) {
      setQrError(error.message || "Unable to prepare this course payment.");
    }

    return () => {
      active = false;
    };
  }, [course, generation]);

  useEffect(() => {
    if (!qr) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [qr]);

  const secondsRemaining = qr
    ? Math.max(0, Math.ceil((qr.expiresAt - now) / 1000))
    : QR_LIFETIME_SECONDS;

  useEffect(() => {
    if (!qr || secondsRemaining > 0) return undefined;

    setExpired(true);
    const refresh = window.setTimeout(() => {
      setGeneration((current) => current + 1);
    }, 1500);

    return () => window.clearTimeout(refresh);
  }, [qr, secondsRemaining]);

  const regenerateQr = () => {
    setExpired(false);
    setQr(null);
    setGeneration((current) => current + 1);
  };

  return (
    <main
      className="min-h-[70vh] bg-white px-4 py-10 dark:bg-gray-900"
      aria-label="Course payment QR code"
    >
      <div className="mx-auto max-w-3xl">
        <Link
          to="/courses"
          className="text-sm font-semibold text-[#440D70] hover:underline dark:text-purple-300"
        >
          ← Back to courses
        </Link>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700 sm:p-8">
          {loading ? (
            <p className="text-center text-gray-500">Loading course details…</p>
          ) : loadError ? (
            <p role="alert" className="text-center text-red-600">
              {loadError}
            </p>
          ) : (
            <>
              <div className="text-center">
                <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold text-[#440D70] dark:bg-purple-950 dark:text-purple-200">
                  COURSE PAYMENT QR
                </span>
                <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  {course.title}
                </h1>
              </div>

              <div className="mx-auto mt-7 max-w-md rounded-xl bg-purple-50 p-5 text-center dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Course fee
                </p>
                <p className="mt-1 text-3xl font-bold text-[#440D70] dark:text-purple-300">
                  ₹{course.fee.toLocaleString("en-IN")}
                </p>
                <p className="mt-3 break-all text-sm text-gray-600 dark:text-gray-300">
                  UPI ID: <span className="font-semibold">{UPI_ID}</span>
                </p>
              </div>

              <div className="mt-7 flex min-h-72 flex-col items-center justify-center">
                {qrError ? (
                  <p role="alert" className="text-center text-red-600">
                    {qrError}
                  </p>
                ) : expired ? (
                  <>
                    <p role="status" className="text-center font-semibold text-amber-700 dark:text-amber-300">
                      Payment QR Code Expired
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                      Generating a new QR code…
                    </p>
                  </>
                ) : qr ? (
                  <>
                    <div className="rounded-2xl border border-purple-100 bg-white p-3 shadow-sm">
                      <img
                        src={qr.dataUrl}
                        alt={`UPI payment QR for ${course.title}, ₹${course.fee}`}
                        className="h-64 w-64"
                      />
                    </div>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      Scan with GPay, PhonePe, or another UPI app.
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Generating QR code…</p>
                )}
              </div>

              {!qrError && !expired && (
                <div className="mt-5 text-center" aria-live="polite">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    QR refreshes in
                  </p>
                  <p
                    className="mt-1 font-mono text-3xl font-bold tabular-nums text-[#440D70] dark:text-purple-300"
                    aria-label={`${secondsRemaining} seconds remaining`}
                  >
                    {formatTime(secondsRemaining)}
                  </p>
                  <button
                    type="button"
                    onClick={regenerateQr}
                    className="mt-4 text-sm font-semibold text-[#440D70] underline dark:text-purple-300"
                  >
                    Generate new QR now
                  </button>
                </div>
              )}

              {qrError && (
                <div className="mt-5 text-center">
                  <button
                    type="button"
                    onClick={regenerateQr}
                    className="rounded-lg bg-gradient-to-r from-[#440D70] to-indigo-600 px-6 py-3 font-semibold text-white hover:opacity-90"
                  >
                    Generate QR code
                  </button>
                </div>
              )}

              <div className="mt-5 rounded-lg bg-amber-50 p-4 text-center text-xs leading-5 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                The 2-minute timer only refreshes this displayed QR code. A
                static UPI QR cannot be remotely expired or checked for payment
                by this site, so a previously scanned QR may still be payable.
                Verify the payee and amount in your UPI app before paying.
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
