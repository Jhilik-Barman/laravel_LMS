export const UPI_ID = "corporatesguide@idfcbank";

export function createUpiPaymentUri(course, transactionReference) {
  if (!Number.isSafeInteger(course.fee) || course.fee <= 0) {
    throw new Error("This course does not have a valid payment amount.");
  }

  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: "Corporates Guide",
    am: String(course.fee),
    cu: "INR",
    tn: `${course.title} course fee`,
    tr: transactionReference,
  });

  return `upi://pay?${params.toString()}`;
}
