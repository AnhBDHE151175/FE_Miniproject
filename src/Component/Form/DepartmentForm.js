import { Button, Form, Input, InputNumber, DatePicker } from "antd";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { DepartmentContext } from "../../Layout/Content/Department/de";


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


const DepartmentForm = () => {
  const deContext = useContext(DepartmentContext);

  const createDepartment = (values) => {
    axios
      .post(`https://localhost:44308/api/Departments/Create`, {
        deName: values.department.name,
      })
      .then(() => {
        deContext.getData();
        deContext.total();
      });
  };
  const updateDepartment = (values) => {
    axios
      .put(`https://localhost:44308/api/Departments/Update`, {
        deId : deContext.data.deId,
        deName: values.department.name,
      })
      .then(() => {
        deContext.getData();
        deContext.total();
      });
  };

  const onFinish = (values) => {
    if (deContext) {
      createDepartment(values);
    }
  };

  const onUpdate = (values)=>{
    updateDepartment(values)
  }

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={(deContext.action === "create") ? onFinish : onUpdate}
      validateMessages={validateMessages}
    >
      <Form.Item
          name={["department", "name"]}
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            placeholder={deContext.action === "edit"?deContext.data.deName:" "}
          />
        </Form.Item>
      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DepartmentForm;
