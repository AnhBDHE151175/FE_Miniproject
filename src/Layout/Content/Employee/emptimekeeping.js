import { useState, useEffect, useCallback } from "react";
import { Col, Divider, Row } from "antd";
import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./emptimekeeping.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

// const style = {
//   background: "#0092ff",
//   padding: "8px 0",
// };

function EmpTimekeeping() {
  const [dataFromSession, setDataFromSession] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const [isCheckIn, setIsCheckIn] = useState(
    !!JSON.parse(sessionStorage.getItem("status"))
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dataTimekeeping, setDataTimekeeping] = useState([]);
  const [view, setView] = useState(Views.MONTH);

  const getData = () => {
    axios
      .get(
        `https://localhost:44308/api/Employees/${dataFromSession.value.emId}`
      )
      .then((res) => {
        sessionStorage.setItem("status", res.data.value.status);
        setIsCheckIn(res.data.value.status);
      });
  };
  const getDataTimekeeping = () => {
    axios
      .get(
        `https://localhost:44308/api/Timekeepings/${dataFromSession.value.emId}`
      )
      .then((res) => {
        const arr = [];
        res.data.map((item) => {
          let obj = {
            id: item.id,
            title: !!item.endTime ? (
              <p onClick={handleClickEvent} style={{ height: 9 }}>
                {moment(item.endTime).format("HH:mm") +
                  " to " +
                  moment(item.startTime).format("HH:mm") +
                  ": " +
                  item.typeCheck}
              </p>
            ) : (
              <p onClick={handleClickEvent} style={{ height: 9, color: "greenyellow" }}>
                {"In:  " + moment(item.startTime).format("HH:mm")}
              </p>
            ),
            start: item.startTime,
            end: !!item.endTime ? item.endTime : new Date(),
            // desc: "Big conference for important people",
          };
          arr.push(obj);
        });
        setDataTimekeeping(arr);
      });
  };



  const onView = useCallback((newView) => setView(newView), [setView]);

  const handleClickEvent =()=>{
    setView(Views.AGENDA)
  }

  useEffect(() => {
    getDataTimekeeping();
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    getDataTimekeeping();
  }, [isCheckIn]);

  const checkIn = () => {
    axios
      .get(
        `https://localhost:44308/api/Timekeepings/CheckIn/${dataFromSession.value.emId}`
      )
      .then((res) => {
        getData();
        // sessionStorage.setItem("status", true);
        setIsCheckIn(!!sessionStorage.getItem("status"));
      });
  };
  const checkOut = () => {
    axios
      .get(
        `https://localhost:44308/api/Timekeepings/checkOut/${dataFromSession.value.emId}`
      )
      .then((res) => {
        getData();
        // sessionStorage.setItem("status", false);
        setIsCheckIn(!!sessionStorage.getItem("status"));
      });
  };
  const handleCheckIn = () => {
    if (!isCheckIn) {
      checkIn();
    }
  };
  const handleCheckOut = () => {
    if (isCheckIn) {
      checkOut();
    }
  };

  return (
    <div>
      <Row>
        <div className="profile-user">
          <img
            className="img-user"
            alt="anh"
            src="https://joeschmoe.io/api/v1/random"
          />
          <div className="info-user">
            <h4 className="name-user">{dataFromSession.value.emName}</h4>
            <p className="role-user">
              {dataFromSession.value.roles[0].roleName}
            </p>
          </div>
          {!isCheckIn && (
            <div className="checkin-user" onClick={handleCheckIn}>
              <span className="checkin-user-text">Check In</span>
              <p className="current-date">
                {moment(currentDate).format("DD/MM/YYYY HH:mm:ss")}
              </p>
            </div>
          )}
          {isCheckIn && (
            <div className="checkout-user" onClick={handleCheckOut}>
              <span className="checkout-user-text">Check Out</span>
              <p className="current-date">
                {moment(currentDate).format("DD/MM/YYYY HH:mm:ss")}
              </p>
            </div>
          )}
        </div>
      </Row>
      <div className="checkin-calendar">
        <Calendar
          localizer={localizer}
          events={dataTimekeeping}
          startAccessor="start"
          endAccessor="end"
          views={{ month: true, agenda: true }}
          // onView={onView}
          view={view}
          showAllEvents
          selected
        />
      </div>
    </div>
  );
}

export default EmpTimekeeping;
