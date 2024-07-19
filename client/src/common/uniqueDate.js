// Common function
import { redisIdToDateTimeConverter } from "./dateConverter";

export function uniqueDate(chatArray) {
    let array = [];
    for (let index = 0; index < chatArray.length; index++) {
      const element = chatArray[index];
      const date = redisIdToDateTimeConverter(element.id);
      if (!array.includes(date)){
        array.push(date);
        continue;
      }
      array.push('');
    }
    return array
}