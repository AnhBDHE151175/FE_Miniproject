import React from "react";
import { Route, Routes } from "react-router-dom";
import DepartmentContent from "./Department/de";
import PositionContent from "./Position/po";
import EmployeeContent from "./Employee/employee";
import TimeContent from "./Timekeeping/timekeeping";
import Login from "./Home/home";
import EmployeeTimekeeping from "./Employee/emptimekeeping";

function TableContent() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/emptimekeeping" element={<EmployeeTimekeeping/>}></Route>
        <Route path="/department" element={<DepartmentContent />}></Route>
        <Route path="/position" element={<PositionContent />}></Route>
        <Route path="/employee" element={<EmployeeContent />}></Route>
        <Route path="/timekeeping" element={<TimeContent />}></Route>
      </Routes>
    </div>
  );
}

export default TableContent;
