'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnalyticsStore } from '@/data/store/useAnalyticsStore';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    DollarSign,
    ShoppingBag,
    Package,
    Star,
    TrendingUp,
    Users,
    Store,
    ArrowUpRight,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Download,
    Loader2
} from 'lucide-react';
import './analytics.css';
import { ProductCard } from '@/components/product-card/product-card';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsPage() {
    const {
        overview,
        dailyOrders,
        topProducts,
        isLoading,
        fetchAllAnalytics,
        fetchDailyOrders
    } = useAnalyticsStore();

    const [isExporting, setIsExporting] = useState(false);
    const [period, setPeriod] = useState(30);
    const reportRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        fetchAllAnalytics();
    }, [fetchAllAnalytics]);

    const handlePeriodChange = async (days: number) => {
        setPeriod(days);
        await fetchDailyOrders(days);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        setIsExporting(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                ignoreElements: (el) => el.classList.contains('no-print')
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`ShopAI-Analytics-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading && !overview) {
        return <div className="loading-overlay">Загрузка аналитики...</div>;
    }

    const chartData = {
        labels: dailyOrders.map(day => new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Выручка',
                data: dailyOrders.map(day => day.revenue),
                fill: true,
                backgroundColor: (context: any) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
                    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
                    return gradient;
                },
                borderColor: '#2563eb',
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2563eb',
                pointBorderWidth: 2,
                pointRadius: dailyOrders.length > 30 ? 0 : 4,
                pointHoverRadius: 6,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#1f2937',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context: any) => formatCurrency(context.raw)
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false, // Убираем горизонтальные линии
                },
                border: {
                    display: false // Убираем линию оси
                },
                ticks: {
                    callback: (value: any) => formatCurrency(value),
                    font: {
                        size: 11
                    },
                    color: '#94a3b8'
                }
            },
            x: {
                grid: {
                    display: false // Убираем вертикальные линии
                },
                border: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    },
                    color: '#94a3b8',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="admin-analytics-page" ref={reportRef}>
            <header className="admin-analytics-header">
                <h1 className="admin-analytics-title">Аналитика платформы</h1>
                <div className="admin-analytics-actions no-print">
                    <button
                        className={`download-report-btn ${isExporting ? 'loading' : ''}`}
                        onClick={handleDownloadPDF}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        {isExporting ? 'Генерация...' : 'Скачать PDF отчет'}
                    </button>
                    <div className="admin-analytics-period-selector">
                        {[7, 14, 30, 90].map((d) => (
                            <button
                                key={d}
                                className={`period-btn ${period === d ? 'active' : ''}`}
                                onClick={() => handlePeriodChange(d)}
                            >
                                {d}д
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Брендирование для PDF */}
            <div className="pdf-branding">
                <div className="pdf-branding__logo">ShopAI Dashboard</div>
                <div className="pdf-branding__date">Дата отчета: {new Date().toLocaleString('ru-RU')}</div>
            </div>

            {/* Основные показатели */}
            <div className="analytics-stats-grid">
                <div className="analytics-stat-item">
                    <div className="analytics-stat-item__header">
                        <span className="analytics-stat-item__title">Общая выручка</span>
                        <div className="analytics-stat-item__icon bg-blue-light">
                            <DollarSign size={16} color="#2563eb" />
                        </div>
                    </div>
                    <div className="analytics-stat-item__value">
                        {isLoading ? '...' : formatCurrency(overview?.revenue || 0)}
                    </div>
                    <div className="analytics-stat-item__trend trend-up">Всего по платформе</div>
                    <div className="analytics-stat-item__chart chart-placeholder-1"></div>
                </div>

                <div className="analytics-stat-item">
                    <div className="analytics-stat-item__header">
                        <span className="analytics-stat-item__title">Средний чек</span>
                        <div className="analytics-stat-item__icon bg-purple-light">
                            <TrendingUp size={16} color="#8b5cf6" />
                        </div>
                    </div>
                    <div className="analytics-stat-item__value">
                        {isLoading ? '...' : formatCurrency(overview?.averageOrderValue || 0)}
                    </div>
                    <div className="analytics-stat-item__trend trend-up">Среднее значение</div>
                    <div className="analytics-stat-item__chart chart-placeholder-2"></div>
                </div>

                <div className="analytics-stat-item">
                    <div className="analytics-stat-item__header">
                        <span className="analytics-stat-item__title">Всего заказов</span>
                        <div className="analytics-stat-item__icon bg-green-light">
                            <ShoppingBag size={16} color="#10b981" />
                        </div>
                    </div>
                    <div className="analytics-stat-item__value">
                        {isLoading ? '...' : overview?.ordersCount || 0}
                    </div>
                    <div className="analytics-stat-item__trend trend-up">Успешные продажи</div>
                    <div className="analytics-stat-item__chart chart-placeholder-3"></div>
                </div>

                <div className="analytics-stat-item">
                    <div className="analytics-stat-item__header">
                        <span className="analytics-stat-item__title">Товары в наличии</span>
                        <div className="analytics-stat-item__icon bg-amber-light">
                            <Package size={16} color="#f59e0b" />
                        </div>
                    </div>
                    <div className="analytics-stat-item__value">
                        {isLoading ? '...' : overview?.inStockProductsCount || 0}
                    </div>
                    <div className="analytics-stat-item__trend trend-up">Из {overview?.productsCount || 0} товаров</div>
                    <div className="analytics-stat-item__chart chart-placeholder-1"></div>
                </div>
            </div>

            <div className="analytics-charts-grid">
                {/* График выручки */}
                <div className="analytics-section-card">
                    <div className="section-card-header">
                        <h2 className="analytics-section-title">Динамика выручки</h2>
                        <div className="revenue-summary">
                            <span className="revenue-total">{formatCurrency(dailyOrders.reduce((acc, day) => acc + day.revenue, 0))}</span>
                            <span className="revenue-label">за {period} дней</span>
                        </div>
                    </div>
                    <div className="chart-container">
                        <Line ref={chartRef} data={chartData as any} options={chartOptions as any} />
                    </div>
                </div>

                {/* Состояние склада */}
                <div className="analytics-section-card stock-health-section">
                    <div className="stock-health-header">
                        <h2 className="analytics-section-title">Состояние склада</h2>
                        <div className="stock-health-total">
                            <span className="stock-health-total__label">Всего товаров <span className="stock-health-total__value">{overview?.productsCount || 0}</span></span>
                        </div>
                    </div>

                    <div className="stock-status-list">
                        <StockStatusItem
                            label="В наличии"
                            value={overview?.inStockProductsCount || 0}
                            total={overview?.productsCount || 1}
                            type="ok"
                            icon={<CheckCircle2 size={16} color={"#2562e9"}/>}
                            description="Остатки в норме"
                        />
                        <StockStatusItem
                            label="Мало"
                            value={overview?.lowStockProductsCount || 0}
                            total={overview?.productsCount || 1}
                            type="warning"
                            icon={<AlertCircle size={16} />}
                            description="Требуется пополнение"
                        />
                        <StockStatusItem
                            label="Нет в наличии"
                            value={overview?.outOfStockProductsCount || 0}
                            total={overview?.productsCount || 1}
                            type="error"
                            icon={<XCircle size={16} />}
                            description="Продажи остановлены"
                        />

                        <div className="stock-rating-footer">
                            <div className="stock-rating-info">
                                <span className="stock-rating-label">Средний рейтинг товаров</span>
                                <div className="stock-rating-value-group">
                                    <span className="stock-rating-number">{(overview?.averageRating || 0).toFixed(1)}</span>
                                    <div className="stock-rating-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                fill={i < Math.round(overview?.averageRating || 0) ? "#2562e9" : "transparent"}
                                                color="#2562e9"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="stock-reviews-count">
                                {overview?.reviewsCount || 0} отзывов
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Топ товаров */}
            <section className="analytics-top-products">
                <div className="top-products-header">
                    <h2 className="analytics-section-title">Популярные товары</h2>
                    <span className="top-products-count">Топ 8 товаров платформы</span>
                </div>
                <div className="top-products-grid">
                    {topProducts.map(product => (
                        <ProductCard key={product.id} item={product} />
                    ))}
                    {topProducts.length === 0 && (
                        <div className="admin-shops-empty">Нет данных о популярных товарах</div>
                    )}
                </div>
            </section>
        </div>
    );
}

function StatCard({ label, value, icon, colorClass, sub }: any) {
    return (
        <div className="analytics-stat-card">
            <div className="analytics-stat-card__header">
                <span className="analytics-stat-card__label">{label}</span>
                <div className={`analytics-stat-card__icon ${colorClass}`}>
                    {icon}
                </div>
            </div>
            <div className="analytics-stat-card__value">{value}</div>
            <div className="analytics-stat-card__sub">{sub}</div>
        </div>
    );
}

function StockStatusItem({ label, value, total, type, icon, description }: any) {
    const percentage = Math.round((value / total) * 100);
    return (
        <div className={`stock-health-row status-${type}`}>
            <div className="stock-health-row__info">
                <div className="stock-health-row__label-group">
                    <span className="stock-health-row__icon">{icon}</span>
                    <span className="stock-health-row__label">{label}</span>
                </div>
                <span className="stock-health-row__desc">{description}</span>
            </div>

            <div className="stock-health-row__metrics">
                <div className="stock-health-row__progress-container">
                    <div className="stock-health-row__progress-bg">
                        <motion.div
                            className="stock-health-row__progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                    <span className="stock-health-row__percentage">{percentage}%</span>
                </div>
                <span className="stock-health-row__value">{value}</span>
            </div>
        </div>
    );
}
