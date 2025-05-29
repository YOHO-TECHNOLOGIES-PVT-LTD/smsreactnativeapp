// utils/dateUtils.ts

export const formatDate = (iosString: string): string => {
  const date = new Date(iosString);
  const format: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', format);
};

export const formatDateandmonth = (iosString: string): string => {
  const date = new Date(iosString);
  const format: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-GB', format);
};

export const formatDateMonthandYear = (iosString: string): string => {
  const date = new Date(iosString);
  const format: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-GB', format);
};

export const formatMonthandYear = (iosString: string): string => {
  const date = new Date(iosString);
  const format: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', format);
};

export const formatDateandTime = (iosString: string): string => {
  const date = new Date(iosString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-GB', options);
};

export const formatCalendarDate = (iosString: string): string => {
  const date = new Date(iosString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatTime = (timestamp: string | number | Date, val: boolean): string => {
  if (timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday = messageDate.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    const daysDifference = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (val) {
      if (isToday) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (isYesterday) {
        return 'Yesterday';
      } else if (daysDifference < 7) {
        return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return messageDate.toLocaleDateString('en-GB');
      }
    } else {
      const format: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return messageDate.toLocaleTimeString('en-US', format);
    }
  } else {
    return '⌛';
  }
};

export const formatMessageDate = (timestamp: string | number | Date): string => {
  const messageDate = new Date(timestamp);
  const now = new Date();

  const isToday = messageDate.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  const daysDifference = Math.floor(
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isToday) {
    return 'Today';
  } else if (isYesterday) {
    return 'Yesterday';
  } else if (daysDifference < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return messageDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
};

export const getTimeDifference = (
  start: string | number | Date,
  end: string | number | Date
): string => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const diffMs = endTime.getTime() - startTime.getTime();

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHours} h:${diffMins} m`;
};

export const getIsTimeValid = (startDate: string, startTime: string): boolean => {
  const now = new Date();
  const startDateTime = new Date(startDate);
  const startTimeDate = new Date(startTime);

  const combinedDateTime = new Date(
    startDateTime.getFullYear(),
    startDateTime.getMonth(),
    startDateTime.getDate(),
    startTimeDate.getHours(),
    startTimeDate.getMinutes(),
    startTimeDate.getSeconds()
  );

  const isToday = now.toDateString() === combinedDateTime.toDateString();
  const isNotInPast = now <= combinedDateTime;

  return isToday && isNotInPast;
};

export const isInClassTimeRange = (
  startDate: string,
  startTime: string,
  endTime: string
): boolean => {
  const classStartDate = new Date(startDate);
  const classStartTime = new Date(startTime);
  const classEndTime = new Date(endTime);
  const currentDate = new Date();

  const isSameDate =
    currentDate.getFullYear() === classStartDate.getFullYear() &&
    currentDate.getMonth() === classStartDate.getMonth() &&
    currentDate.getDate() === classStartDate.getDate();

  const isInRange = currentDate >= classStartTime && currentDate <= classEndTime;

  return isSameDate && isInRange && currentDate < classEndTime;
};

export const getYearList = (startYear: number): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
};

export const getMonthList = (): string[] => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
};
