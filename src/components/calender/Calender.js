import classes from './Calender.module.css';
import {useCallback, useEffect, useState} from "react";
import DateModal from "../UI/modal/DateModal";
import InputModal from "../UI/modal/InputModal";

const Calender = () => {
  const [currentMonth, setCurrentMonth] = useState([]);
  const [previousMonth, setPrevioisMonth] = useState([]);
  const [nextMonth, setNextMonth] = useState([]);
  const [content, setContent] = useState([]);
  const [returnToCurrent, setReturnToCurrent] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [openEventModal, setOpenEventModal] = useState(false);

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

  }, [getAllDaysInMonth, returnToCurrent])

  useEffect(()=> {
    if (currentMonth.length === 0) return;
    const tempContent = [];
    let currentDay = currentMonth[0].getDay();
    if (currentDay === 0) currentDay = 7;
    for (let i = 1; i < 43; i++) {
      if (i < currentDay) {
        if (i === currentDay - 1) {
          const dateTemp = new Date(previousMonth[0]);
          const month = dateTemp.toLocaleString('default', { month: 'long' });
          tempContent.push(<div onClick={() => openModalHandler(previousMonth[previousMonth.length - 1])} key={i} className={classes.grayed}>{`${previousMonth[previousMonth.length - 1].getDate()} ${month}`}</div>);
          continue;
        }
        tempContent.push(<div onClick={() => openModalHandler(previousMonth[previousMonth.length - currentDay + i])} key={i} className={classes.grayed}>{previousMonth[previousMonth.length - currentDay + i].getDate()}</div>);
        continue;
      } else {
        if (currentMonth[i - currentDay]) {
          let todayClass = '';
          const tempDate = new Date(currentMonth[i-currentDay]);
          const newTempDate = new Date();
          if (tempDate.getFullYear() === newTempDate.getFullYear() && tempDate.getMonth() === newTempDate.getMonth() && tempDate.getDate() === newTempDate.getDate()) todayClass = classes.today_cal;
          if (currentMonth[i-currentDay].getDate() === 1) {
            const dateTemp = new Date(currentMonth[0]);
            const month = dateTemp.toLocaleString('default', { month: 'long' });
            tempContent.push(<div onClick={() => openModalHandler(currentMonth[i-currentDay])} className={todayClass} key={i}>{`${currentMonth[i-currentDay].getDate()} ${month}`}</div>);
            continue;
          } else {
            tempContent.push(<div onClick={() => openModalHandler(currentMonth[i - currentDay])} className={todayClass} key={i}>{currentMonth[i - currentDay].getDate()}</div>);
            continue;
          }
        }
      }
      if (i - (currentMonth.length + currentMonth[0].getDay()) === 0) {
        const dateTemp = new Date(nextMonth[0]);
        const month = dateTemp.toLocaleString('default', { month: 'long' });
        tempContent.push(<div onClick={() => openModalHandler(nextMonth[i - (currentMonth.length + currentDay)])} key={i} className={classes.grayed}>{`${nextMonth[i - (currentMonth.length + currentDay)].getDate()} ${month}`}</div>);
        continue;
      }
      tempContent.push(<div onClick={() => openModalHandler(nextMonth[i - (currentMonth.length + currentDay)])} key={i} className={classes.grayed}>{nextMonth[i - (currentMonth.length + currentDay)].getDate()}</div>)
    }
    setContent(tempContent);
  }, [currentMonth, previousMonth, nextMonth])

  const oneMonthBeforeHandler = () => {
    setNextMonth(currentMonth);
    setCurrentMonth(previousMonth);

    const monthBefore = new Date(previousMonth[0]);
    monthBefore.setMonth(monthBefore.getMonth() - 1);
    getAllDaysInMonth(monthBefore.getFullYear(), monthBefore.getMonth(), setPrevioisMonth);
  }

  const oneMonthLaterHandler = () => {
    setPrevioisMonth(currentMonth);
    setCurrentMonth(nextMonth);

    const nextMonthTemp = new Date(nextMonth[0]);
    nextMonthTemp.setMonth(nextMonthTemp.getMonth() + 1);
    getAllDaysInMonth(nextMonthTemp.getFullYear(), nextMonthTemp.getMonth(), setNextMonth);
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

  const currentMonthName = new Date(currentMonth[0]);
  return (
    <div className={classes.container}>
      {openEventModal && <DateModal closeModal={closeEventModalHandler} date={modalDate}></DateModal>}

      {openModal && <InputModal date={modalDate} closeModal={closeModalHandler}></InputModal>}

      <div className={classes.header}>
        <div>
          <h1>{currentMonthName.toLocaleString('default', {month: 'long', year: 'numeric'})}</h1>
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
        {content}
      </div>
    </div>
  );
};

export default Calender;