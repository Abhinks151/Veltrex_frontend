import { Button } from '@/shared/components/ui/button';
import { Features, flowSteps } from '@/shared/constants/constant';
import { Link } from 'react-router-dom';

const withoutVeltrex = [
  'Job status buried in notebooks and spreadsheets',
  'Time lost searching for customer or job info',
  'Office and shop floor out of sync',
  'Missed deadlines, inconsistent records',
];

const withVeltrex = [
  'Every job status visible in one dashboard',
  'Customer and production history, one search away',
  'Office and shop floor working off the same data',
  'Deadlines tracked automatically, records always current',
];

const audience = [
  'Workshop Owners',
  'Production Managers',
  'Administrative Staff',
  'Machine Operators',
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF9FC] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="font-semibold text-lg text-[#3B2E8C]">Veltrex</div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link
            to="/docs"
            className="hover:text-[#3B2E8C] font-medium transition-colors"
          >
            Documentation
          </Link>
          <Link to="/auth/login">
            <Button variant="primary" size="sm">
              Have an account
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#241C5E] via-[#3B2E8C] to-[#4C3AA8] text-white">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-28 text-center relative z-10">
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-indigo-300 mb-5">
            CNC Shop Operations Management
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
            Plan, track, and optimize
            <br />
            your CNC production
          </h1>
          <p className="text-indigo-200 max-w-xl mx-auto mb-10 leading-relaxed">
            Every stage of your shop&apos;s workflow — from the first customer
            inquiry to completed production — in one unified system.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <Link to="/auth/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[#3B2E8C] hover:bg-indigo-50"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/platform/login">
              <Button
                variant="primary"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Login to platform
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button
                variant="primary"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10"
              >
                Explore solutions
              </Button>
            </Link>
          </div>

          {/* Signature: production flow strip */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-4">
            {flowSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 text-[11px] font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm text-indigo-100">{step}</span>
                </div>
                {i < flowSteps.length - 1 && (
                  <span className="w-8 h-px bg-white/25 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Without / With */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#3B2E8C] mb-3">
              The Shift
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              Managing production shouldn&apos;t be chaotic
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="bg-gray-100 p-8">
              <h3 className="text-xs font-mono tracking-widest uppercase text-gray-500 mb-6">
                Without Veltrex
              </h3>
              <ul className="space-y-4">
                {withoutVeltrex.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-gray-600">
                    <span className="text-gray-400 mt-0.5">–</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#3B2E8C] p-8 text-white">
              <h3 className="text-xs font-mono tracking-widest uppercase text-indigo-300 mb-6">
                With Veltrex
              </h3>
              <ul className="space-y-4">
                {withVeltrex.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-indigo-100">
                    <span className="text-white mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-gray-500 text-sm text-center max-w-2xl mx-auto mt-8 leading-relaxed">
            One centralized dashboard for customers, work orders, production
            progress, employees, and business records — built specifically for
            CNC shop operations.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#3B2E8C] mb-3">
              Key Features
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              A smarter way to run your shop floor
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Features.map((f) => (
              <div
                key={f.title}
                className={`bg-[#FAF9FC] border border-gray-100 rounded-xl p-6 hover:border-[#3B2E8C]/30 transition-colors`}
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="px-6 py-24 text-center">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#3B2E8C] mb-3">
          Who It&apos;s For
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-10">
          Built for small and mid-sized CNC shops
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {audience.map((role) => (
            <span
              key={role}
              className="font-mono text-xs tracking-wide uppercase bg-white text-[#3B2E8C] px-4 py-2 rounded-full border border-[#3B2E8C]/25"
            >
              {role}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#241C5E] via-[#3B2E8C] to-[#4C3AA8] text-white rounded-2xl p-12 text-center">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Start managing your production the right way
          </h2>
          <p className="text-indigo-200 mb-8">
            Take your shop floor to the next level with Veltrex.
          </p>
          <Link to="/auth/register">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-[#3B2E8C] hover:bg-indigo-50"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-10 border-t text-sm text-gray-500 flex justify-between items-center">
        <div>© 2025 Veltrex</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-800 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-800 transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
