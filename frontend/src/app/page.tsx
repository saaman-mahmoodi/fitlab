import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#0A3AFF]">FitLab</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/product" className="text-gray-600 hover:text-gray-900">
                Product
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/for-teams" className="text-gray-600 hover:text-gray-900">
                For Teams
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-[#0A3AFF] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Your coaching.
            <br />
            <span className="text-[#0A3AFF]">Supercharged by AI.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one AI-powered coaching platform that lets you coach more
            clients in less time — beautifully.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-[#0A3AFF] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Try Free for 14 Days
            </Link>
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition"
            >
              Watch Demo
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything you need to scale your coaching
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Workout Generator",
                description:
                  "Generate personalized 12-week programs in seconds with GPT-4",
                icon: "🤖",
              },
              {
                title: "Client Dashboard",
                description:
                  "Beautiful interface to manage all your clients in one place",
                icon: "📊",
              },
              {
                title: "Real-Time Messaging",
                description: "Stay connected with your clients instantly",
                icon: "💬",
              },
              {
                title: "Progress Tracking",
                description:
                  "Track weight, photos, metrics, and celebrate PRs automatically",
                icon: "📈",
              },
              {
                title: "Workout Builder",
                description:
                  "Drag-and-drop workout creation with 500+ exercises",
                icon: "🏋️",
              },
              {
                title: "Automations",
                description:
                  "Set it and forget it - automate check-ins and follow-ups",
                icon: "⚡",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-200 hover:border-[#0A3AFF] hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            No hidden fees. No surprises. Just great value.
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: "Starter", price: "$19", clients: "Up to 20 clients" },
              { name: "Growth", price: "$49", clients: "Unlimited clients", highlight: true },
              { name: "Pro", price: "$79", clients: "Everything + Forms" },
              { name: "Elite", price: "$149", clients: "Custom Branded App" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-xl border-2 ${
                  plan.highlight
                    ? "border-[#0A3AFF] bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2 text-[#0A3AFF]">
                  {plan.price}
                </div>
                <p className="text-sm text-gray-600 mb-4">/month</p>
                <p className="text-gray-600 mb-6">{plan.clients}</p>
                <Link
                  href="/pricing"
                  className={`block w-full py-2 rounded-lg font-semibold ${
                    plan.highlight
                      ? "bg-[#0A3AFF] text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } transition`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A3AFF] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your coaching?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of coaches already using FitLab to scale their business.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#A6FF3F] text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#95ee2e] transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <span className="text-2xl font-bold text-white">FitLab</span>
              <p className="mt-4 text-sm">
                AI-powered coaching platform for fitness professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/demo">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            © 2024 FitLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
