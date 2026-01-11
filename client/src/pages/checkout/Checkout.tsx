/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Clock,
  Award,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetCourseQuery } from "../../features/courses/coursesApi";
import { useEnrollCourseMutation } from "../../features/enrollments/enrollmentsApi";

type EnrollmentStatus = "enrolled" | "completed" | "cancelled" | null | undefined;

interface CourseVM {
  _id: string;
  title?: string;
  description?: string;
  price?: number;

  // your backend may return this as "enrolled" or null
  enrollmentStatus?: EnrollmentStatus;

  level?: string;
  duration?: string;
  lessons?: number;
  instructor?: string;
}

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "bank">("card");
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const { courseId } = useParams<{ courseId: string }>();
  const nav = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const { data: courseRaw, isLoading, error } = useGetCourseQuery(courseId ?? "", {
    skip: !courseId,
  });

  // support either API shapes: {course: {...}} OR direct course object
  const course: CourseVM | undefined = useMemo(() => {
    const d: any = courseRaw;
    return (d?.course ?? d) as CourseVM | undefined;
  }, [courseRaw]);

  const [enrollCourse, { isLoading: enrolling, error: enrollErr }] = useEnrollCourseMutation();

  if (!courseId) return <div className="p-6">Missing courseId</div>;
  if (isLoading) return <div className="p-6 text-slate-600">Loading...</div>;
  if (error || !course) return <div className="p-6 text-red-700">Course not found.</div>;

  const canEnroll = user?.role === "student" || user?.role === "admin";
  const enrolled =
    course.enrollmentStatus === "enrolled" || course.enrollmentStatus === "completed";

  const price = Number(course.price ?? 0);
  const tax = Math.round(price * 0.1);
  const total = price + tax;

  async function onPayAndEnroll() {
    setPayError(null);

    if (!canEnroll) return;
    if (enrolled) return;

    try {
      setProcessing(true);

      await new Promise((r) => setTimeout(r, 1200));

      await enrollCourse(courseId!).unwrap();

      setProcessing(false);
      nav("/dashboard/my-courses", { replace: true });
    } catch (e: any) {
      setProcessing(false);
      const msg =
        e?.data?.error ||
        e?.data?.message ||
        e?.message ||
        "Payment/enrollment failed. Please try again.";
      setPayError(String(msg));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to courses
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="h-5 w-5 text-[#4CE38F]" />
                <h1 className="text-lg font-bold text-gray-900">Secure Checkout</h1>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-[#4CE38F] bg-[#4CE38F]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard
                        className={`h-6 w-6 mx-auto mb-2 ${
                          paymentMethod === "card" ? "text-[#4CE38F]" : "text-gray-400"
                        }`}
                      />
                      <p className="text-xs font-medium text-gray-900">Card</p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "paypal"
                          ? "border-[#4CE38F] bg-[#4CE38F]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                          paymentMethod === "paypal" ? "text-[#4CE38F]" : "text-gray-400"
                        }`}
                      >
                        PP
                      </div>
                      <p className="text-xs font-medium text-gray-900">PayPal</p>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("bank")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === "bank"
                          ? "border-[#4CE38F] bg-[#4CE38F]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 mx-auto mb-2 flex items-center justify-center text-xs font-bold ${
                          paymentMethod === "bank" ? "text-[#4CE38F]" : "text-gray-400"
                        }`}
                      >
                        BT
                      </div>
                      <p className="text-xs font-medium text-gray-900">Bank</p>
                    </button>
                  </div>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#4CE38F]/20 focus:border-[#4CE38F]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-blue-900 mb-3">
                      You will be redirected to PayPal to complete your payment
                    </p>
                    <div className="text-xs text-blue-700">Secure payment powered by PayPal</div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-900 mb-3 font-medium">
                      Bank Transfer Details
                    </p>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p>
                        <strong>Bank:</strong> Commercial Bank of Ceylon
                      </p>
                      <p>
                        <strong>Account Name:</strong> BookLMS Education
                      </p>
                      <p>
                        <strong>Account Number:</strong> 8012345678
                      </p>
                      <p>
                        <strong>Branch:</strong> Colombo Main Branch
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900 mb-1">Secure Payment</p>
                    <p className="text-xs text-blue-700">
                      Your payment information is encrypted and secure. We never store your card
                      details.
                    </p>
                  </div>
                </div>

                {(payError || enrollErr) && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-red-900 mb-1">Something went wrong</p>
                      <p className="text-xs text-red-700">
                        {payError ??
                          enrollErr?.toString() ??
                          "Enrollment failed."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4 pb-4 border-b border-gray-200">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#4CE38F]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                      {course.title ?? "Untitled Course"}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {course.instructor ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-0.5">Level</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {course.level ?? "—"}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-0.5">Duration</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {course.duration ?? "—"}
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600 mb-0.5">Lessons</p>
                    <p className="text-xs font-semibold text-gray-900">
                      {typeof course.lessons === "number" ? course.lessons : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Course Price</span>
                  <span className="font-medium text-gray-900">
                    LKR {price.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium text-gray-900">LKR {tax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#4CE38F]">LKR {total.toLocaleString()}</span>
                </div>
              </div>

              {enrolled && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">
                    Already enrolled in this course
                  </p>
                </div>
              )}

              {!canEnroll && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-700">Only students can enroll in courses</p>
                </div>
              )}

              <button
                onClick={onPayAndEnroll}
                disabled={enrolled || !canEnroll || processing || enrolling}
                className="w-full py-3 bg-[#4CE38F] text-white text-sm font-semibold rounded-lg hover:bg-[#3AB574] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {processing || enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {enrolling ? "Enrolling..." : "Processing..."}
                  </span>
                ) : enrolled ? (
                  "Already Enrolled"
                ) : (
                  `Pay LKR ${total.toLocaleString()}`
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center mt-3">
                By completing this purchase, you agree to our Terms of Service
              </p>
            </div>

            <div className="bg-linear-to-br from-[#4CE38F]/5 to-transparent border border-[#4CE38F]/20 rounded-lg p-4">
              <h3 className="text-xs font-bold text-gray-900 mb-3">What's Included</h3>
              <div className="space-y-2">
                {[
                  { icon: BookOpen, text: "Full course access" },
                  { icon: Clock, text: "Lifetime access" },
                  { icon: Award, text: "Certificate of completion" },
                  { icon: User, text: "Expert support" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                    <item.icon className="h-3.5 w-3.5 text-[#4CE38F]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
