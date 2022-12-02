import React, {useState, useImperativeHandle, useRef} from 'react';
import classes from "./DurationDropdown.module.css";

const DurationDropdown = React.forwardRef(({onSubmit, selectNext}, ref) => {
  const [displayNone, setDisplayNone] = useState(true);

  const dropdown = useRef(), dropdownMenu = useRef(), textPara = useRef();

  const focus = () => {
    setDisplayNone(false);
    dropdown.current['focus']();
  }

  useImperativeHandle(ref, () => {
    return {focus: focus}
  })

  const openDropDownHandler = () => {
    setDisplayNone(prevState => !prevState);
  }

  const keydownBehavior = ev => {
    if (!dropdownMenu.current) return;
    const content = dropdownMenu.current['children'];
    if (ev.key === 'ArrowDown') {
      for (let i = 0; i < content.length; i++) {
        if (!content[i].classList.contains(classes.selected)) continue;
        if (i === content.length - 1) return;
        content[i].classList.remove(classes.selected);
        content[i+1].classList.add(classes.selected);
        content[i+1].scrollIntoView({block: 'nearest'});
        return;
      }
    }
    if (ev.key === 'ArrowUp') {
      for (let i = 0; i < content.length; i++) {
        if (!content[i].classList.contains(classes.selected)) continue;
        if (i === 0) return;
        content[i].classList.remove(classes.selected);
        content[i-1].classList.add(classes.selected);
        content[i-1].scrollIntoView({block: 'nearest'});
      }
    }
  }

  const keyUpHander = ev => {
    if (!dropdownMenu.current) return;
    const content = dropdownMenu.current['children'];
    if (ev.key === 'Enter') {
      setDisplayNone(true);
      for (const element of content) {
        if (element.classList.contains(classes.selected)) {
          onSubmit({name: 'duration', term: element.textContent});
          textPara.current.textContent = element.textContent;
          selectNext('duration');
        }
      }
    }
    if (ev.key === 'Escape') {
      setDisplayNone(true);
    }
  }

  return (
    <div ref={dropdown} onKeyUp={keyUpHander} onKeyDown={keydownBehavior} tabIndex={1} onClick={openDropDownHandler} className={classes.duration_div}>
      <p ref={textPara}>Select duration...</p>
      <i className='bx bxs-down-arrow'></i>
      <div ref={dropdownMenu} className={`${displayNone === true ? classes.display_none : ''}`}>
        <div className={classes.selected}>30 min</div>
        <div>1 hour</div>
        <div>2 hours</div>
      </div>
    </div>
  );
});

export default DurationDropdown;