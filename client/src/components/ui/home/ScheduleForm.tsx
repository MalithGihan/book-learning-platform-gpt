/* eslint-disable @typescript-eslint/no-explicit-any */
// Formik mock for demo - in your project, import from 'formik'
const useFormik = (config: any) => {
  const [values, setValues] = React.useState(config.initialValues);
  const [errors, setErrors] = React.useState<any>({});
  const [touched, setTouched] = React.useState<any>({});

  const validateField = (name: string, value: any) => {
    const fieldErrors = config.validate({ ...values, [name]: value });
    return fieldErrors[name] || "";
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formErrors = config.validate(values);
    setErrors(formErrors);
    setTouched({
      name: true,
      email: true,
      date: true,
      time: true,
      message: true,
    });

    if (Object.keys(formErrors).length === 0) {
      config.onSubmit(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

import React from "react";

export default function ScheduleForm() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      date: "",
      time: "",
      message: "",
    },
    validate: (values: {
      name: string | any[];
      email: string;
      date: any;
      time: any;
      message: string | any[];
    }) => {
      const errors: any = {};

      if (!values.name) {
        errors.name = "Name is required";
      } else if (values.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.date) {
        errors.date = "Date is required";
      }

      if (!values.time) {
        errors.time = "Time is required";
      }

      if (!values.message) {
        errors.message = "Message is required";
      } else if (values.message.length < 10) {
        errors.message = "Message must be at least 10 characters";
      }

      return errors;
    },
    onSubmit: (values: any) => {
      console.log("Form submitted:", values);
      alert("Form submitted successfully!");
    },
  });

  return (
    <section className="mx-auto max-w-7xl py-12 md:py-16 lg:py-20">
      <div className="flex flex-col justify-center lg:flex-row items-center">
        <div className="w-1/2 md:w-1/4 order-2 lg:order-1">
          <img
            src="/images/formImage.png"
            alt="Team discussion"
            className="w-full h-auto"
          />
        </div>

        <div className="w-full lg:w-2/3 order-1 lg:order-2">
          <div className="shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] bg-white rounded-md p-6 md:py-15">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">
              Schedule
            </h2>

            <div onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Text here"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-slate-900"
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Text here"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-slate-900"
                    }`}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      placeholder="Select Date from here"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        formik.touched.date && formik.errors.date
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:ring-slate-900"
                      }`}
                    />
                  </div>
                  {formik.touched.date && formik.errors.date && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="time"
                      placeholder="Select Time from here"
                      value={formik.values.time}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        formik.touched.time && formik.errors.time
                          ? "border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:ring-slate-900"
                      }`}
                    />
                  </div>
                  {formik.touched.time && formik.errors.time && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message here"
                  rows={6}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
                    formik.touched.message && formik.errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-slate-900"
                  }`}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={formik.handleSubmit}
                  type="button"
                  className="flex flex-row justify-center items-center gap-2 px-8 py-2 text-xs font-semibold bg-[#4CE38F] text-white rounded whitespace-nowrap -tracking-normal
             shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]
             transition-all duration-200 ease-out
             hover:text-white hover:scale-105
             active:scale-100"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
