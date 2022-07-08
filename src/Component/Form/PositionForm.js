import { Button, Form, Input, InputNumber, DatePicker } from "antd";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { PositionContext } from "../../Layout/Content/Position/po";

const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */

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
/* eslint-enable no-template-curly-in-string */

const PositionForm = () => {
  const posContext = useContext(PositionContext);

  const createPosition = (values) => {
    axios
      .post(`https://localhost:44308/api/Positions/Create`, {
        posName: values.position.name,
      })
      .then(() => {
        posContext.getData();
        posContext.total();
      });
  };

  const updateDepartment = (values) => {
    axios
      .put(`https://localhost:44308/api/Positions/Update`, {
        posId : posContext.data.posId,
        posName: values.position.name,
      })
      .then(() => {
        posContext.getData();
        posContext.total();
      });
  };

  const onFinish = (values) => {
    if (posContext) {
      createPosition(values);
    }
  };

  const onUpdate = (values) => {
    if (posContext) {
      updateDepartment(values);
    }
  };

  return (
    <Form
      {...layout}
      name="nest-messages"
      onFinish={posContext.action === "create" ? onFinish : onUpdate}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["position", "name"]}
        label="Name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input
          placeholder={
            posContext.action === "edit" ? posContext.data.posName : " "
          }
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

export default PositionForm;
