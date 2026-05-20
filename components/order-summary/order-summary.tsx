import Link from "next/link";
import "./order-summary.css"

interface OrderSummaryProps {
    isCart: boolean;
}

export const OrderSummary = ({isCart} : OrderSummaryProps) => {
    return (
        <aside className="summary-box">
            <h2 className="summary-box__title">{isCart ? "Итого" : "Ваш заказ"}</h2>
            <div className="summary-box__list">
                <div className="summary-box__row">
                    <span className="summary-box__label">Товары (3)</span>
                    <span className="summary-box__value">17470 ₽</span>
                </div>
                <div className="summary-box__row">
                    <span className="summary-box__label">Доставка</span>
                    <span className="summary-box__value summary-box__value--free">Бесплатно</span>
                </div>
            </div>
            <div className="summary-box__divider"></div>
            <div className="summary-box__total-row">
                <span className="summary-box__total-label">Итого</span>
                <span className="summary-box__total-value">17470 ₽</span>
            </div>
            {isCart ? (
                <div className="summary-box__buttons">
                <Link href={"/checkout"} className="summary-box__submit-btn">Перейти к оплате</Link>
                <Link href={"/main"} className="summary-box__continue-link">Продолжить покупки</Link>
            </div>
                ) : (
                    <div className="summary-box__buttons">
                    <Link href={"/checkout"} className="summary-box__submit-btn">Оплатить заказ</Link>
                        <p className="summary-box__warning">Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных</p>
                </div>
            )}
        </aside>
    )
}