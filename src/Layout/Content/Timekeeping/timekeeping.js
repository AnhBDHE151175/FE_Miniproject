import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link,Route,Routes } from "react-router-dom";
import axios from "axios";
import AllTimekeeping from "./AllTimekeeping";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const TimeContent = () => {
  const [allEmployee, setAllEmployee] = useState([]);
  const [displayEmID,setDisplayEmID] = useState();

  const items2 = [getItem("User", "sub1", <UserOutlined />,allEmployee)];

  //   const items1 = [...items].map((item)=>{
  //     console.log(item)
  //   })

  const getAllEmployee = (pageSize) => {
    axios
      .get(`https://localhost:44308/api/Employees/page/1/${pageSize}`)
      .then((res) => {
        let item = res.data.map((item) => getItem(item.emName, item.emId,<UserOutlined/>));
        item = [getItem('All',-1,<UserOutlined/>),...item]
        setAllEmployee(item);
        setDisplayEmID(-1)
      })
      .catch(() => {});
  };

  const handleDisplay = (e) => {
    setDisplayEmID(e.key)
  };


  useEffect(() => {
    getAllEmployee(100);
  }, []);

  return (
    <Layout>
      <Content
        style={{
          padding: "0 0px",
        }}
      >
        <Layout
          className="site-layout-background"
          style={{
            padding: "30px 0",
          }}
        >
          <Sider className="site-layout-background" width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={"-1"}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={items2}
              onSelect={(e) => handleDisplay(e)}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 420,
              backgroundColor: "white",
            }}
          >
            <AllTimekeeping id={displayEmID}></AllTimekeeping>
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default TimeContent;
