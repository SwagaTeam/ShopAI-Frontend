'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ShopRedirectPage() {
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (id) {
            router.replace(`/admin/shop/${id}/categories`);
        }
    }, [id, router]);

    return null;
}
