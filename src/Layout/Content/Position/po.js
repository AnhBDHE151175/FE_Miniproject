import { Button, Form, Input, Popconfirm, Table, Pagination } from "antd";
import React, { useEffect, useState, createContext } from "react";
import axios from "axios";
import OpenModal from "../../../Component/Modal/modal";
import PositionForm from "../../../Component/Form/PositionForm";

export const PositionContext = createContext();

function DepartmentContent() {
  const [dataFromApi, setDataFromApi] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);

  const total = () => {
    axios
      .get(`https://localhost:44308/api/Positions/Count`)
      .then((res) => {
        setTotalPage(res.data);
      })
      .catch(() => {});
  };

  const getData = () => {
    axios
      .get(`https://localhost:44308/api/Positions/page/${pageIndex}/5`)
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
      .delete(`https://localhost:44308/api/Positions/${key}`)
      .then((res) => {
        if (res.data.errorMessage === "Fail!") {
          alert("Some problem when delete this position!");
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
      dataIndex: "posId",
    },
    {
      title: "Name",
      dataIndex: "posName",
      width: "30%",
      editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      width: "10%",
      render: (_, data) =>
        dataFromApi.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(data.posId)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
    {
      title: "",
      dataIndex: "Position",
      width: "10%",
      render: (_, data) => {
        return (
          <PositionContext.Provider
            value={{ action: "edit", data, getData, total }}
          >
            <OpenModal title="Edit" tag="a">
              <PositionForm></PositionForm>
            </OpenModal>
          </PositionContext.Provider>
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
      <PositionContext.Provider
        value={{ action: "create", typeData: "position", getData, total }}
      >
        <OpenModal title="Add Position" tag="button">
          <PositionForm></PositionForm>
        </OpenModal>
      </PositionContext.Provider>
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
        showTotal={(totalPage) => `Total ${totalPage} items`}
        style={{ marginTop: 20 }}
        onChange={(page, pageSize) => setPageIndex(page)}
      />
    </div>
  );
}

export default DepartmentContent;
