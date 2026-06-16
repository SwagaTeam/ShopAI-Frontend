'use client';

import React, { useEffect, useState } from 'react';
import { useSellerRequestsStore } from '@/data/store/useSellerRequestsStore';
import { useAuthStore } from '@/data/store/useAuthStore';
import { useRouter } from 'next/navigation';
import './requests.css';
import { Check, X, Info, Calendar, User, Mail, Link as LinkIcon, FileText, Search } from 'lucide-react';

const RequestsPage = () => {
    const { role } = useAuthStore();
    const router = useRouter();
    const { requests, isLoading, fetchRequests, approveRequest, rejectRequest } = useSellerRequestsStore();
    const [statusFilter, setStatusFilter] = useState<string>('Pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [commentModal, setCommentModal] = useState<{ id: string, type: 'approve' | 'reject' } | null>(null);
    const [adminComment, setAdminComment] = useState('');

    useEffect(() => {
        if (role !== 'Admin') {
            router.replace('/admin/shops');
            return;
        }
        fetchRequests(statusFilter);
    }, [role, statusFilter, fetchRequests, router]);

    const filteredRequests = requests.filter(req =>
        req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.innOrOgrnip.includes(searchQuery)
    );

    const handleAction = async () => {
        if (!commentModal) return;

        if (commentModal.type === 'approve') {
            await approveRequest(commentModal.id, adminComment);
        } else {
            await rejectRequest(commentModal.id, adminComment);
        }

        setCommentModal(null);
        setAdminComment('');
    };

    if (role !== 'Admin') return null;

    return (
        <div className="requests-page">
            <header className="requests-page__header">
                <h1 className="requests-page__title">Заявки</h1>

                <div className="requests-page__search-wrapper">
                    <Search className="requests-page__search-icon" size={18} />
                    <input
                        type="text"
                        className="requests-page__search-input"
                        placeholder="Поиск по имени, email или ИНН..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="requests-page__filters">
                    {['Pending', 'Approved', 'Rejected'].map((status) => (
                        <button
                            key={status}
                            className={`requests-page__filter-btn ${statusFilter === status ? 'requests-page__filter-btn--active' : ''}`}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === 'Pending' ? 'Ожидают' : status === 'Approved' ? 'Одобрены' : 'Отклонены'}
                        </button>
                    ))}
                </div>
            </header>

            {isLoading ? (
                <div className="empty-state">Загрузка...</div>
            ) : filteredRequests.length === 0 ? (
                <div className="empty-state">
                    <Info size={48} />
                    <p>{searchQuery ? 'По вашему запросу ничего не найдено' : 'Заявок не найдено'}</p>
                </div>
            ) : (
                <div className="requests-list">
                    {filteredRequests.map((request) => (
                        <div key={request.id} className="request-card">
                            <div className="request-card__header">
                                <div className="request-card__user-info">
                                    <span className="request-card__user-name">{request.userName}</span>
                                    <span className="request-card__user-email">{request.userEmail}</span>
                                </div>
                                <span className={`request-card__status request-card__status--${request.status.toLowerCase()}`}>
                                    {request.status}
                                </span>
                            </div>

                            <div className="request-card__content">
                                <div className="request-card__field">
                                    <span className="request-card__label">ИНН / ОГРНИП</span>
                                    <span className="request-card__value">{request.innOrOgrnip}</span>
                                </div>
                                <div className="request-card__field">
                                    <span className="request-card__label">Дата создания</span>
                                    <span className="request-card__value">
                                        {new Date(request.createdAtUtc).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="request-card__field">
                                    <span className="request-card__label">Категория</span>
                                    <span className="request-card__value">{request.plannedCategory}</span>
                                </div>
                                <div className="request-card__field">
                                    <span className="request-card__label">Сайт / Соцсети</span>
                                    <a href={request.socialOrWebsiteUrl} target="_blank" rel="noopener noreferrer" className="request-card__value">
                                        {request.socialOrWebsiteUrl}
                                    </a>
                                </div>
                                <div className="request-card__field request-card__description">
                                    <span className="request-card__label">Описание</span>
                                    <p className="request-card__value">{request.description}</p>
                                </div>

                                {request.adminComment && (
                                    <div className="request-card__comment">
                                        <span className="request-card__label">Комментарий админа:</span>
                                        <p>{request.adminComment}</p>
                                    </div>
                                )}
                            </div>

                            {request.status === 'Pending' && (
                                <div className="request-card__footer">
                                    <button
                                        className="request-card__btn request-card__btn--reject"
                                        onClick={() => setCommentModal({ id: request.id, type: 'reject' })}
                                    >
                                        Отклонить
                                    </button>
                                    <button
                                        className="request-card__btn request-card__btn--approve"
                                        onClick={() => setCommentModal({ id: request.id, type: 'approve' })}
                                    >
                                        Одобрить
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {commentModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">
                            {commentModal.type === 'approve' ? 'Одобрить заявку' : 'Отклонить заявку'}
                        </h2>
                        <textarea
                            className="modal-textarea"
                            placeholder="Оставьте комментарий (необязательно)..."
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="request-card__btn modal-btn-cancel" onClick={() => setCommentModal(null)}>
                                Отмена
                            </button>
                            <button
                                className={`request-card__btn ${commentModal.type === 'approve' ? 'request-card__btn--approve' : 'request-card__btn--reject'}`}
                                onClick={handleAction}
                            >
                                {commentModal.type === 'approve' ? 'Одобрить' : 'Отклонить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestsPage;
