import SideBar from "./components/UI/side_bar/SideBar";
import classes from "./App.module.css";
import Calender from "./components/calender/Calender";

const App = () => {
  return (
    <div className={classes.main}>
      <SideBar></SideBar>
      <Calender></Calender>
    </div>
  );
};

export default App;
