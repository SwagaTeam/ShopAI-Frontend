export const getInitials = (userName: string | null) => {
    if (!userName) return '';
    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
};

export const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Получаем первую букву имени для аватара
export const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || '?';
};

export const parseLogoPath = (path: string | undefined): string => {
    if (!path) return  '#2563eb';

    // Если это URL от S3/MinIO (содержит /bucket/), извлекаем строку цвета/градиента
    if (path.includes('/bucket/')) {
        try {
            // Извлекаем всё что после /bucket/ и до начала query параметров (?)
            const match = path.match(/\/bucket\/([^?]+)/);
            if (match && match[1]) {
                // Декодируем и заменяем + на пробелы (на случай если S3 так закодировал)
                return decodeURIComponent(match[1]).replace(/\+/g, ' ');
            }
        } catch (e) {
            console.error('Error parsing logoPath:', e);
        }
    }

    return path;
};