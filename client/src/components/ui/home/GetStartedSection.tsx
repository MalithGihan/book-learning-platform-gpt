import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function GetStartedSection() {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      src: '/images/icon1.png',
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
      title: "Safe Zone",
      description:
        "Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo",
    },
    {
      src: '/images/icon2.png',
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
      title: "Android Support",
      description:
        "Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo",
    },
    {
      src: '/images/icon3.png',
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-100",
      title: "ISO Support",
      description:
        "Lorem ipsum dolor sit amet nulla adipiscing elit. Nunc maximus, nec ut commodo",
    },
  ];

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl bg-white/60 backdrop-blur-md rounded-md py-12 shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] my-20">
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
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

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      <div className="px-4 md:px-6">
        <h2 className={`text-xl lg:text-2xl font-bold text-black mb-12 md:mb-16 initial-hidden ${isVisible ? 'animate-fade-in-up' : ''}`}>
          Get Started with Book LMS in Just a Few Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-6 pt-12 rounded
             shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] initial-hidden ${isVisible ? `animate-fade-in-scale delay-${(index + 1) * 100}` : ''}`}
            >
              <div
                className={`absolute -top-8 left-1 w-16 h-16
                  flex items-center justify-center ${isVisible ? `animate-bounce-in delay-${(index + 2) * 100}` : 'initial-hidden'}`}
              >
                <div className="w-1/2">
                  <img
                    src={feature.src}
                    alt={feature.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-xs md:text-sm text-slate-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              <button className="flex items-center gap-2 text-sm font-semibold text-slate-900 hover:gap-3 transition-all group">
                Learn more
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}