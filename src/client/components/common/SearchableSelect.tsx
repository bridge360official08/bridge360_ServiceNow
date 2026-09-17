import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SearchableOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  keywords?: string[];
}

export interface SearchableSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  errorText?: string;
  helperText?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  placeholder = '-- Select --',
  searchPlaceholder = 'Type to search...',
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  errorText,
  helperText,
  className = '',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.value === value);
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(opt => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchValue = opt.value.toLowerCase().includes(q);
      const matchBadge = opt.badge ? opt.badge.toLowerCase().includes(q) : false;
      const matchSub = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false;
      const matchKeywords = opt.keywords ? opt.keywords.some(k => k.toLowerCase().includes(q)) : false;
      return matchLabel || matchValue || matchBadge || matchSub || matchKeywords;
    });
  }, [options, searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1 < filteredOptions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].value);
        setIsOpen(false);
        setSearchQuery('');
      }
    }
  };

  const selectOption = (optVal: string) => {
    onChange(optVal);
    setIsOpen(false);
    setSearchQuery('');
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  const selectId = id || (label ? `searchable-select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', position: 'relative', ...style }}
      className={className}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="input-label"
          style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        style={{
          width: '100%',
          minHeight: '42px',
          padding: '8px 14px',
          background: disabled ? '#F1F5F9' : '#FFFFFF',
          border: `1px solid ${errorText ? '#EF4444' : isOpen ? '#2563EB' : 'var(--border-color, #CBD5E1)'}`,
          borderRadius: 'var(--radius-sm, 6px)',
          color: selectedOption ? 'var(--text-main, #0F172A)' : 'var(--text-sub, #64748B)',
          fontSize: '0.92rem',
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          boxShadow: isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : 'none',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {selectedOption ? (
            <>
              {selectedOption.icon && <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}>{selectedOption.icon}</span>}
              <span style={{ color: 'var(--text-main, #0F172A)', fontWeight: 600 }}>{selectedOption.label}</span>
              {selectedOption.badge && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    marginLeft: '4px',
                  }}
                >
                  {selectedOption.badge}
                </span>
              )}
            </>
          ) : (
            <span style={{ color: 'var(--text-sub, #94A3B8)' }}>{placeholder}</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
          {selectedOption && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={clearSelection}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                color: '#94A3B8',
                borderRadius: '50%',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={18}
            style={{
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              color: isOpen ? '#2563EB' : '#64748B',
            }}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Search Input Box */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid #E2E8F0',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Search size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                color: '#0F172A',
                fontWeight: 500,
              }}
              onClick={e => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '4px',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '18px 12px',
                  textAlign: 'center',
                  color: '#64748B',
                  fontSize: '0.85rem',
                }}
              >
                No options matching &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      color: isSelected ? '#1D4ED8' : '#0F172A',
                      fontWeight: isSelected ? 600 : 500,
                      background: isSelected
                        ? '#EFF6FF'
                        : isHighlighted
                        ? '#F1F5F9'
                        : 'transparent',
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      {opt.icon && (
                        <span style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                          {opt.icon}
                        </span>
                      )}
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {opt.label}
                      </span>
                      {opt.subLabel && (
                        <span style={{ fontSize: '0.78rem', color: '#64748B', marginLeft: '2px' }}>
                          ({opt.subLabel})
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {opt.badge && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: isSelected ? '#DBEAFE' : '#F1F5F9',
                            color: isSelected ? '#1D4ED8' : '#64748B',
                            border: `1px solid ${isSelected ? '#BFDBFE' : '#E2E8F0'}`,
                          }}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={16} style={{ color: '#2563EB' }} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div
            style={{
              padding: '6px 12px',
              background: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              fontSize: '0.75rem',
              color: '#94A3B8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Showing {filteredOptions.length} of {options.length}
            </span>
            {searchQuery && (
              <span style={{ color: '#2563EB', fontWeight: 600 }}>Filtered</span>
            )}
          </div>
        </div>
      )}

      {errorText && (
        <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
          {errorText}
        </span>
      )}
      {!errorText && helperText && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-sub, #64748B)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
