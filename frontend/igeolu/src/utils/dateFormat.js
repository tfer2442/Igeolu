// utils/dateFormat.js
import { format, isToday, isYesterday, isThisYear } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatChatTime = (dateString) => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, 'a h:mm', { locale: ko });
  }
  
  if (isYesterday(date)) {
    return '어제';
  }
  
  if (isThisYear(date)) {
    return format(date, 'M월 d일');
  }
  
  return format(date, 'yyyy. MM. dd.');
};