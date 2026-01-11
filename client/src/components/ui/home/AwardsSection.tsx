import { useEffect, useRef, useState} from "react";

export default function AwardsSection() {
     const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(3);

  const brands = [
    { name: "Box", src: "/images/awards/Award1.png" },
    { name: "Amazon", src: "/images/awards/Award2.png" },
    { name: "Meta", src: "/images/awards/Award3.png" },
    { name: "Behance", src: "/images/awards/Award4.png" },
    { name: "VRT", src: "/images/awards/Award5.png" },
    { name: "AWS", src: "/images/awards/Award6.png" },
    { name: "GitHub", src: "/images/awards/Award7.png" },
  ];

  const duplicatedBrands = [...brands, ...brands, ...brands];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;

      const containerWidth = container.scrollWidth / 3;
      if (scrollPosition >= containerWidth) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;

      const containerCenter = container.offsetWidth / 2;
      const scrollCenter = scrollPosition + containerCenter;
      const brandWidth = containerWidth / brands.length;
      const index =
        Math.floor((scrollCenter % containerWidth) / brandWidth) %
        brands.length;
      setCenterIndex(index);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [brands.length]);

  const getOpacity = (index: number) => {
    const actualIndex = index % brands.length;
    return actualIndex === centerIndex ? "opacity-100" : "opacity-30";
  };

  return (
    <section className="mx-auto max-w-7xl py-8 md:py-15">
      <div className="px-4 md:px-6">
        <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-center text-slate-900 mb-12 md:mb-16">
          Awards
        </h2>

        <div className="relative overflow-hidden mb-12">
          <div
            ref={scrollRef}
            className="flex gap-12 md:gap-36 items-center overflow-x-hidden"
            style={{ scrollBehavior: "auto" }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={index}
                className={`shrink-0 flex items-center justify-center transition-opacity duration-500 ${getOpacity(
                  index
                )}`}
              >
                <div key={index} className="relative">
                  <img src={brand.src} alt={brand.name} className="w-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
