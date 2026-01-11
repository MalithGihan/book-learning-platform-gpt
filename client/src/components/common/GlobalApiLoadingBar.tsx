import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { api } from "../../app/api";

export default function GlobalApiLoadingBar() {
  const active = useSelector((state: RootState) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiState = state[api.reducerPath] as any;
    const queries = apiState?.queries ?? {};
    const mutations = apiState?.mutations ?? {};

    let n = 0;

    for (const k of Object.keys(queries)) {
      if (queries[k]?.status === "pending") n++;
    }
    for (const k of Object.keys(mutations)) {
      if (mutations[k]?.status === "pending") n++;
    }

    return n;
  });

  if (active === 0) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-998">
      <div className="h-1 w-full bg-slate-200">
        <div className="h-1 w-1/3 animate-pulse bg-slate-900" />
      </div>
    </div>
  );
}
