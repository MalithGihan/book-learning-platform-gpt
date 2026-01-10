import { useEffect, useRef, useState} from "react";

export default function BrandsSection() {
     const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(3);

  const brands = [
    { name: "Box", src: "/images/brand/Vector 1.png" },
    { name: "Amazon", src: "/images/brand/Vector 2.png" },
    { name: "Meta", src: "/images/brand/Vector 3.png" },
    { name: "Behance", src: "/images/brand/Vector 4.png" },
    { name: "VRT", src: "/images/brand/Vector 5.png" },
    { name: "AWS", src: "/images/brand/Vector 6.png" },
    { name: "GitHub", src: "/images/brand/Vector 7.png" },
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
    <section className="mx-auto max-w-7xl py-12 md:py-20">
      <div className="px-4 md:px-6">
        <h2 className="text-xl md:text-xl lg:text-2xl font-bold text-center text-slate-900 mb-12 md:mb-16">
          Brands
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

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-slate-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            maximus, nulla ut commodo sagittis, sapien dui mattis dui, non
            pulvinar lorem felis nec erat
          </p>
        </div>
      </div>
    </section>
  );
}
