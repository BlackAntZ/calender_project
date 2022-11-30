import classes from './Calender.module.css';
import {useCallback, useEffect, useState} from "react";

const Calender = () => {
  const [currentMonth, setCurrentMonth] = useState([]);
  const [previousMonth, setPrevioisMonth] = useState([]);
  const [nextMonth, setNextMonth] = useState([]);
  const [content, setContent] = useState([]);

  const getAllDaysInMonth = useCallback((year, month, setMonth) => {
    const date = new Date(year, month, 1);

    const dates = [];

    while (date.getMonth() === month) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    setMonth(dates);
  }, []);

  useEffect(()=> {
    const now = new Date();
    getAllDaysInMonth(now.getFullYear(), now.getMonth(), setCurrentMonth);

    const monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth);

    const nextMonthTemp = new Date();
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth);

  }, [getAllDaysInMonth])

  useEffect(()=> {
    if (currentMonth.length === 0) return;
    const tempContent = [];
    for (let i = 1; i < 36; i++) {
      if (i < currentMonth[0].getDay()) {
        if (i === currentMonth[0].getDay() - 1) {
          const dateTemp = new Date(previousMonth[0]);
          const month = dateTemp.toLocaleString('default', { month: 'long' });
          tempContent.push(<div key={i} className={classes.grayed}>{`${previousMonth[previousMonth.length - currentMonth[i-1].getDay()+1].getDate()} ${month}`}</div>);
          continue;
        }
        tempContent.push(<div key={i} className={classes.grayed}>{previousMonth[previousMonth.length - currentMonth[i-1].getDay()+1].getDate()}</div>);
        continue;
      } else {
        if (currentMonth[i-currentMonth[0].getDay()]) {
          let todayClass = '';
          const tempDate = new Date(currentMonth[i-currentMonth[0].getDay()]);
          const newTempDate = new Date();
          console.log(tempDate.getDate() === newTempDate.getDate());
          if (tempDate.getFullYear() === newTempDate.getFullYear() && tempDate.getMonth() === newTempDate.getMonth() && tempDate.getDate() === newTempDate.getDate()) todayClass = classes.today_cal;
          if (currentMonth[i-currentMonth[0].getDay()].getDate() === 1) {
            const dateTemp = new Date(currentMonth[0]);
            const month = dateTemp.toLocaleString('default', { month: 'long' });
            tempContent.push(<div className={todayClass} key={i}>{`${currentMonth[i-currentMonth[0].getDay()].getDate()} ${month}`}</div>);
            continue;
          } else {
            tempContent.push(<div className={todayClass} key={i}>{currentMonth[i - currentMonth[0].getDay()].getDate()}</div>);
            continue;
          }
        }
      }
      if (i - (currentMonth.length + currentMonth[0].getDay()) === 0) {
        const dateTemp = new Date(nextMonth[0]);
        const month = dateTemp.toLocaleString('default', { month: 'long' });
        tempContent.push(<div key={i} className={classes.grayed}>{`${nextMonth[i - (currentMonth.length + currentMonth[0].getDay())].getDate()} ${month}`}</div>);
        continue;
      }
      tempContent.push(<div key={i} className={classes.grayed}>{nextMonth[i - (currentMonth.length + currentMonth[0].getDay())].getDate()}</div>)
    }
    setContent(tempContent);
  }, [currentMonth, previousMonth, nextMonth])

  const currentMonthName = new Date(currentMonth[0]);
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          <h1>{currentMonthName.toLocaleString('default', {month: 'long'})}</h1>
          <div>
            <i className='bx bxs-chevron-left'></i>
            <i className='bx bxs-chevron-right'></i>
          </div>
        </div>
        <div className={classes.today}>
          Today
        </div>
        <div className={classes.zone}>
          Zone
        </div>
      </div>
      <div className={classes.main}>
        {content}
      </div>
    </div>
  );
};

export default Calender;