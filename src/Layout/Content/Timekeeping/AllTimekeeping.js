import { Button } from "antd";
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import "./timekeeping.css";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const events = [
  {
    id: 1,
    title: "Task1",
    start: "2022-07-12T11:00:00.000Z",
    end: "2022-07-12T18:00:00.000Z",
    desc: "Big conference for important people",
  },
  {
    id: 2,
    title: "Task2",
    start: "2022-07-10T17:00:00.000Z",
    end: "2022-07-12T17:00:00.000Z",
    desc: "Big conference for important people",
  },
  {
    id: 3,
    title: "Task3",
    start: "2022-07-15T17:00:00.000Z",
    end: "2022-07-16T17:00:00.000Z",
    desc: "Big conference for important people",
  },
];

function AllTimekeeping({ id }) {
  const [myEvents, setMyEvents] = useState(events);
  const [employee, setEmployee] = useState();
  const [dataTimekeeping, setDataTimekeeping] = useState([]);
  const [view, setView] = useState(Views.MONTH);

  const getDataTimekeeping = () => {
    axios.get(`https://localhost:44308/api/Timekeepings/${id}`).then((res) => {
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
            <p
              onClick={handleClickEvent}
              style={{ height: 9, color: "greenyellow" }}
            >
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
  const handleClickEvent = () => {
    setView(Views.AGENDA);
  };

  // const getEmployee = () => {
  //   axios.get(`https://localhost:44308/api/Employees/${id}`).then((res) => {
  //     setEmployee(res.data.value);
  //   });
  // };

  useEffect(() => {
    if (id) {
      getDataTimekeeping();
    }
  }, [id]);

  return (
    <div style={{ height: 600, marginTop: 10, marginBottom: 10 }}>
      <Calendar
        localizer={localizer}
        events={dataTimekeeping}
        startAccessor="start"
        endAccessor="end"
        showAllEvents
        views={{ month: true, agenda: true }}
        view={view}
        selected
      />
    </div>
  );
}

export default AllTimekeeping;
