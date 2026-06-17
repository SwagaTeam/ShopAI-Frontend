'use client';

import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { autocomplete, AutocompleteOptions, AutocompleteSource } from '@algolia/autocomplete-js';
import { apiClient } from '@/data/api/apiClient';
import { ItemInterface } from '@/data/interfaces/ItemInterface';
import { useRouter } from 'next/navigation';

import '@algolia/autocomplete-theme-classic';
import './autocomplete-custom.css';
import {useCatalogStore} from "@/data/store/useCatalogStore";

interface AutocompleteProps extends Partial<AutocompleteOptions<any>> {
    onSearch: (term: string) => void;
}

export const AutocompleteSearch = ({ onSearch, ...props }: AutocompleteProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rootMap = useRef<Map<Element, Root>>(new Map());
    const router = useRouter();
    const { filters } = useCatalogStore();

    useEffect(() => {
        if (!containerRef.current) return undefined;

        const search = autocomplete({
            container: containerRef.current,
            renderer: {
                createElement,
                Fragment,
                render(children, container) {
                    const domElement = container as Element;
                    let root = rootMap.current.get(domElement);

                    if (!root) {
                        root = createRoot(domElement);
                        rootMap.current.set(domElement, root);
                    }
                    //@ts-ignore
                    domElement.style.zIndex = '999999';
                    root.render(children);
                },
            },
            placeholder: 'Поиск товаров...',
            initialState: {
                query: filters.searchTerm || '',
            },
            onSubmit({ state }) {
                onSearch(state.query);
            },
            getSources({ query }) {
                if (!query.trim()) return [];

                return [
                    {
                        sourceId: 'products',
                        getItems() {
                            return apiClient.get('/Products/filter', {
                                params: { searchTerm: query, pageSize: 5 }
                            }).then(res => res.data.items);
                        },
                        templates: {
                            header() {
                                return (
                                    <Fragment>
                                        <span className="aa-SourceHeaderTitle" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', display: 'block' }}>Товары</span>
                                    </Fragment>
                                );
                            },
                            item({ item, components }) {
                                return (
                                    <div className="aa-ItemWrapper">
                                        <div className="aa-ItemContent">
                                            <div className="aa-ItemIcon">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} width="40" height="40" />
                                                ) : (
                                                    <div style={{ width: 40, height: 40, backgroundColor: '#f1f5f9', borderRadius: 8 }} />
                                                )}
                                            </div>
                                            <div className="aa-ItemContentBody">
                                                <div className="aa-ItemContentTitle">
                                                    <components.Highlight hit={item} attribute="name" />
                                                </div>
                                                <div className="aa-ItemContentDescription">
                                                    {item.price.toLocaleString()} ₽
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                            noResults() {
                                return 'Ничего не найдено';
                            },
                            footer() {
                                return (
                                    <div
                                        className="aa-SeeAll"
                                        onClick={() => onSearch(query)}
                                        style={{ cursor: 'pointer', padding: '12px', color: '#2563eb', fontWeight: '600', textAlign: 'center', borderTop: '1px solid #f1f5f9', fontSize: '14px' }}
                                    >
                                        Показать все результаты для "{query}"
                                    </div>
                                );
                            }
                        },
                        onSelect({ item }) {
                            router.push(`/product/${item.id}`);
                        },
                    } as AutocompleteSource<ItemInterface>,
                ];
            },
            ...props,
        });

        return () => {
            search.destroy();
            // Defer unmounting to avoid the "unmount while rendering" error in React 18
            const roots = rootMap.current;
            setTimeout(() => {
                roots.forEach((root) => {
                    try {
                        root.unmount();
                    } catch (e) {
                        // Ignore errors if already unmounted
                    }
                });
                roots.clear();
            }, 0);
        };
    }, [props, onSearch, router, filters.searchTerm]);

    return <div ref={containerRef} className="header__search-autocomplete" />;
};
