import {ChevronRight} from "lucide-react";
import "./breadcrumb.css"
import Link from "next/link";

interface IProps {
    isCart: boolean;
}

export const Breadcrumb = ({isCart} : IProps) => {
    return (
        <ul className="breadcrumbs">
            <li className="breadcrumbs__item">
                <Link href={"/main"} className="breadcrumbs__link">Главная</Link>
            </li>
            <ChevronRight size={16} color="#6A7282" />
            <li className="breadcrumbs__item">
                <Link href={"/cart"} className="breadcrumbs__link">Корзина</Link>
            </li>
            {!isCart && (
                <>
                    <ChevronRight size={16} color="#6A7282" />
                    <li className="breadcrumbs__item">
                        <Link href={"/checkout"} className="breadcrumbs__link">Оформление заказа</Link>
                    </li>
                </>
            )}
        </ul>
    )
}