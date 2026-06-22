import Navbar from '@/shared/components/custom/Navbar';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

const plans = [
  {
    title: 'Free Trial',
    price: '₹0',
    duration: '/30 days',
    features: [
      'Full access to all features',
      '30 days risk-free trial',
      'Email support',
    ],
    buttonText: 'Start Free Trial',
    highlighted: false,
  },
  {
    title: 'Monthly Plan',
    price: '₹4,999',
    duration: '/month',
    features: [
      'Unlimited access to all features',
      'Full CNC management tools',
      'Real-time production tracking',
      'Priority 24/7 technical support',
      'Advanced analytics dashboard',
    ],
    buttonText: 'Subscribe Now',
    highlighted: true,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Choose your plan</h1>
          <p className="text-gray-500 mt-2">
            Simple pricing with full access to CNC production management.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border ${
                plan.highlighted
                  ? 'border-indigo-500 shadow-md bg-white'
                  : 'bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="text-xs bg-indigo-500 text-white px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}

              <h2 className="text-lg font-semibold mt-4">{plan.title}</h2>

              <div className="mt-2">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-gray-500 text-sm"> {plan.duration}</span>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              {plan.highlighted ? (
                <Link to={'/payment'}>
                  <Button
                    variant={'primary'}
                    size={'lg'}
                    className={`w-full mt-6`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              ) : (
                <Link to={'/home'}>
                  <Button
                    variant={'outline'}
                    size={'lg'}
                    className={`w-full mt-6`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h3 className="text-center font-semibold mb-6">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            <details className="bg-white p-4 rounded-md border cursor-pointer">
              <summary>Can I block my access anytime?</summary>
              <p className="text-sm text-gray-500 mt-2">
                Yes, you can block your platform access anytime from your
                dashboard.
              </p>
            </details>

            <details className="bg-white p-4 rounded-md border cursor-pointer">
              <summary>What payment methods are accepted?</summary>
              <p className="text-sm text-gray-500 mt-2">
                We accept all major payment methods via Razorpay.
              </p>
            </details>

            <details className="bg-white p-4 rounded-md border cursor-pointer">
              <summary>Is there a setup fee?</summary>
              <p className="text-sm text-gray-500 mt-2">
                No, there are no setup fees.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
