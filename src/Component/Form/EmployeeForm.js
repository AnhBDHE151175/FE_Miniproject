import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { EmployeeContext } from "../../Layout/Content/Employee/employee";
import moment from "moment";

const { Option } = Select;

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const EmployeeForm = () => {
  const emContext = useContext(EmployeeContext);

  const createEmployee = (values) => {
    axios
      .post(`https://localhost:44308/api/Employees/Create`, {
        emName: values.employee.name,
        departmentDeId: values.employee.department,
        positionPosId: values.employee.position,
        status: values.employee.status === "1",
        startDate: moment(),
      })
      .then(() => {
        emContext.getData(5);
        emContext.total();
      });
  };
  const updateEmployee = (values) => {
    axios
      .put(`https://localhost:44308/api/Employees/Update`, {
        emId: emContext.data.emId,
        emName:
          typeof values.employee.name !== "undefined"
            ? values.employee.name
            : emContext.data.emName,
        departmentDeId:
          typeof values.employee.department !== "undefined"
            ? values.employee.department
            : emContext.data.departmentDeId,
        positionPosId:
          typeof values.employee.position !== "undefined"
            ? values.employee.position
            : emContext.data.positionPosId,
        status:
          typeof values.employee.status !== "undefined"
            ? values.employee.status === "1"
            : emContext.data.status === "1",
      })
      .then(() => {
        emContext.getData(5);
        emContext.total();
      });
  };

  const onCreate = (values) => {
    if (emContext) {
      createEmployee(values);
    }
  };

  const onUpdate = (values) => {
    if (emContext) {
      updateEmployee(values);
      console.log(values);
    }
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={emContext.action === "create" ? onCreate : onUpdate}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["employee", "name"]}
        label="Name"
        rules={[
          {
            required: emContext.action === "create",
          },
        ]}
      >
        <Input
          defaultValue={
            emContext.action === "edit" ? emContext.data.emName : ""
          }
        />
      </Form.Item>

      <Form.Item
        name={["employee", "department"]}
        label="Department"
        rules={[
          {
            required: emContext.action === "create",
            message: "Please select your department!",
          },
        ]}
      >
        <Select
          placeholder="Please select a department"
          defaultValue={
            emContext.action === "edit" ? emContext.data.departmentDeId : ""
          }
        >
          {emContext.allDepartment.map((item) => {
            return <Option key={item.deId} value={item.deId}>{item.deName}</Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item
        name={["employee", "position"]}
        label="Position"
        rules={[
          {
            required: emContext.action === "create",
            message: "Please select your position!",
          },
        ]}
      >
        <Select
          placeholder="Please select a position"
          defaultValue={
            emContext.action === "edit" ? emContext.data.positionPosId : ""
          }
        >
          {emContext.allPosition.map((item) => {
            return <Option key={item.deId} value={item.posId}>{item.posName}</Option>;
          })}
        </Select>
      </Form.Item>

      <Form.Item name={["employee", "status"]} label="Status">
        <Select
          placeholder="Choose status"
          defaultValue={
            emContext.action === "edit" && emContext.data.status === true
              ? "Active"
              : "Not Active"
          }
        >
          <Option value="1">Active</Option>
          <Option value="0">Not Active</Option>
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
