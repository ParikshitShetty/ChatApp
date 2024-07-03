import calendar from '../../public/calendar.json';

function redisIdToDateTimeConverter(redisId,parts) {
    // Create a new Date object from the timestamp
    const date = new Date(parseInt(redisId));

    // Extract the year, month, day, hours, minutes, and seconds
    if (parts){ 
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`
    };

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    // const seconds = String(date.getSeconds()).padStart(2, '0');

    const dateObj = calendar[Number(month)]
    return `${year}-${dateObj.month}-${day}`;

    // Format the date and time as yyyy-mm-dd HH:MM:SS
    // return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function dateToRedisId(dateStr) {
    // Parse the date string (yyyy-mm-dd)
    // const [year, month, day] = dateStr.split('-').map(Number);

    // Create a new Date object (months are 0-based in JavaScript)
    // const date = new Date(year, month - 1, day);

    // Pass string
    const date = new Date(dateStr);

    // const date = Date.now();

    // Get the timestamp in milliseconds
    const timestamp = date.getTime();

    return timestamp.toString();
}

export { 
    redisIdToDateTimeConverter,
    dateToRedisId
}