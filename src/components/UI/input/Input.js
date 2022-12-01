import React, {useCallback, useImperativeHandle, useRef, useState} from 'react';
import classes from "./Input.module.css";

const Input = React.forwardRef( ({name, onSubmit, selectNext, label}, ref) => {
  const [inputFieldData, setInputFieldData] = useState({});
  const inputRef = useRef();

  const focus = () => {
    inputRef.current['focus']();
  }

  const clear = () => {
    inputRef.current.value = '';
    inputRef.current['focus']();
  }

  useImperativeHandle(ref, () => {
    return {focus: focus, clear: clear}
  })

  const changeHandler = useCallback(() => {
    if (!inputRef.current) return;
    const term = inputRef.current["value"].trim();

    const data = {name: name, term: term}
    setInputFieldData(data);
    onSubmit(data);
  },[name, onSubmit]);

  const selectNextHandler = (ev) => {
    if (ev.key === 'Enter') {
      selectNext(name);
    }
  }

  return (
    <div className={`${classes['div']}`}>
      <label htmlFor={name}>{label}</label>
      <input onKeyUp={selectNextHandler} autoComplete={'off'} spellCheck={"false"} onChange={changeHandler} ref={inputRef} id={name} type={'text'}></input>
    </div>
  )
})

export default Input;