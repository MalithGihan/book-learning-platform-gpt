/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";

export default function PageSectionOne() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    { value: "150 +", label: "Courses" },
    { value: "95 +", label: "Days" },
    { value: "100 +", label: "Models" },
    { value: "50 +", label: "Time" },
  ];

  const features = [
    {
      title: "Join us & Grow your business",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus nulla ut commodo sagittis",
    },
    {
      title: "Stay Touch with Us",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus nulla ut commodo sagittis",
    },
    {
      title: "Practice with Daily Schedule",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus nulla ut commodo sagittis",
    },
  ];

  return (
    <div ref={sectionRef} className="mx-auto max-w-7xl bg-slate-50">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-700 {
          animation-delay: 0.7s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-900 {
          animation-delay: 0.9s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      <div className="py-8 md:py-12">
        <h1 className={`text-xl lg:text-2xl font-bold text-slate-900 leading-tight initial-hidden ${isVisible ? 'animate-fade-in-up' : ''}`}>
          Welcome to Book LMS Redefining
          <br />
          Learning Experiences
        </h1>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-md shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]">
        <div className="px-4 md:px-6 py-12 md:py-16">
          <div className="p-6 md:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className={`w-full lg:w-1/2 initial-hidden ${isVisible ? 'animate-fade-in-left delay-100' : ''}`}>
                <img
                  src="/images/sectionTwo.png"
                  alt="Workspace with laptop"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              <div className="w-full lg:w-1/2">
                <h2 className={`text-base md:text-base lg:text-xl font-bold text-slate-900 mb-4 initial-hidden ${isVisible ? 'animate-fade-in-right delay-200' : ''}`}>
                  Why Choose Book LMS?
                </h2>
                <p className={`text-sm md:text-sm text-slate-600 mb-8 initial-hidden ${isVisible ? 'animate-fade-in-right delay-300' : ''}`}>
                  Book LMS offers a seamless learning experience tailored for
                  students, educators, and organizations. Here's what makes us
                  stand out
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`bg-white rounded py-8 px-1 text-center shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out hover:text-black hover:scale-105
             hover:shadow-[0_0_0_2px_rgba(0,0,0,0.10),0_0_18px_rgba(0,0,0,0.16)]
             active:scale-100 initial-hidden ${isVisible ? `animate-scale-in delay-${400 + index * 100}` : ''}`}
                    >
                      <div className="text-base md:text-xl font-bold text-slate-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm font-semibold text-slate-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 pb-12 md:pb-16">
          <div className="flex flex-col lg:flex-row justify-around">
            <div className="w-full lg:w-1/2 space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                 className={`rounded-md px-6 py-4 flex items-center justify-between gap-5
           bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] initial-hidden ${isVisible ? `animate-fade-in-left delay-${800 + index * 100}` : ''}`}

                >
                  <div className="flex-1">
                    <h3 className="text-xs md:text-base font-semibold text-slate-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs font-base text-slate-700">
                      {feature.description}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 text-xs font-semibold text-black/70 rounded whitespace-nowrap -tracking-normal
             shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]
             transition-all duration-200 ease-out
             hover:text-black hover:scale-105
             hover:shadow-[0_0_0_2px_rgba(0,0,0,0.10),0_0_18px_rgba(0,0,0,0.16)]
             active:scale-100"
                  >
                    Learn more
                  </button>
                </div>
              ))}
            </div>

            <div className={`w-full lg:w-1/3 my-10 initial-hidden ${isVisible ? 'animate-fade-in-right delay-1000' : ''}`}>
              <img
                src="/images/sectionOne.png"
                alt="Team collaboration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}