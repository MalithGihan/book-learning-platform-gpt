import { ArrowRight } from "lucide-react";

export default function GetStartedSection() {
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
    <section className="mx-auto max-w-7xl bg-white/60 backdrop-blur-md rounded-md py-12 shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] my-20">
      <div className="px-4 md:px-6">
        <h2 className="text-xl lg:text-2xl font-bold text-black mb-12 md:mb-16">
          Get Started with Book LMS in Just a Few Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 pt-12 rounded
             shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)]"
            >
              <div
                className="absolute -top-8 left-1 w-16 h-16
                  flex items-center justify-center"
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
