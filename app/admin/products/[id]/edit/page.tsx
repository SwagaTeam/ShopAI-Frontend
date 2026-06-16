'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useShopsStore } from '@/data/store/useShopsStore';
import { useShopStore } from '@/data/store/useShopStore';
import { useProductStore } from '@/data/store/useProductStore';
import { X, Plus, Info, Sparkles, ArrowLeft } from 'lucide-react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { getCroppedImg } from '@/utils/imageProcessing';
import { sileo } from 'sileo';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableImage } from '../../create/SortableImage';
import { SearchableSelect } from '@/components/searchable-select/searchable-select';
import { ProductPreviewWrapper } from '@/components/product-preview-modal/product-preview-wrapper';
import { apiClient } from '@/data/api/apiClient';
import '../../create/create-product.css';

interface ImageItem {
    id: string;
    blob: Blob | null;
    url: string;
    isExisting?: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { shops, fetchMyShops } = useShopsStore();
    const {
        categories,
        fetchCategories,
        brands,
        fetchBrands,
        updateProductWithImages,
        isSubmittingProduct
    } = useShopStore();
    const { product, fetchProduct, isLoading: isProductLoading } = useProductStore();

    const [selectedShopId, setSelectedShopId] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        brandId: '',
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const [attributes, setAttributes] = useState<{ key: string, value: string }[]>([]);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [currentImageSrc, setCurrentImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchMyShops();
        fetchBrands();
        if (productId) {
            fetchProduct(productId);
        }
    }, [productId, fetchMyShops, fetchBrands, fetchProduct]);

    useEffect(() => {
        if (product) {
            setSelectedShopId(product.shopId);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price.toString(),
                stockQuantity: product.stockQuantity.toString(),
                categoryId: product.categoryId,
                brandId: product.brandId || '',
            });
            setTags(product.tags || []);

            const attrs = product.attributes
                ? Object.entries(product.attributes).map(([key, value]) => ({ key, value }))
                : [];
            setAttributes(attrs);

            const initialImages: ImageItem[] = [];
            if (product.imageUrl) {
                initialImages.push({ id: 'main', url: product.imageUrl, blob: null, isExisting: true });
            }
            if (product.imageUrls) {
                product.imageUrls.forEach((url, index) => {
                    if (url !== product.imageUrl) {
                        initialImages.push({ id: `existing-${index}`, url, blob: null, isExisting: true });
                    }
                });
            }
            setImages(initialImages);
        }
    }, [product]);

    useEffect(() => {
        if (selectedShopId) fetchCategories(selectedShopId);
    }, [selectedShopId, fetchCategories]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setCurrentImageSrc(reader.result as string);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (currentImageSrc && croppedAreaPixels) {
            try {
                const cropped = await getCroppedImg(currentImageSrc, croppedAreaPixels);
                if (cropped) {
                    const id = Math.random().toString(36).substr(2, 9);
                    const url = URL.createObjectURL(cropped);
                    setImages(prev => [...prev, { id, blob: cropped, url, isExisting: false }]);
                    setIsCropping(false);
                    setCurrentImageSrc(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            } catch (e) {
                console.error(e);
                sileo.error({ title: 'Ошибка', description: 'Не удалось обрезать изображение' });
            }
        }
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const item = prev.find(img => img.id === id);
            if (item && !item.isExisting) URL.revokeObjectURL(item.url);
            return prev.filter(img => img.id !== id);
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const generateAiTags = async () => {
        if (!formData.name || !formData.description) {
            sileo.error({ title: 'Недостаточно данных', description: 'Заполните название и описание для генерации тегов' });
            return;
        }
        setIsGeneratingTags(true);
        try {
            const attrObj: Record<string, string> = {};
            attributes.forEach(a => { if(a.key) attrObj[a.key] = a.value; });
            const response = await apiClient.post('/ai/product-tags', {
                name: formData.name,
                description: formData.description,
                attributes: attrObj,
                limit: 10
            });

            const newTags = Array.isArray(response.data) ? response.data : response.data?.tags;

            if (Array.isArray(newTags)) {
                setTags(Array.from(new Set([...tags, ...newTags])));
                sileo.success({ title: 'Теги сгенерированы', description: `Добавлено ${newTags.length} новых тегов` });
            }
        } catch (error) {
            console.error('Error generating tags:', error);
            sileo.error({ title: 'Ошибка ИИ', description: 'Не удалось сгенерировать теги' });
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const addAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);
    const removeAttribute = (index: number) => setAttributes(attributes.filter((_, i) => i !== index));
    const updateAttribute = (index: number, field: 'key' | 'value', value: string) => {
        const newAttrs = [...attributes];
        newAttrs[index][field] = value;
        setAttributes(newAttrs);
    };

    const getPreviewData = () => {
        const attrObj: Record<string, string> = {};
        attributes.forEach(a => { if (a.key.trim()) attrObj[a.key.trim()] = a.value.trim(); });

        return {
            name: formData.name,
            price: Number(formData.price) || 0,
            description: formData.description,
            imageUrl: images[0]?.url || '',
            imageUrls: images.map(img => img.url),
            shopName: shops.find(s => s.id === selectedShopId)?.name || '',
            categoryName: categories.find(c => c.id === formData.categoryId)?.name || '',
            brandName: brands.find(b => b.id === formData.brandId)?.name || '',
            stockQuantity: Number(formData.stockQuantity) || 0,
            attributes: attrObj
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShopId) {
            sileo.error({ title: 'Ошибка', description: 'Выберите магазин' });
            return;
        }

        const data = new FormData();
        data.append('ShopId', selectedShopId);
        data.append('Name', formData.name);
        data.append('Price', formData.price);
        data.append('CategoryId', formData.categoryId);
        data.append('Description', formData.description);
        data.append('StockQuantity', formData.stockQuantity);
        if (formData.brandId) {
            data.append('BrandId', formData.brandId);
        } else {
            data.append('ClearBrand', 'true');
        }

        if (tags.length > 0) data.append('TagsCsv', tags.join(','));
        const attrObj: Record<string, string> = {};
        attributes.forEach(a => { if (a.key.trim()) attrObj[a.key.trim()] = a.value.trim(); });
        data.append('AttributesJson', JSON.stringify(attrObj));

        const newImages = images.filter(img => !img.isExisting);
        if (newImages.length > 0) {
            newImages.forEach((img, index) => {
                if (img.blob) {
                    data.append('Images', img.blob, `product_${index}.jpg`);
                }
            });
        }

        // If user removed some existing images, we might want to use ClearImages or ReplaceImages.
        // But the current UI doesn't easily distinguish between "reordered existing" and "removed existing"
        // in a way that maps perfectly to the API without sending all files again.
        // Since we can't easily get Files from existing URLs, we'll just add new ones for now.

        const success = await updateProductWithImages(productId, data);
        if (success) {
            sileo.success({ title: 'Успех', description: 'Товар успешно обновлен' });
            router.back();
        }
    };

    if (isProductLoading) return <div className="p-8 text-center">Загрузка данных товара...</div>;

    return (
        <div className="create-product">
            <div className="create-product__header" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => router.back()} className="btn-icon">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="btn-icon" style={{ fontSize: '24px', fontWeight: 'bold' }}>Редактирование товара</h1>
            </div>
            <form onSubmit={handleSubmit} className="create-product__grid">
                <div className="create-product__main">
                    <section className="form-section">
                        <h2 className="form-section__title">Основная информация</h2>
                        <div className="form-group">
                            <label>Название товара <span>*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Например: Кроссовки Nike Air Max" required />
                        </div>
                        <div className="form-group">
                            <label>Описание</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-textarea" placeholder="Опишите товар..." />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Цена <span>*</span></label>
                                <div className="input-with-suffix">
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="form-input" placeholder="0" required />
                                    <span className="input-suffix">₽</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Остаток на складе (шт.) <span>*</span></label>
                                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="form-input" placeholder="0" required />
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="form-section__title">Характеристики</h2>
                        <div className="attributes-list">
                            {attributes.map((attr, index) => (
                                <div key={index} className="attribute-row">
                                    <input type="text" className="form-input" placeholder="Название" value={attr.key} onChange={(e) => updateAttribute(index, 'key', e.target.value)} />
                                    <input type="text" className="form-input" placeholder="Значение" value={attr.value} onChange={(e) => updateAttribute(index, 'value', e.target.value)} />
                                    <button type="button" className="attribute-remove-btn" onClick={() => removeAttribute(index)}><X size={18} /></button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn-add-attribute" onClick={addAttribute}><Plus size={18} /> Добавить характеристику</button>
                    </section>

                    <section className="form-section">
                        <div className="tags-header">
                            <div className="tags-label-wrapper">
                                <h2 className="form-section__title" style={{ margin: 0 }}>Теги</h2>
                                <div className="info-tooltip-wrapper"><Info size={16} /><div className="info-tooltip">Теги помогают ИИ находить товар.</div></div>
                            </div>
                            <button type="button" className="create-shop__ai-trigger" onClick={generateAiTags} disabled={isGeneratingTags || !formData.name || !formData.description}><Sparkles size={16} /> {isGeneratingTags ? 'Генерируем...' : 'Сгенерировать ИИ'}</button>
                        </div>
                        <div className="tags-input-container">
                            {tags.map((tag) => (
                                <span key={tag} className="tag-badge">{tag}<span className="tag-remove" onClick={() => removeTag(tag)}><X size={12} /></span></span>
                            ))}
                            <input type="text" className="tags-input-field" placeholder={tags.length === 0 ? "Введите тег и нажмите Enter" : ""} value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); const val = tagInput.trim().replace(/,/g, ''); if (val && !tags.includes(val)) setTags([...tags, val]); setTagInput(''); } }} />
                        </div>
                    </section>
                </div>

                <div className="create-product__sidebar">
                    <section className="form-section">
                        <h2 className="form-section__title">Организация</h2>
                        <div className="form-group">
                            <label>Магазин</label>
                            <SearchableSelect
                                options={shops.map(s => ({ id: s.id, name: s.name }))}
                                value={selectedShopId}
                                onChange={setSelectedShopId}
                                placeholder="Выберите магазин"
                            />
                        </div>
                        <div className="form-group">
                            <label>Категория</label>
                            <SearchableSelect
                                options={categories.map(c => ({ id: c.id, name: c.name }))}
                                value={formData.categoryId}
                                onChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}
                                placeholder="Выберите категорию"
                                disabled={!selectedShopId}
                            />
                        </div>
                        <div className="form-group">
                            <label>Бренд</label>
                            <SearchableSelect
                                options={brands.map(b => ({ id: b.id, name: b.name }))}
                                value={formData.brandId}
                                onChange={(val) => setFormData(prev => ({ ...prev, brandId: val }))}
                                placeholder="Без бренда"
                            />
                        </div>
                    </section>

                    <section className="form-section">
                        <h2 className="form-section__title">Фото товара</h2>
                        <div className="image-upload-container">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
                                    <div className="image-upload-list">
                                        {images.map((img, index) => (
                                            <SortableImage key={img.id} id={img.id} url={img.url} isMain={index === 0} onRemove={removeImage} onClick={setFullscreenImage} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            {images.length < 10 && (
                                <label className="image-upload-full-width">
                                    <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} ref={fileInputRef} />
                                    <Plus size={20} /><span>Добавить фото</span>
                                </label>
                            )}
                        </div>
                    </section>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setIsPreviewOpen(true)}
                            style={{ width: '100%', padding: '15px', borderRadius: '16px' }}
                        >
                            Предпросмотр
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSubmittingProduct} style={{ width: '100%', padding: '18px', fontSize: '16px', borderRadius: '16px' }}>
                            {isSubmittingProduct ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </div>
            </form>

            <ProductPreviewWrapper
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                product={getPreviewData()}
            />

            {isCropping && currentImageSrc && (
                <div className="cropper-modal">
                    <div className="cropper-container">
                        <Cropper image={currentImageSrc} crop={crop} zoom={zoom} aspect={777 / 846} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} showGrid={true} />
                    </div>
                    <div className="cropper-actions">
                        <button type="button" className="btn-secondary" onClick={() => {setIsCropping(false); setCurrentImageSrc(null);}}>Отмена</button>
                        <button type="button" className="btn-primary" onClick={handleCropSave}>Сохранить</button>
                    </div>
                </div>
            )}

            {fullscreenImage && (
                <div className="fullscreen-viewer" onClick={() => setFullscreenImage(null)}>
                    <button type="button" className="fullscreen-viewer__close" onClick={() => setFullscreenImage(null)}><X size={24} /></button>
                    <img src={fullscreenImage} className="fullscreen-viewer__img" alt="Full view" />
                </div>
            )}
        </div>
    );
}
