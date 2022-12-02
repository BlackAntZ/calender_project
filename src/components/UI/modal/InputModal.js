import classes from "./InputModal.module.css";
import styles from "./DateModal.module.css";
import ReactDOM from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import Input from "../input/Input";
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import DurationDropdown from "../input/DurationDropdown";

export const BackDrop = ({closeModal}) => {
  return (
    <div onClick={closeModal} className="backdrop"></div>
  )
}

const Modal = ({closeModal, date, updateEvents}) => {
  const [modalClasses, setModalClasses] = useState(`${styles.modal} ${classes.modal} ${styles.hidden}`);
  const [formData, setFormData] = useState({date: date});

  const nameInput = useRef(), titleInput = useRef(), topicInput = useRef(), linkInput = useRef(), timePicker = useRef(), dropdown = useRef(), button = useRef();

  useEffect(()=> {
    setModalClasses(`${styles.modal} ${classes.modal}`);
  },[])

  const collectFormData = data => {
    const tempData = {...formData};
    tempData[data.name] = data.term;
    setFormData(tempData);
  }

  const selectNextHandler = name => {
    if (name === 'name') titleInput.current['focus']();
    if (name === 'title') topicInput.current['focus']();
    if (name === 'topic') linkInput.current['focus']();
    if (name === 'link') timePicker.current['focus']();
    if (name === 'duration') button.current['focus']();
  }

  const format = 'HH:mm';

  const selectTimeHandler = time => {
    if (!time['$d']) return;
    const tempDate = {...formData};
    tempDate.time = time['$d'];
    setFormData(tempDate);
    setTimeout(()=> {
      dropdown.current['focus']();
    }, 300);
  }

  const submitFormData = () => {
    const data = {...formData};
    data.time = `${String(data.time.getHours()).padStart(2, '0')}:${String(data.time.getMinutes()).padStart(2, '0')}`;

    const response = fetch('https://react-http-post-228b2-default-rtdb.europe-west1.firebasedatabase.app/events.json', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    console.log(response);
    closeModal();
    updateEvents();
  }

  const keydownBehavior = ev => {
    if (ev.key === 'Enter') submitFormData();
  }

  return (
    <div className={modalClasses}>
      <div className={classes.container}>
        <div onClick={closeModal} className={styles.modal__close}>
          <i className='bx bx-x-circle'></i>
        </div>
        <h1>Add new event</h1>
        <div className={classes.form}>
          <Input name={'name'} label={'Name'} onSubmit={collectFormData} ref={nameInput} selectNext={selectNextHandler}></Input>
          <Input name={'title'} label={'Title'} onSubmit={collectFormData} ref={titleInput} selectNext={selectNextHandler}></Input>
          <Input name={'topic'} label={'Topic'} onSubmit={collectFormData} ref={topicInput} selectNext={selectNextHandler}></Input>
          <Input name={'link'} label={'Link'} onSubmit={collectFormData} ref={linkInput} selectNext={selectNextHandler}></Input>
          <div className={classes.time_picker}>
            <p>Time</p>
            <TimePicker ref={timePicker} onChange={selectTimeHandler} defaultValue={dayjs('12:00', format)} format={format} />
            <DurationDropdown ref={dropdown} selectNext={selectNextHandler} onSubmit={collectFormData}></DurationDropdown>
          </div>
          <div onClick={submitFormData} ref={button} onKeyUp={keydownBehavior} tabIndex={3}>Add</div>
        </div>
      </div>
    </div>
  )
}

const InputModal = ({closeModal, date, updateEvents}) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop closeModal={closeModal}></BackDrop>, document.getElementById('overlays'))}
      {ReactDOM.createPortal(<Modal updateEvents={updateEvents} date={date} closeModal={closeModal}></Modal>, document.getElementById('overlays'))}
    </>
  )
}

export default InputModal;