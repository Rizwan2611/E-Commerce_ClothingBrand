import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);

  // Fallback to 500px if height reading isn't accurate before mount
  const contentHeight = contentRef.current ? contentRef.current.scrollHeight : 1000;

  return (
    <div className="border-b border-ink/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group interactive focus:outline-none"
      >
        <span className="logo-heritage text-lg tracking-widest text-ink group-hover:text-accent transition-colors">
          {title}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-ink transform transition-transform duration-500 will-change-transform ${isOpen ? 'rotate-180 text-accent' : ''}`} 
        />
      </button>

      <div
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="pb-8 pt-2 text-ink/70 leading-relaxed font-body text-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
