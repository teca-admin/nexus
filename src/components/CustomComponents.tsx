import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';

export const CustomSelect = ({ options, value, onChange, placeholder }: { options: { label: string, value: string }[], value: string, onChange: (value: string) => void, placeholder?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="relative w-full md:w-auto" ref={ref}>
      <div 
        className="bg-surface border border-border2 focus:border-accent rounded-none px-10 py-[10px] text-sm cursor-pointer flex items-center justify-between min-w-[200px] font-sans transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate font-medium text-text">{selectedLabel}</span>
        <ChevronDown className="w-4 h-4 text-hint" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border border-border shadow-xl z-50 mt-1 rounded-none overflow-hidden">
          {options.map(option => (
            <div 
              key={option.value}
              className={`px-4 py-3 hover:bg-surface2 cursor-pointer text-sm font-medium transition-colors ${value === option.value ? 'text-accent bg-accent-light' : 'text-text'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomDatePicker = ({ value, onChange, className, textClassName, style, textStyle }: { value: string, onChange: (value: string) => void, className?: string, textClassName?: string, style?: React.CSSProperties, textStyle?: React.CSSProperties }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Se já estiver no formato DD/MM/YYYY, retorna como está
    if (dateStr.includes("/") && dateStr.split("/")[0].length <= 2) return dateStr;
    
    // Se estiver no formato YYYY-MM-DD
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }
    return dateStr;
  };

  return (
    <div className="relative w-full" ref={ref}>
      <div 
        className={`input-field cursor-pointer flex items-center justify-between ${className || ''}`}
        style={style}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`${textClassName || ''} font-mono font-bold text-text`} style={textStyle}>{value ? formatDate(value) : 'DD/MM/AAAA'}</span>
        <CalendarIcon className="w-4 h-4 text-hint" />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border border-border shadow-xl z-50 mt-1 p-4 rounded-none">
          <input 
            type="date" 
            className="w-full p-3 border border-border2 focus:border-accent outline-none font-mono text-sm"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
