/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-20">
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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
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

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className={`relative initial-hidden ${isVisible ? 'animate-fade-in-left' : ''}`}>
              <img
                src="/images/hero.png"
                alt="Learning environment"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-6 initial-hidden ${isVisible ? 'animate-fade-in-right delay-100' : ''}`}>
              Unlock Your Potential with Expert Led Courses
            </h1>

            <p className={`text-sm md:text-md text-black mb-8 initial-hidden ${isVisible ? 'animate-fade-in-right delay-200' : ''}`}>
              Learn new skills, pursue your interests, and advance your career
              with our comprehensive range of online courses.
            </p>

            <h2 className={`text-base md:text-xl font-semibold text-slate-900 mb-6 initial-hidden ${isVisible ? 'animate-fade-in-right delay-300' : ''}`}>
              What do you want to learn today?
            </h2>

            <div className={`flex mb-6 initial-hidden ${isVisible ? 'animate-fade-in-up delay-400' : ''}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses..."
                className="flex-1 px-4 py-3 text-sm border border-slate-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#4CE38F] focus:border-transparent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#4CE38F] text-white font-medium rounded-r-md hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <span className="hidden sm:inline">Search</span>
                <Search className="h-5 w-5" />
              </button>
            </div>

            <div className={`flex justify-center items-center gap-3 initial-hidden ${isVisible ? 'animate-fade-in-up delay-500' : ''}`}>
              <div className="relative">
                <img src="/images/group.png" alt="group" className="w-10 h-6" />
              </div>
              <p className="text-xs text-slate-600">
                Lorem ipsum dolor sit amet
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}