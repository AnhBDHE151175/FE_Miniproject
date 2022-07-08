import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import React, { useState, useContext } from "react";
import { LoginContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Login = () => {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const getData = (values) => {
    axios
      .post(`https://localhost:44308/api/Employees/Login`, {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        sessionStorage.setItem("employee", JSON.stringify(res.data));
        sessionStorage.setItem("status", res.data.value.status);
        loginContext.setIsLogin(true);
        navigate("/emptimekeeping");
      });
  };

  const onFinish = (values) => {
    if (values) {
      getData(values);
    }
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className="login-form">
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
