'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

interface SortableImageProps {
    id: string;
    url: string;
    isMain: boolean;
    onRemove: (id: string) => void;
    onClick: (url: string) => void;
}

export function SortableImage({ id, url, isMain, onRemove, onClick }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="image-reorder-item"
            {...attributes}
            {...listeners}
            onClick={() => onClick(url)}
        >
            <div className="image-preview-card">
                {isMain && <span className="image-main-badge">Главное</span>}
                <img src={url} alt="Product" />
                <button
                    type="button"
                    className="image-remove-btn"
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(id);
                    }}
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
