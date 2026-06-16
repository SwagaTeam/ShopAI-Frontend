'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useShopStore, Category } from '@/data/store/useShopStore';
import { useRouter, useParams } from 'next/navigation';
import { Save, ChevronDown, Folder, Search, X } from 'lucide-react';
import './create-category-form.css';

// Helper to flatten categories for search and selection
const flattenCategories = (categories: Category[], level = 0, parentName = ''): any[] => {
    let flat: any[] = [];
    categories.forEach(cat => {
        flat.push({
            id: cat.id,
            name: cat.name,
            level,
            parentName,
            fullPath: parentName ? `${parentName} > ${cat.name}` : cat.name
        });
        if (cat.subCategories && cat.subCategories.length > 0) {
            flat = [...flat, ...flattenCategories(cat.subCategories, level + 1, cat.name)];
        }
    });
    return flat;
};

export const CreateCategoryForm = () => {
    const { id: shopId } = useParams();
    const router = useRouter();
    const { categories, createCategory, isSubmittingCategory } = useShopStore();

    const [name, setName] = useState('');
    const [parentId, setParentId] = useState<string | null>(null);

    // Custom Select State
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);

    const flatCategories = flattenCategories(categories);
    const selectedCategory = flatCategories.find(c => c.id === parentId);

    const filteredOptions = flatCategories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.fullPath.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const success = await createCategory({
            name: name.trim(),
            shopId: shopId as string,
            parentId: parentId
        });

        if (success) {
            router.push(`/admin/shop/${shopId}/categories`);
        }
    };

    return (
        <form className="create-category-form" onSubmit={handleSubmit}>
            <div className="create-category-form__header">
                <h2 className="create-category-form__title">Новая категория</h2>
            </div>

            <div className="create-category-form__section">
                <h3 className="create-category-form__section-title">Основная информация</h3>

                <div className="create-category-form__field">
                    <label>Название категории *</label>
                    <input
                        type="text"
                        placeholder="Например: Смартфоны"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="create-category-form__field">
                    <label>Родительская категория</label>
                    <div className="category-tree-select" ref={selectRef}>
                        <div
                            className={`category-tree-select__trigger ${isSelectOpen ? 'is-active' : ''}`}
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                        >
                            <Folder className="category-tree-select__icon" size={18} />
                            <div className={`category-tree-select__value ${!parentId ? 'is-placeholder' : ''}`}>
                                {selectedCategory ? selectedCategory.fullPath : 'Нет (корневая)'}
                            </div>
                            <ChevronDown className="category-tree-select__arrow" size={18} />
                        </div>

                        {isSelectOpen && (
                            <div className="category-tree-select__dropdown">
                                <div className="category-tree-select__search">
                                    <Search size={16} className="category-tree-select__search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Поиск категории..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                    {searchQuery && (
                                        <X
                                            size={16}
                                            className="category-tree-select__clear"
                                            onClick={() => setSearchQuery('')}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                </div>
                                <div className="category-tree-select__options">
                                    <div
                                        className={`category-tree-select__option ${!parentId ? 'is-selected' : ''}`}
                                        onClick={() => {
                                            setParentId(null);
                                            setIsSelectOpen(false);
                                        }}
                                    >
                                        <Folder size={16} />
                                        <span className="category-tree-select__option-name">Нет (корневая)</span>
                                    </div>

                                    {filteredOptions.map((cat) => (
                                        <div
                                            key={cat.id}
                                            className={`category-tree-select__option ${parentId === cat.id ? 'is-selected' : ''}`}
                                            onClick={() => {
                                                setParentId(cat.id);
                                                setIsSelectOpen(false);
                                            }}
                                            style={{ paddingLeft: `${cat.level * 20 + 16}px` }}
                                        >
                                            <div
                                                className="category-tree-select__dot"
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    backgroundColor: parentId === cat.id ? '#2563eb' : '#cbd5e1',
                                                    marginRight: '8px'
                                                }}
                                            />
                                            <span className="category-tree-select__option-name">{cat.name}</span>
                                        </div>
                                    ))}

                                    {filteredOptions.length === 0 && searchQuery && (
                                        <div className="category-tree-select__no-results">
                                            Ничего не найдено
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="create-category-form__footer">
                <button
                    type="submit"
                    className="create-category-form__save-btn"
                    disabled={isSubmittingCategory || !name.trim()}
                >
                    <Save size={18} />
                    {isSubmittingCategory ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </form>
    );
};
