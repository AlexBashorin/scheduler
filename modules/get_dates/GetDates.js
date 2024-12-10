export const get_dates = (currentWeekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (currentWeekOffset * 7));
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
    }

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    };

    document.querySelector(".cur-week").textContent = formatDate(dates[0]) + " - " + formatDate(dates[dates.length - 1])
    return dates;
};