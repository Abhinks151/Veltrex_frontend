import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import {
  DocumentationNavLinks,
  Features,
  YOUTUBE_VIDEO_ID,
} from '@/shared/constants/constant';

const Section = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="mb-16 scroll-mt-24">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h2>
    {children}
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-200">
    {children}
  </span>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 bg-white border-b border-gray-200 shadow-sm">
        <Link to="/" className="font-bold text-lg text-[#3B2E8C]">
          Veltrex
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {DocumentationNavLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[#3B2E8C] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link to="/auth/register">
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <div className="bg-[#3B2E8C] text-white py-20 px-6 text-center">
        <p className="text-indigo-300 text-sm font-semibold tracking-widest uppercase mb-3">
          Documentation
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          CNC Shop Operations <br className="hidden md:block" />
          Management Platform
        </h1>
        <p className="text-indigo-200 max-w-xl mx-auto text-base leading-relaxed">
          A complete guide to Veltrex — from customer inquiries to completed
          production, all in one unified system.
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Overview */}
        <Section id="overview" title="What is Veltrex?">
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Veltrex</strong> is a centralized operations management
            platform built to simplify and organize the daily workflow of CNC
            machining workshops. From customer inquiries to completed
            production, the platform brings every stage of the manufacturing
            process into one unified system.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By reducing manual effort and improving operational visibility,
            Veltrex helps shops move away from scattered notebooks,
            spreadsheets, and messaging apps — replacing them with a single
            source of truth for the entire operation.
          </p>
        </Section>

        {/* Problem */}
        <Section id="problem" title="What problem does it solve?">
          <p className="text-gray-600 leading-relaxed mb-6">
            Managing a CNC workshop involves coordinating customers, quotations,
            work orders, production schedules, machine operations, deliveries,
            and business records. In many workshops, this information is spread
            across notebooks, spreadsheets, messaging apps, or multiple software
            tools — a fragmented approach that often results in:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: '🔍',
                title: 'Difficult job tracking',
                desc: 'Trouble tracking the status of ongoing jobs across the shop.',
              },
              {
                icon: '⏱️',
                title: 'Wasted time searching',
                desc: 'Time lost hunting for customer or production information.',
              },
              {
                icon: '📡',
                title: 'Poor communication',
                desc: 'Disconnect between office staff and the shop floor.',
              },
              {
                icon: '📉',
                title: 'Missed deadlines',
                desc: 'Missed deadlines and inconsistent record keeping.',
              },
              {
                icon: '🌫️',
                title: 'Limited visibility',
                desc: 'Little insight into overall business operations.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed mt-6">
            As the number of jobs increases, managing operations manually
            becomes increasingly challenging. Veltrex provides a single platform
            where every operational activity — customers, work orders,
            production progress, employees, and business information — can be
            managed from one centralized dashboard designed specifically for CNC
            shop operations.
          </p>
        </Section>

        {/* Audience */}
        <Section id="audience" title="Who is it designed for?">
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              'Workshop Owners',
              'Production Managers',
              'Administrative Staff',
              'Machine Operators',
            ].map((role) => (
              <Badge key={role}>{role}</Badge>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed">
            Veltrex is designed for small to medium-sized CNC machining
            workshops that require a structured approach to managing daily
            operations. The goal is to create a smoother workflow, improve
            collaboration, and make operational data easier to access and manage
            — whether you're in the office or on the shop floor.
          </p>
        </Section>

        {/* Demo */}
        <Section id="demo" title="Product Walkthrough">
          <p className="text-gray-500 mb-5 text-sm">
            Watch the complete demonstration to explore how Veltrex manages
            customers, work orders, production workflows, and overall shop
            operations.
          </p>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="Veltrex Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </Section>

        {/* Tech Stack */}
        {/* <Section id="tech-stack" title="Technical Information — Tech Stack">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                layer: 'Frontend',
                items: [
                  'React 19 + TypeScript',
                  'Vite (build tool)',
                  'Tailwind CSS v4',
                  'React Hook Form + Zod',
                  'Redux Toolkit',
                  'React Router v7',
                  'TanStack Table',
                ],
              },
              {
                layer: 'Backend',
                items: [
                  'NestJS (Node.js)',
                  'Prisma ORM',
                  'PostgreSQL',
                  'JWT Authentication',
                  'Multi-tenant architecture',
                  'Razorpay (billing)',
                  'Nodemailer (transactional email)',
                ],
              },
            ].map((stack) => (
              <div
                key={stack.layer}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                  {stack.layer}
                </h3>
                <ul className="space-y-1">
                  {stack.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section> */}

        {/* Architecture */}
        {/* <Section id="architecture" title="Architecture Overview">
          <p className="text-gray-600 leading-relaxed mb-6">
            Veltrex follows a <strong>multi-tenant SaaS architecture</strong> where each
            registered business (tenant) has isolated data. The backend uses a
            clean architecture pattern with dedicated use-case interfaces,
            repository ports, and domain entities.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {[
              {
                layer: 'Presentation (Controllers)',
                desc: 'NestJS controllers receive HTTP requests, validate DTOs, and return API responses.',
                color: 'bg-indigo-50 border-indigo-200',
              },
              {
                layer: 'Application (Use Cases)',
                desc: 'Business logic is encapsulated in use cases, each implementing a defined interface (Dependency Inversion Principle).',
                color: 'bg-violet-50 border-violet-200',
              },
              {
                layer: 'Domain (Entities & Ports)',
                desc: 'Core domain models and repository interfaces live here — framework agnostic.',
                color: 'bg-purple-50 border-purple-200',
              },
              {
                layer: 'Infrastructure (Prisma / DB)',
                desc: 'Prisma Client implements repository interfaces, connecting to a multi-schema PostgreSQL database.',
                color: 'bg-fuchsia-50 border-fuchsia-200',
              },
            ].map((l, i) => (
              <div
                key={l.layer}
                className={`flex gap-4 p-4 border-b last:border-b-0 ${l.color}`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#3B2E8C] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{l.layer}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section> */}

        {/* Features */}
        <Section id="features" title="Key Features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.desc}
              />
            ))}
          </div>
        </Section>

        {/* CTA */}
        <div className="text-center bg-[#111827] text-white rounded-2xl p-12 mt-4">
          <h2 className="text-2xl font-bold mb-2">
            Ready to modernize your shop floor?
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Get started with Veltrex for free — no credit card required.
          </p>
          <Link to="/auth/register">
            <Button variant="primary" size="lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-white border-t mt-10 py-8 px-10 text-sm text-gray-500 flex justify-between items-center">
        <div>© 2025 Veltrex. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-800 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-800 transition-colors">Contact</a>
        </div>
      </footer> */}
    </div>
  );
};

export default DocumentationPage;
