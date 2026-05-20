import React, { useState } from 'react';

const MantraFAQ = ({ faqItems = [], title = 'Frequently Asked Questions' }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="w-full py-8 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        {/* FAQ Title */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center md:text-left text-gray-800">
          {title}
        </h2>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={expandedIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="font-semibold text-gray-800 pr-4 flex-1">
                  {item.question}
                </h3>
                <span
                  className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </span>
              </button>

              {/* Answer */}
              {expandedIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 py-4 bg-white border-t border-gray-200 text-gray-700 leading-relaxed"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Continue exploring with devotion and sincere practice. Each mantra unfolds its unique blessings over time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MantraFAQ;
