import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

export default function AIFeaturesSection() {
  const [isPlaying, setIsPlaying] = useState(false);
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
  
  // Replace with your actual YouTube video ID
  const youtubeVideoId = 'dQw4w9WgXcQ';

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl rounded-md shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] bg-white py-6 md:py-10 lg:py-15">
      <style>{`
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

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoomIn 0.8s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .initial-hidden {
          opacity: 0;
        }
      `}</style>

      <div className="px-4 md:px-6">
       
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h2 className={`text-xl md:text-xl lg:text-2xl font-bold text-slate-900 mb-6 initial-hidden ${isVisible ? 'animate-fade-in-left' : ''}`}>
                AI at the Core of Book LMS
              </h2>
              
              <p className={`text-sm md:text-base text-black leading-relaxed initial-hidden ${isVisible ? 'animate-fade-in-left delay-100' : ''}`}>
                Experience the future of learning with Book LMS's AI-powered features. Our intelligent algorithms analyze your learning patterns to recommend tailored courses, optimize your learning path, and ensure you stay ahead. From automated grading to predictive insights, our AI tools are designed to save time and boost outcomes for both learners and educators.
              </p>
            </div>

            <div className={`w-full lg:w-1/2 order-1 lg:order-2 initial-hidden ${isVisible ? 'animate-zoom-in delay-200' : ''}`}>
              <div className="relative bg-white rounded shadow-md overflow-hidden aspect-video">
                {!isPlaying ? (
                  <div className="relative w-full h-full">
                    <img
                      src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-black/80 rounded-full flex items-center justify-center group-hover:bg-black transition-colors">
                        <Play className="h-8 w-8 md:h-10 md:w-10 text-white ml-1" fill="white" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        
      </div>
    </section>
  );
}