export const getInitials = (userName: string | null) => {
    if (!userName) return '';
    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
};
