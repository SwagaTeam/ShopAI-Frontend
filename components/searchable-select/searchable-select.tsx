'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import './searchable-select.css';

interface Option {
    id: string;
    name: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
}

export const SearchableSelect = ({ options, value, onChange, placeholder, disabled }: SearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="searchable-select" ref={containerRef}>
            <div
                className={`searchable-select__trigger ${isOpen ? 'searchable-select__trigger--active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`searchable-select__trigger-text ${!selectedOption ? 'searchable-select__trigger-text--placeholder' : ''}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown size={18} className="searchable-select__trigger-icon" />
            </div>

            {isOpen && (
                <div className="searchable-select__dropdown">
                    <div className="searchable-select__search-wrapper">
                        <Search size={16} className="searchable-select__search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="searchable-select__search-input"
                            placeholder="Поиск..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="searchable-select__options">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`searchable-select__option ${value === option.id ? 'searchable-select__option--selected' : ''}`}
                                    onClick={() => handleSelect(option.id)}
                                >
                                    {option.name}
                                </div>
                            ))
                        ) : (
                            <div className="searchable-select__no-results">Ничего не найдено</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
