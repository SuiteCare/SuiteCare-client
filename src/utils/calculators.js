export const calAge = ($birth) => Math.floor((Date.now() - new Date($birth)) / (1000 * 3600 * 24 * 365));

export const calTimeDiff = ($start, $end) => {
  const getMinutes = ($time) => {
    const [hours, minutes] = $time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  return (getMinutes($end) - getMinutes($start)) / 60;
};

export const weekdayDic = ['일', '월', '화', '수', '목', '금', '토'];

export const countWeekdays = (startDate, endDate, weekdays) => {
  const weekdaysArr = Number.isInteger(weekdays[0]) ? weekdays : weekdays.map((e) => weekdayDic.indexOf(e));

  const start = new Date(startDate);
  const end = new Date(endDate);

  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    if (weekdaysArr.includes(current.getDay())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const stringToColor = (str, saturation = 55, lightness = 50) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const genderToKo = (gender) => {
  return gender === 'M' ? '남' : '여';
};
