/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

export default function SpecialOffersSection() {
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

  const offers = [
    {
      title: "Sign up today and enjoy a 14-day free trial !",
    },
    {
      title: "Schools and organizations exclusive discounts !",
    },
    {
      title: "Sign up today and enjoy a 14-day free trial !",
    },
  ];

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl py-12 md:py-16 lg:py-20">
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
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

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      <h2 className={`text-xl md:text-xl lg:text-2xl font-bold text-slate-900 mb-8 md:mb-12 px-4 md:px-6 initial-hidden ${isVisible ? 'animate-fade-in-up' : ''}`}>
        Special Offers Just for You
      </h2>

      <div className="space-y-6">
        {offers.map((offer, index) => (
          <div
            key={index}
            className={`rounded-md px-6 py-4 gap-5
           bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] initial-hidden ${isVisible ? `animate-slide-in-right delay-${(index + 1) * 100}` : ''}`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h3 className="text-sm lg:text-base font-bold text-slate-900 flex-1">
                {offer.title}
              </h3>

              <div className="flex flex-wrap gap-8 w-full md:w-auto">
                <button
                  className="flex flex-row justify-center items-center gap-2 px-8 py-2 text-xs font-semibold text-black/70 rounded whitespace-nowrap -tracking-normal
             shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]
             transition-all duration-200 ease-out
             hover:text-black hover:scale-105
             hover:shadow-[0_0_0_2px_rgba(0,0,0,0.10),0_0_18px_rgba(0,0,0,0.16)]
             active:scale-100"
                >
                  Learn more
                  <div className="w-4 h-4 bg-[#4CE38F] rounded-full flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                </button>

                <button
                  className="flex flex-row justify-center items-center gap-2 px-8 py-2 text-xs font-semibold bg-black text-white rounded whitespace-nowrap -tracking-normal
             transition-all duration-200 ease-out
             hover:text-[#4CE38F] hover:scale-105
             active:scale-100"
                >
                  Guide
                  <BookOpen className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}