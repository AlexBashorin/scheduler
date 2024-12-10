export const format_date = (date) => {
    return date.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
};