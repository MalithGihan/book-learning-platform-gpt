import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeedbackCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const testimonials = [
    {
      name: "Adam Smith",
      designation: "Designation",
      avatar: "/images/profile/profile1.png",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis, sapien dui mattis dui, non pulvinar lorem felis nec erat. Aliquam egestas, velit at condimentum placerat, sem sapien laoreet mauris",
    },
    {
      name: "Sarah Johnson",
      designation: "Product Manager",
      avatar: "/images/profile/profile2.png",
      text: "The learning experience has been exceptional. The AI-powered features help me stay on track and the course recommendations are spot on. Highly recommend to anyone looking to advance their career.",
    },
    {
      name: "Michael Chen",
      designation: "Software Engineer",
      avatar: "/images/profile/profile1.png",
      text: "Book LMS transformed how I learn. The platform is intuitive, the content is high-quality, and the personalized learning paths make all the difference. Five stars!",
    },
    {
      name: "Emma Wilson",
      designation: "Marketing Director",
      avatar: "/images/profile/profile2.png",
      text: "As an educator, I appreciate how Book LMS makes course management seamless. The automated grading saves me hours every week, and my students love the interactive features.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-md py-6 md:py-8 lg:py-10">
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px) rotateY(-15deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px) rotateY(15deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotateY(0deg);
          }
        }

        @keyframes scaleIn3D {
          from {
            opacity: 0;
            transform: scale(0.8) translateZ(-50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.9s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.9s ease-out forwards;
        }

        .animate-scale-in-3d {
          animation: scaleIn3D 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .initial-hidden {
          opacity: 0;
        }

        .perspective-container {
          perspective: 1000px;
        }
      `}</style>

      <div className="px-4 md:px-6">
        <h2 className={`text-xl md:text-xl lg:text-2xl font-bold text-center text-slate-900 mb-2 initial-hidden ${isVisible ? 'animate-fade-in-up' : ''}`}>
          Feedback
        </h2>

        <div className="relative flex items-center justify-center min-h-60 perspective-container">
          <div className="absolute inset-0 hidden lg:flex items-center justify-center">
            <div
              className={`absolute left-[0%] bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full px-2 py-4 md:py-2 w-100 opacity-80 scale-90 z-0 ${isVisible ? 'animate-slide-in-left delay-200' : 'initial-hidden'}`}
            >
              <div className="flex items-center gap-6">
                <img
                  src={
                    testimonials[
                      (currentIndex - 1 + testimonials.length) %
                        testimonials.length
                    ].avatar
                  }
                  alt="Previous"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {
                      testimonials[
                        (currentIndex - 1 + testimonials.length) %
                          testimonials.length
                      ].name
                    }
                  </p>
                  <p className="text-xs text-slate-500">
                    {
                      testimonials[
                        (currentIndex - 1 + testimonials.length) %
                          testimonials.length
                      ].designation
                    }
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`absolute right-[0%] bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full px-2 py-4 md:py-2 w-100 opacity-80 scale-90 z-0 ${isVisible ? 'animate-slide-in-right delay-200' : 'initial-hidden'}`}
            >
              <div className="flex items-center gap-6">
                <img
                  src={
                    testimonials[(currentIndex + 1) % testimonials.length]
                      .avatar
                  }
                  alt="Next"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {
                      testimonials[(currentIndex + 1) % testimonials.length]
                        .name
                    }
                  </p>
                  <p className="text-xs text-slate-500">
                    {
                      testimonials[(currentIndex + 1) % testimonials.length]
                        .designation
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div
            className={`relative md:bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           md:shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full px-2 py-4 md:py-0 max-w-2xl mx-auto z-10 ${isVisible ? 'animate-scale-in-3d delay-400' : 'initial-hidden'}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-0 md:gap-8">
              <div className="shrink-0">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-15 h-15 md:w-25 md:h-25 rounded-full object-cover border-2 border-slate-100"
                />
              </div>

              <div className="flex-1 text-center md:text-left mt-8 mr-4">
                <p className="text-xs md:text-xs text-slate-700 leading-relaxed mb-4">
                  <span className="text-sm text-slate-400">"</span>
                  {testimonials[currentIndex].text}
                  <span className="text-sm text-slate-400">"</span>
                </p>

                <div className="text-right mr-12 mb-4">
                  <p className="font-semibold text-slate-900 text-base">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {testimonials[currentIndex].designation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className={`absolute z-20 left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${isVisible ? 'animate-fade-in delay-600' : 'initial-hidden'}`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute z-20 right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-linear-to-r from-white/30 to-black/10 backdrop-blur-md
           shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors ${isVisible ? 'animate-fade-in delay-600' : 'initial-hidden'}`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-slate-700" />
          </button>
        </div>

        <div className={`flex justify-center gap-2 mt-4 ${isVisible ? 'animate-fade-in delay-800' : 'initial-hidden'}`}>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-slate-900 w-6"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}