import {  Wrench, Construction } from "lucide-react";

export default function UnderConstruction() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#4CE38F]/10 blur-3xl rounded-full"></div>
          <div className="relative flex items-center justify-center gap-4">
            <Construction className="h-24 w-24 text-gray-300 animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Wrench className="h-6 w-6 text-[#4CE38F]" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Under Construction
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-700 font-medium">
            We're Building Something Great
          </p>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            This page is currently under development. We're working hard to bring you an amazing experience. Check back soon!
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="h-2 w-2 bg-[#4CE38F] rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-600 font-medium">Coming Soon</span>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { label: "Planning", progress: 100 },
              { label: "Development", progress: 60 },
              { label: "Testing", progress: 20 },
            ].map((stage, i) => (
              <div key={i} className="space-y-2">
                <p className="text-xs font-medium text-gray-700">{stage.label}</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#4CE38F] to-[#3AB574] transition-all duration-500"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{stage.progress}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}