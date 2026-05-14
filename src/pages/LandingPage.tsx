// import { Button } from "@/shared/components/ui/button";
// import { Link } from "react-router-dom";


// const LandingPage = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1>Landing Page</h1>
//       <div className="flex gap-4">
//         <Link to="/auth/login"><Button variant={"primary"} size="lg">Login</Button></Link>
//         <Link to="/auth/register"><Button variant={"primary"} size="lg">Register</Button></Link>

//       </div>
//     </div>
//   )
// }

// export default LandingPage;

import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-10 py-4 bg-white shadow-sm">
        <div className="font-semibold text-lg">Veltrex</div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <a href="#">Features</a>
          <a href="#">How it works</a>
          <Link to={"/auth/login"}><Button variant="primary" size="sm">Have an account</Button></Link>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center my-30 py-20 px-6">
        <h1 className="text-4xl font-bold mb-4">
          Plan, Track, and Optimize <br /> Your CNC Production
        </h1>

        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          Veltrex helps you streamline operations, reduce downtime,
          and maximize efficiency across your shop floor.
        </p>

        <div className="flex justify-center gap-4">
          <Link to={"/auth/register"}><Button variant="primary" size="lg">Start Free Trial</Button></Link>
          <Link to={"/auth/login"}><Button variant="outline" size="lg">See features</Button></Link>
          <Link to={"/auth/login"}><Button variant="outline" size="lg">Explore solutions</Button></Link>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold mb-10">
          Managing CNC production shouldn't be chaotic
        </h2>

        <div className="grid grid-cols-3 gap-8 px-20 text-sm text-gray-600">
          <div>
            <div className="mb-2">❌</div>
            <h3 className="font-medium">No clear job priorities</h3>
            <p>Unclear schedules lead to delays and confusion</p>
          </div>

          <div>
            <div className="mb-2">⚙️</div>
            <h3 className="font-medium">Machine downtime</h3>
            <p>Lack of visibility causes inefficient usage</p>
          </div>

          <div>
            <div className="mb-2">🚚</div>
            <h3 className="font-medium">Manual planning delays</h3>
            <p>Spreadsheets slow everything down</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-10">
        <h2 className="text-2xl font-semibold mb-10">
          A smarter way to run your shop floor
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {[
            "Smart Scheduling",
            "Shop Floor Execution",
            "Progress Board",
            "Multi-user System"
          ].map((item) => (
            <div
              key={item}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <h3 className="font-medium mb-2">{item}</h3>
              <p className="text-sm text-gray-500">
                Efficiently manage and track your production workflow.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 text-center">
        <h2 className="text-xl font-semibold mb-10">How It Works</h2>

        <div className="flex justify-center gap-16">
          {[
            "Create Jobs",
            "Generate Schedule",
            "Execute & Track"
          ].map((step, i) => (
            <div key={step}>
              <div className="w-10 h-10 rounded-full bg-[#3B2E8C] text-white flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-medium">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 flex justify-center">
        <div className="bg-[#111827] text-white p-10 rounded-2xl text-center w-[125]">
          <h2 className="text-xl font-semibold mb-2">
            Start managing your production the right way
          </h2>

          <p className="text-gray-400 mb-6">
            Take your shop floor to the next level with Veltrex.
          </p>

          <Link to={"/auth/register"}><Button variant="primary" size="lg">Start Free Trial</Button></Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-10 px-10 border-t text-sm text-gray-500 flex justify-between">
        <div>© 2025 Veltrex</div>

        <div className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;