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
  const [openModal, setOpenModal] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [openEventModal, setOpenEventModal] = useState(false);
  const [events, setEvnets] = useState(null);
  const [currentMonthName, setCurrentMonthName] = useState(new Date());
  const [updateEvents, setUpdateEvents] = useState(null);
  const [eventModalData, setEventModalData] = useState(null);
  const [showZones, setShowZones] = useState(false);

  const TIME_ZONES = [{id: '-12', text: 'GMT-12:00'}, {id: '-11', text: 'GMT-11:00'}, {id: '-10', text: 'GMT-10:00'}, {id: '-9', text: 'GMT-9:00'},
    {id: '-8', text: 'GMT-8:00'}, {id: '-7', text: 'GMT-7:00'}, {id: '-6', text: 'GMT-6:00'}];

  const dateComparison = (first, second= new Date()) => {
    return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
  }

  const beforeTodayComparison = date => {
    const today = new Date();
    return (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() < today.getDate()) ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) || (date.getFullYear() < today.getFullYear());
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
  }, [updateEvents])

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
    let now = new Date();
    if (updateEvents) now = new Date(currentMonth[0].date);
    getAllDaysInMonth(now.getFullYear(), now.getMonth(), setCurrentMonth, events);

    let monthBefore = new Date();
    if (updateEvents) monthBefore = new Date(previousMonth[0].date);
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth, events);

    let nextMonthTemp = new Date();
    if (updateEvents) nextMonthTemp = new Date(nextMonth[0].date);
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth, events);

  }, [getAllDaysInMonth, events])

  const returnToCurrentHandler = () => {
    const now = new Date();
    getAllDaysInMonth(now.getFullYear(), now.getMonth(), setCurrentMonth, events);

    const monthBefore = new Date();
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth, events);

    const nextMonthTemp = new Date();
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth, events);
  }

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
        const eventContent = [];
        if (previousMonth[previousMonth.length - currentDay + i].events.length > 0) previousMonth[previousMonth.length - currentDay + i].events.forEach(event => {
          let beforeToday = false;
          const eventDateTemp = new Date(event.date);
          if (beforeTodayComparison(eventDateTemp)) beforeToday = true;
          eventContent.push(<div key={`${event.date}-${event.time}`} data-name={'event'} onClick={() => openEventModalHandler(event)} className={`${beforeToday ? classes.before_today : classes.after_today}`}>{`${event.time} ${event.title}`}</div>);
        })
        tempContent.push({key: i, style: `${classes.grayed}`, date: previousMonth[previousMonth.length - currentDay + i].date, text: `${previousMonth[previousMonth.length - currentDay + i].date.getDate()} ${month}`, events: eventContent});
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
            if (beforeTodayComparison(eventDateTemp)) beforeToday = true;
            let duration = event.duration === '1 hour' ? '01:00' : event.duration === '2 hours' ? '02:00' : '00:30';
            let endTime = `${+event.time.split(':')[0] + +duration.split(':')[0]}:${+event.time.split(':')[1] + +duration.split(':')[1]}`;
            eventContent.push(<div data-name={'event'} key={`${event.date}-${event.time}`} onClick={() => openEventModalHandler(event)} className={`${beforeToday ? classes.before_today : classes.after_today}`}>{`${event.time}-${endTime} ${event.title}`}</div>);
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
      const eventContent = [];
      if (nextMonth[i - (currentMonth.length + currentDay)].events.length > 0) nextMonth[i - (currentMonth.length + currentDay)].events.forEach(event => {
        let beforeToday = false;
        const eventDateTemp = new Date(event.date);
        if (beforeTodayComparison(eventDateTemp)) beforeToday = true;
        eventContent.push(<div data-name={'event'} key={`${event.date}-${event.time}`} onClick={() => openEventModalHandler(event)} className={`${beforeToday ? classes.before_today : classes.after_today}`}>{`${event.time} ${event.title}`}</div>);
      })
      tempContent.push({key: i, style: `${classes.grayed}`, date: nextMonth[i - (currentMonth.length + currentDay)].date, text: `${nextMonth[i - (currentMonth.length + currentDay)].date.getDate()} ${month}`, events: eventContent});
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

  const openModalHandler = (ev, date) => {
    if (ev.target.dataset.name === 'event') return;
    setOpenModal(true);
    const newTempDate = new Date(date);
    let currentMonthTemp = new Date(currentMonth[0].date);
    currentMonthTemp = currentMonthTemp.getMonth();
    if (+currentMonthTemp === 0) currentMonthTemp = 12;
    let newTempDateMonth = newTempDate.getMonth() === 0 ? 12 : newTempDate.getMonth();
    if (newTempDateMonth < currentMonthTemp) oneMonthBeforeHandler();
    if (newTempDateMonth > currentMonthTemp) oneMonthLaterHandler();
    setModalDate(newTempDate);
  }

  const closeModalHandler = () => {
    setOpenModal(false);
  }

  const openEventModalHandler = data => {
    setEventModalData(data);
    setOpenEventModal(true);
  }

  const closeEventModalHandler = () => {
    setOpenEventModal(false);
  }

  const updateEventsHandler = () => {
    if (!updateEvents) return setUpdateEvents(true);
    setUpdateEvents(prevState => !prevState)
  }

  return (
    <div className={classes.container}>
      {openEventModal && <DateModal data={eventModalData} closeModal={closeEventModalHandler}></DateModal>}

      {openModal && <InputModal updateEvents={updateEventsHandler} date={modalDate} closeModal={closeModalHandler}></InputModal>}

      <div className={classes.header}>
        <div>
          {currentMonthName && <h1>{new Date(currentMonthName).toLocaleString('default', {month: 'long', year: 'numeric'})}</h1>}
          <div>
            <i onClick={oneMonthBeforeHandler} className='bx bxs-chevron-left'></i>
            <i onClick={oneMonthLaterHandler} className='bx bxs-chevron-right'></i>
          </div>
        </div>
        <div onClick={returnToCurrentHandler} className={classes.today}>
          Today
        </div>
        <div onClick={() => {setShowZones(prevState => !prevState)}} className={classes.zone}>
          Timezone
          {showZones && <div>
            {TIME_ZONES.map(zone => <div key={zone.id}>
              {zone.text}
            </div>)}
          </div>}
        </div>
      </div>
      <div className={classes.main}>
        <div className={classes.grid}>
          <div className={classes.first_row}>Mon</div>
          <div className={classes.first_row}>Tue</div>
          <div className={classes.first_row}>Wed</div>
          <div className={classes.first_row}>Thu</div>
          <div className={classes.first_row}>Fri</div>
          <div className={classes.first_row}>Sat</div>
          <div className={classes.first_row}>Sun</div>
          {content.map(day => {
            return <div key={day.key} className={day.style} onClick={(ev) => openModalHandler(ev,day.date)}><p>{day.text}</p>{day.events.map(event => event)}</div>
          })}
        </div>
      </div>
    </div>
  );
};

export default Calender;