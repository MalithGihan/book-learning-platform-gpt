import { useNavigation } from "react-router-dom";

export default function RouteLoadingBar() {
  const nav = useNavigation();
  if (nav.state !== "loading") return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[997]">
      <div className="h-1 w-full bg-slate-200">
        <div className="h-1 w-1/2 animate-pulse bg-slate-900" />
      </div>
    </div>
  );
}
