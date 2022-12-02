import classes from './Calender.module.css';
import {useCallback, useEffect, useState} from "react";
import DateModal from "../UI/modal/DateModal";
import InputModal from "../UI/modal/InputModal";
import React from "react";
import instance from "./instance";

const Calender = () => {
  const [currentMonth, setCurrentMonth] = useState([]);
  const [previousMonth, setPrevioisMonth] = useState([]);
  const [nextMonth, setNextMonth] = useState([]);
  const [content, setContent] = useState([]);
  const [returnToCurrent, setReturnToCurrent] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [openEventModal, setOpenEventModal] = useState(false);
  const [events, setEvnets] = useState(null);
  const [currentMonthName, setCurrentMonthName] = useState(new Date());

  const dateComparison = (first, second= new Date()) => {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
  }

  useEffect(()=> {
    instance.get('/events.json').then(r => {
      const newData = {...r.data};
      const newList = [];
      for (const key in newData) {
        newList.push(newData[key]);
      }
      setEvnets(newList);
    });
  }, [])

  const getAllDaysInMonth = useCallback((year, month, setMonth, events) => {
    const date = new Date(year, month, 1);

    const dates = [];

    while (date.getMonth() === month) {
      const currentDateEvents = events.filter(event => {
        const monthDateTemp = new Date(date);
        const eventDateTemp = new Date(event.date);
        return dateComparison(monthDateTemp, eventDateTemp);
      })

      dates.push({date: new Date(date), events: currentDateEvents});
      date.setDate(date.getDate() + 1);
    }

    setMonth(dates);
  }, []);

  useEffect(()=> {
    if (!events) return;
    const now = new Date();
    getAllDaysInMonth(now.getFullYear(), now.getMonth(), setCurrentMonth, events);

    const monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth, events);

    const nextMonthTemp = new Date();
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth, events);

  }, [getAllDaysInMonth, returnToCurrent, events])

  useEffect(()=> {
    if (currentMonth.length === 0) return;
    setCurrentMonthName(new Date(currentMonth[0].date));

    const tempContent = [];
    let currentDay = currentMonth[0].date.getDay();
    if (currentDay === 0) currentDay = 7;
    for (let i = 1; i < 43; i++) {
      if (i < currentDay) {
        let month = '';
        if (i === currentDay - 1) {
          const dateTemp = new Date(previousMonth[0].date);
          month = dateTemp.toLocaleString('default', { month: 'long' });
        }
        tempContent.push({key: i, style: `${classes.grayed}`, date: previousMonth[previousMonth.length - 1].date, text: `${previousMonth[previousMonth.length - 1].date.getDate()} ${month}`, events: []});
        continue;
      } else {
        if (currentMonth[i - currentDay]) {
          let isToday = false, month = '';
          const tempDate = new Date(currentMonth[i-currentDay].date);
          if (dateComparison(tempDate)) isToday = true;
          if (currentMonth[i-currentDay].date.getDate() === 1) {
            const dateTemp = new Date(currentMonth[0].date);
            month = dateTemp.toLocaleString('default', { month: 'long' });
          }
          const eventContent = [];
          if (currentMonth[i - currentDay].events.length > 0) currentMonth[i - currentDay].events.forEach(event => {
            let beforeToday = false;
            const eventDateTemp = new Date(event.date);
            if (dateComparison(eventDateTemp)) beforeToday = true;
            eventContent.push(<div className={`${beforeToday ? classes.before_today : classes.after_today}`}>{`${event.time} ${event.title}`}</div>);
          })
          tempContent.push({key: i, style: `${isToday ? classes.today_cal : ''}`, date: currentMonth[i - currentDay].date, text: `${currentMonth[i - currentDay].date.getDate()} ${month}`, events: eventContent});
          continue;

        }
      }
      let month = '';
      if (i - (currentMonth.length + currentMonth[0].date.getDay()) === 0) {
        const dateTemp = new Date(nextMonth[0].date);
        month = dateTemp.toLocaleString('default', { month: 'long' });
      }
      tempContent.push({key: i, style: `${classes.grayed}`, date: nextMonth[i - (currentMonth.length + currentDay)].date, text: `${nextMonth[i - (currentMonth.length + currentDay)].date.getDate()} ${month}`, events: []});
    }
    setContent(tempContent);
  }, [currentMonth, previousMonth, nextMonth])

  const oneMonthBeforeHandler = () => {
    setNextMonth(currentMonth);
    setCurrentMonth(previousMonth);

    const monthBefore = new Date(previousMonth[0].date);
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth, events);
  }

  const oneMonthLaterHandler = () => {
    setPrevioisMonth(currentMonth);
    setCurrentMonth(nextMonth);

    const nextMonthTemp = new Date(nextMonth[0].date);
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth, events);
  }

  const openModalHandler = date => {
    setOpenModal(true);
    const newTempDate = new Date(date);
    setModalDate(newTempDate);
  }

  const closeModalHandler = () => {
    setOpenModal(false);
  }

  const closeEventModalHandler = () => {
    setOpenEventModal(false);
  }

  return (
    <div className={classes.container}>
      {openEventModal && <DateModal closeModal={closeEventModalHandler} date={modalDate}></DateModal>}

      {openModal && <InputModal date={modalDate} closeModal={closeModalHandler}></InputModal>}

      <div className={classes.header}>
        <div>
          {currentMonthName && <h1>{new Date(currentMonthName).toLocaleString('default', {month: 'long', year: 'numeric'})}</h1>}
          <div>
            <i onClick={oneMonthBeforeHandler} className='bx bxs-chevron-left'></i>
            <i onClick={oneMonthLaterHandler} className='bx bxs-chevron-right'></i>
          </div>
        </div>
        <div onClick={() => setReturnToCurrent(prevState => !prevState)} className={classes.today}>
          Today
        </div>
        <div onClick={() => setOpenEventModal(true)} className={classes.zone}>
          Zone
        </div>
      </div>
      <div className={classes.main}>
        <div className={classes.first_row}>Mon</div>
        <div className={classes.first_row}>Tue</div>
        <div className={classes.first_row}>Wed</div>
        <div className={classes.first_row}>Thu</div>
        <div className={classes.first_row}>Fri</div>
        <div className={classes.first_row}>Sat</div>
        <div className={classes.first_row}>Sun</div>
        {content.map(day => {
          return <div key={day.key} className={day.style} onClick={() => openModalHandler(day.date)}>{day.text}{day.events.map(event => event)}</div>
        })}
      </div>
    </div>
  );
};

export default Calender;