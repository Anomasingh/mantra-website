import React, { useState } from 'react';

const FAQ = ({ faqs = [], className = '' }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className={`bg-[#1E1E1E] rounded-lg p-6 mt-4 md:mt-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[#343434] rounded-lg overflow-hidden hover:border-[#FF9256]/30 transition-colors"
          >
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full flex items-center justify-between p-4 bg-[#252525] hover:bg-[#2A2A2A] transition-colors text-left"
              aria-expanded={expandedIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-gray-200 pr-4">{faq.question}</span>
              <svg
                className={`flex-shrink-0 w-5 h-5 text-[#FF9256] transition-transform duration-200 ${
                  expandedIndex === index ? 'transform rotate-180' : ''
                }`}
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
            </button>
            {expandedIndex === index && (
              <div
                id={`faq-answer-${index}`}
                className="bg-[#1E1E1E] px-4 py-3 border-t border-[#343434] text-gray-300 leading-relaxed"
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
