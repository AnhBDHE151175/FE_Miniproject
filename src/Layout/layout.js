import { PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

function BigLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState([]);
  const [dataLogin, setDataLogin] = useState(
    JSON.parse(sessionStorage.getItem("employee"))
  );
  const loginContext = useContext(LoginContext);
  const navigate = useNavigate();


  // console.log(dataLogin)


  const setMenuItems = () => {
    var menu = [];
    const arr = [];

    dataLogin.value.roles.map((item) => {
      menu = item.screens;
    });

    menu.forEach((item) => {
      let obj = {
        label: <Link to={item.screenUrl}>{item.screenName}</Link>,
        key: item.screenName,
        icon: <PieChartOutlined />,
      };
      arr.push(obj);
    });
    setMenu(arr);
  };

  useEffect(() => {
    if (dataLogin) {
      setMenuItems();
      loginContext.setIsLogin(true);
    }
  }, [dataLogin]);

  useEffect(() => {
    if (loginContext.isLogin) {
      setDataLogin(JSON.parse(sessionStorage.getItem("employee")));
    }
  }, [loginContext.isLogin]);



  const handleLogOut = () => {
    sessionStorage.clear();
    loginContext.setIsLogin(false);
    navigate("/");
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {loginContext.isLogin && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={menu}
          />
          <button onClick={handleLogOut}>LogOut</button>
        </Sider>
      )}
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            backgroundColor: "#f0f2f5",
            height: 10,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          MiniProject
        </Footer>
      </Layout>
    </Layout>
  );
}

export default BigLayout;
