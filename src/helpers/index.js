import moment from 'moment';

// Use the function as startDate is today and endDate is moment().subtract(30, 'days')
// We shall use the dateArray for historical data and later can be used for date range case

export const getDates = (start, end) => {
  const arr = [];
  const dt = new Date(start);

  while (dt <= end) {
    arr.push(moment(dt).format('YYYY-MM-DD'));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
};

export const getCurrencyRealTime = (currencyA, currencyB) => {
  if(!isNaN(currencyA) && !isNaN(currencyB))  return currencyB/currencyA;
  return null;
};
