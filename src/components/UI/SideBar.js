import classes from "./SideBar.module.css";
import {useState} from "react";

const SideBar = () => {
  const [selected, setSelected] = useState(null);

  return (
    <aside className={classes.side_bar}>
      <div>
        <h2>YOUR PATH</h2>
        <div className={selected === 'calender' ? classes.selected : ''} onClick={() => setSelected('calender')}>
          <i className='bx bxs-calendar'></i>
          <p>Agenda</p>
        </div>
        <div className={selected === 'exercise' ? classes.selected : ''} onClick={() => setSelected('exercise')}>
          <i className='bx bx-dumbbell'></i>
          <p>Exercises</p>
        </div>
        <div className={selected === 'materials' ? classes.selected : ''} onClick={() => setSelected('materials')}>
          <i className='bx bxs-collection'></i>
          <p>Materials</p>
        </div>
      </div>

      <div>
        <h2>YOUR PROFILE</h2>
        <div className={selected === 'personal' ? classes.selected : ''} onClick={() => setSelected('personal')}>
          <i className='bx bx-book-content'></i>
          <p>Personal information</p>
        </div>
        <div className={selected === 'invoices' ? classes.selected : ''} onClick={() => setSelected('invoices')}>
          <i className='bx bx-search-alt'></i>
          <p>Invoices</p>
        </div>
        <div className={selected === 'availability' ? classes.selected : ''} onClick={() => setSelected('availability')}>
          <i className='bx bxs-calendar-check'></i>
          <p>Availability</p>
        </div>
      </div>

      <div className={classes.logout}>
        <i className='bx bx-log-out-circle'></i>
        <p>Logout</p>
      </div>
    </aside>
  );
};

export default SideBar;