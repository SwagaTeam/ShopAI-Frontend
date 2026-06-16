'use client';

import React, { useEffect, useState } from 'react';
import { useBrandsStore, Brand } from '@/data/store/useBrandsStore';
import {Plus, Edit2, Trash2, X, Image as ImageIcon, Edit} from 'lucide-react';
import { ConfirmModal } from '@/components/confirm-modal/confirm-modal';
import './brands.css';

export default function BrandsPage() {
    const { brands, isLoading, fetchBrands, createBrand, updateBrand, deleteBrand } = useBrandsStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        logoUrl: ''
    });

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleOpenModal = (brand?: Brand) => {
        if (brand) {
            setSelectedBrand(brand);
            setFormData({
                name: brand.name,
                logoUrl: brand.logoUrl
            });
        } else {
            setSelectedBrand(null);
            setFormData({
                name: '',
                logoUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBrand(null);
        setFormData({ name: '', logoUrl: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let success;
        if (selectedBrand) {
            success = await updateBrand(selectedBrand.id, formData);
        } else {
            success = await createBrand(formData);
        }

        if (success) {
            handleCloseModal();
        }
    };

    const handleDeleteClick = (brand: Brand) => {
        setBrandToDelete(brand);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (brandToDelete) {
            await deleteBrand(brandToDelete.id);
            setBrandToDelete(null);
        }
    };

    return (
        <div className="admin-brands-page">
            <div className="admin-brands-header">
                <h1 className="admin-brands-title">Управление брендами</h1>
                <button
                    className="admin-brands-create-btn"
                    onClick={() => handleOpenModal()}
                >
                    <Plus size={20} />
                    Добавить бренд
                </button>
            </div>

            {isLoading && brands.length === 0 ? (
                <div className="admin-brands-loading">Загрузка брендов...</div>
            ) : brands.length === 0 ? (
                <div className="admin-brands-empty">Брендов пока нет.</div>
            ) : (
                <div className="brands-grid">
                    {brands.map((brand) => (
                        <div key={brand.id} className="brand-card">
                            {brand.logoUrl ? (
                                <img src={brand.logoUrl} alt={brand.name} className="brand-card__image" />
                            ) : (
                                <div className="brand-card__image flex items-center justify-center">
                                    <ImageIcon size={40} color="#cbd5e1" />
                                </div>
                            )}
                            <div className="brand-card__info">
                                <h3 className="brand-card__name">{brand.name}</h3>
                            </div>
                            <div className="brand-card__actions">
                                <button
                                    className="brand-card__btn brand-card__btn--edit"
                                    onClick={() => handleOpenModal(brand)}
                                    title="Изменить"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    className="brand-card__btn brand-card__btn--delete"
                                    onClick={() => handleDeleteClick(brand)}
                                    title="Удалить"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div className="brand-modal-overlay" onClick={handleCloseModal}>
                    <div className="brand-modal" onClick={e => e.stopPropagation()}>
                        <div className="brand-modal__header">
                            <h2 className="brand-modal__title">
                                {selectedBrand ? 'Редактировать бренд' : 'Новый бренд'}
                            </h2>
                            <button className="brand-modal__close" onClick={handleCloseModal}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="brand-modal__body">
                                <div className="brand-form">
                                    <div className="form-group">
                                        <label className="form-label">Название бренда</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Например, Nike"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">URL логотипа</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="https://example.com/logo.png"
                                            value={formData.logoUrl}
                                            onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {formData.logoUrl && (
                                        <div className="form-group">
                                            <label className="form-label">Предпросмотр логотипа</label>
                                            <div className="preview-container">
                                                <img
                                                    src={formData.logoUrl}
                                                    alt="Preview"
                                                    className="preview-image"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="brand-modal__footer">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                                    Отмена
                                </button>
                                <button type="submit" className="btn-submit" disabled={isLoading}>
                                    {isLoading ? 'Сохранение...' : (selectedBrand ? 'Обновить' : 'Создать')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Удалить бренд?"
                message={`Вы уверены, что хотите удалить бренд "${brandToDelete?.name}"? Это действие нельзя отменить.`}
                confirmText="Удалить"
                cancelText="Отмена"
                isDanger={true}
            />
        </div>
    );
}
