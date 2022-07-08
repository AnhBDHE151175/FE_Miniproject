import { Button, Form, Input, Popconfirm, Table, Pagination } from "antd";
import moment from "moment";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import axios from "axios";
import OpenModal from "../../../Component/Modal/modal";
import DepartmentForm from "../../../Component/Form/DepartmentForm";

export const DepartmentContext = createContext();

const DepartmentContent = () => {
  const [dataFromApi, setDataFromApi] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const total = () => {
    axios
      .get(`https://localhost:44308/api/Departments/Count`)
      .then((res) => {
        setTotalPage(res.data);
      })
      .catch(() => {});
  };

  const getData = () => {
    axios
      .get(`https://localhost:44308/api/Departments/page/${pageIndex}/5`)
      .then((res) => {
        setDataFromApi(res.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getData();
    total();
  }, [pageIndex]);

  const handleDelete = (key) => {
    axios
      .delete(`https://localhost:44308/api/Departments/${key}`)
      .then((res) => {
        if (res.data.errorMessage === "Fail!") {
          alert("Some problem when delete this department!");
        } else {
          getData();
          total();
        }
      })
      .catch(() => {});
  };

  const defaultColumns = [
    {
      title: "ID",
      dataIndex: "deId",
    },
    {
      title: "Name",
      dataIndex: "deName",
      width: "30%",
      editable: true,
    },
    {
      title: "CreateDate",
      dataIndex: "createDate",
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
            onConfirm={() => handleDelete(data.deId)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
    {
      title: "",
      dataIndex: "Department",
      width: "10%",
      render: (_, data) => {
        return (
          <DepartmentContext.Provider value={{ action: "edit", data, getData }}>
            <OpenModal title="Edit" tag="a">
              <DepartmentForm></DepartmentForm>
            </OpenModal>
          </DepartmentContext.Provider>
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
  return (
    <div>
      <DepartmentContext.Provider
        value={{ action: "create", typeData: "department", getData, total }}
      >
        <OpenModal title="Add Department" tag="button">
          <DepartmentForm></DepartmentForm>
        </OpenModal>
      </DepartmentContext.Provider>
      <Table
        pagination={false}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataFromApi}
        columns={columns}
      />
      <Pagination
        total={totalPage}
        pageSize={5}
        showTotal={(total) => `Total ${total} items`}
        style={{ marginTop: 20 }}
        onChange={(page, pageSize) => setPageIndex(page)}
      />
    </div>
  );
};

export default DepartmentContent;
