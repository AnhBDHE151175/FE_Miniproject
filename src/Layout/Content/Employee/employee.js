import {
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Pagination,
  Badge,
} from "antd";
import moment from "moment";
import React, { useEffect, useState, createContext, useCallback } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { Excel } from "antd-table-saveas-excel";
import axios from "axios";
import OpenModal from "../../../Component/Modal/modal";
import EmployeeForm from "../../../Component/Form/EmployeeForm";
import * as XLSX from "xlsx";

export const EmployeeContext = createContext();

function EmployeeContent() {
  const [dataFromApi, setDataFromApi] = useState([]);
  const [allDepartment, setAllDepartment] = useState([]);
  const [allPosition, setAllPosition] = useState([]);
  const [allEmployee, setAllEmployee] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const getDepartment = () => {
    axios
      .get(`https://localhost:44308/api/Departments/page/1/100`)
      .then((res) => {
        setAllDepartment(res.data);
      })
      .catch(() => {});
  };
  const getPosition = () => {
    axios
      .get(`https://localhost:44308/api/Positions/page/1/100`)
      .then((res) => {
        setAllPosition(res.data);
      })
      .catch(() => {});
  };
  const total = () => {
    axios
      .get(`https://localhost:44308/api/Employees/Count`)
      .then((res) => {
        setTotalPage(res.data);
      })
      .catch(() => {});
  };
  const getAllEmployee = (pageSize) => {
    axios
      .get(
        `https://localhost:44308/api/Employees/page/${pageIndex}/${pageSize}`
      )
      .then((res) => {
        setAllEmployee(res.data);
      })
      .catch(() => {});
  };
  const getData = (pageSize) => {
    axios
      .get(
        `https://localhost:44308/api/Employees/page/${pageIndex}/${pageSize}`
      )
      .then((res) => {
        setDataFromApi(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getDepartment();
    getPosition();
    getData(5);
    getAllEmployee(100);
    total();
  }, [pageIndex]);

  const handleDelete = (id) => {
    axios
      .delete(`https://localhost:44308/api/Employees/${id}`)
      .then((res) => {
        getData(5);
        total();
      })
      .catch(() => {});
  };

  const defaultColumns = [
    {
      title: "ID",
      dataIndex: "emId",
    },
    {
      title: "Name",
      dataIndex: "emName",
      width: "20%",
      editable: true,
    },
    {
      title: "Department",
      dataIndex: "departmentDeId",
      key: "departmentDeId",
      render: (text, data) =>
        allDepartment.map((item) => {
          if (item.deId === data.departmentDeId) {
            return <span key={item.deId}>{item.deName}</span>;
          }
        }),
    },
    {
      title: "Position",
      dataIndex: "positionPosId",
      key: "positionPosId",
      render: (text, data) =>
        allPosition.map((item) => {
          if (item.posId === data.positionPosId) {
            return <span key={item.posId}>{item.posName}</span>;
          }
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "20%",
      key: "status",
      render: (text) =>
        String(text) === "true" ? (
          <span>
            <Badge status="success" />
            Đang làm việc
          </span>
        ) : (
          <span>
            <Badge status="error" />
            Nghỉ
          </span>
        ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (text) => <span>{moment(text).format("DD/MM/YYYY")} </span>,
    },
    {
      title: "",
      dataIndex: "operation",
      width: "10%",
      render: (_, data) =>
        dataFromApi.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(data.emId)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
    {
      title: "",
      dataIndex: "employee",
      width: "10%",
      render: (_, data) => {
        return (
          <EmployeeContext.Provider
            value={{
              action: "edit",
              data,
              allDepartment,
              allPosition,
              getData,
              total,
            }}
          >
            <OpenModal title="Edit" tag="a">
              <EmployeeForm></EmployeeForm>
            </OpenModal>
          </EmployeeContext.Provider>
        );
      },
    },
  ];

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
      }),
    };
  });

  const exportTable = useCallback(async () => {
    const table = document.getElementById("tableEployee");
    const wb = XLSX.utils.table_to_book(table);

    XLSX.writeFile(wb, "Emloyee.xlsx");
  });

  return (
    <div>
      <EmployeeContext.Provider
        value={{
          action: "create",
          typeData: "employee",
          getData,
          total,
          allDepartment,
          allPosition,
        }}
      >
        <OpenModal title="Add Employee" tag="button">
          <EmployeeForm></EmployeeForm>
        </OpenModal>
      </EmployeeContext.Provider>
      <Table
        id="tableEployee"
        pagination={false}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataFromApi}
        columns={columns}
      />
      {/* <CSVLink data={allEmployee} filename={"my-employee.csv"} target="_blank"> */}
      <button onClick={exportTable}>Download</button>
      {/* </CSVLink> */}
      <Pagination
        total={totalPage}
        pageSize={5}
        showTotal={(totalPage) => `Total ${totalPage} items`}
        style={{ marginTop: 20 }}
        onChange={(page, pageSize) => setPageIndex(page)}
      />
    </div>
  );
}

export default EmployeeContent;
