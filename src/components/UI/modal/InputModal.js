import classes from "./InputModal.module.css";
import styles from "./DateModal.module.css";
import ReactDOM from "react-dom";
import React, {useEffect, useRef, useState} from "react";
import Input from "../input/Input";

export const BackDrop = ({closeModal}) => {
  return (
    <div onClick={closeModal} className="backdrop"></div>
  )
}

const Modal = ({closeModal, date}) => {
  const [modalClasses, setModalClasses] = useState(`${styles.modal} ${styles.hidden}`);

  const nameInput = useRef();

  useEffect(()=> {
    setModalClasses(`${styles.modal}`);
  },[])

  const collectFormData = data => {
    console.log(data);
  }

  const selectNextHandler = name => {
    console.log(name);
  }

  return (
    <div className={modalClasses}>
      <div className={classes.container}>
        <div onClick={closeModal} className={styles.modal__close}>
          <i className='bx bx-x-circle'></i>
        </div>
        <h1>Add new event</h1>
        <div>
          <Input name={'name'} label={'Name'} onSubmit={collectFormData} ref={nameInput} selectNext={selectNextHandler}></Input>
          <Input name={'title'} label={'Title'} onSubmit={collectFormData} ref={nameInput} selectNext={selectNextHandler}></Input>
          <Input name={'topic'} label={'Topic'} onSubmit={collectFormData} ref={nameInput} selectNext={selectNextHandler}></Input>
          <Input name={'link'} label={'Link'} onSubmit={collectFormData} ref={nameInput} selectNext={selectNextHandler}></Input>
        </div>
      </div>
    </div>
  )
}

const InputModal = ({closeModal, date}) => {
  return (
    <>
      {ReactDOM.createPortal(<BackDrop closeModal={closeModal}></BackDrop>, document.getElementById('overlays'))}
      {ReactDOM.createPortal(<Modal date={date} closeModal={closeModal}></Modal>, document.getElementById('overlays'))}
    </>
  )
}

export default InputModal;