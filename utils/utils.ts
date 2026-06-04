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
