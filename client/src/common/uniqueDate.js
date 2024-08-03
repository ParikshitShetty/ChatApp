import calendar from '../../public/calendar.json';

export function uniqueDate(chatArray) {
    let array = [];
    for (let index = 0; index < chatArray.length; index++) {
      const element = chatArray[index];
      // 2024-08-01T17:26:06.700Z
      const date = element.timeStamp.split('T')[0];
      // 2024-08-01
      const dateArray = date.split('-');

      const numParsed = parseInt(dateArray[1], 10);
      const date_obj = calendar.find(month => month.number === numParsed);
      
      const dateFormatted = `${dateArray[2]} ${date_obj.month} ${dateArray[0]}`
      
      if (!array.includes(dateFormatted)){
        array.push(dateFormatted);
        continue;
      }
      array.push('');
    }
    return array
}

export function dateFormatter(mongoDate) {
  const utcDate = new Date(mongoDate); // Replace with your UTC date string

  // Convert the UTC date to IST
  const istDate = utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const time = istDate.split(',')[1];
  return time;
}