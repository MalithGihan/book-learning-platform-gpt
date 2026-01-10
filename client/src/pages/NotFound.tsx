import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-slate-600">That page doesn’t exist.</p>
      <Link className="inline-block rounded-lg bg-slate-900 px-3 py-2 text-white" to="/">
        Go Home
      </Link>
    </section>
  );
}
