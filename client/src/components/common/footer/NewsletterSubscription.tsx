import { useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email && email.includes('@')) {
      console.log('Subscribing email:', email);
      // Add your subscription logic here
      alert('Subscribed successfully!');
      setEmail('');
    }
  };

  return (
    <div className="w-full py-10">
      <div className="bg-white rounded md:rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.08),0_0_14px_rgba(0,0,0,0.12)] px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-md font-semibold text-slate-900 mb-1">
              Get the latest news and updates
            </h2>
            <p className="text-sm text-slate-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit Nunc maximus
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email here"
              className="flex-1 md:w-80 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}