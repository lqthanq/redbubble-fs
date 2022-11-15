import { Affix, Menu } from "antd";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppstoreOutlined,
  GlobalOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  ApartmentOutlined,
  ApiOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { CgChevronDoubleLeft, CgChevronDoubleRight } from "react-icons/cg";
import SubMenu from "antd/lib/menu/SubMenu";
import _ from "lodash";
import { useAppValue } from "context";
import Scrollbars from "react-custom-scrollbars";
import HasPermission from "./HasPermission";
import { BiUser } from "react-icons/bi";
import styled from "styled-components";
import { MdSubscriptions } from "react-icons/md";

const Container = styled.div`
  .hidden-menu {
    display: none;
  }
`;

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <AppstoreOutlined />,
  },
  {
    title: "Sellers",
    icon: <BiUser />,
    href: "/sellers",
    permission: "UserManager",
  },
  {
    title: "Orders",
    href: "/orders",
    icon: <ShoppingCartOutlined />,
    childs: [
      {
        title: "All Orders",
        href: "/orders",
      },
      {
        title: "Export Templates",
        href: "/export-templates",
      },
    ],
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: <ApartmentOutlined />,
  },
  {
    title: "Artworks",
    href: "/artworks",
    icon: <PieChartOutlined />,
  },
  {
    title: "Cliparts",
    href: "/cliparts",
    icon: <ApiOutlined />,
  },
  {
    title: "Online Stores",
    href: "/stores",
    icon: <GlobalOutlined />,
  },
  {
    title: "Product Bases",
    href: "/product-bases-menu",
    icon: <DatabaseOutlined />,
    childs: [
      {
        title: "All Product Bases",
        href: "/product-bases",
      },
      {
        title: "Fulfillments",
        href: "/product-bases/fulfillments",
      },
      {
        title: "Categories",
        href: "/product-bases/categories",
      },
      {
        title: "Color Managements",
        href: "/product-bases/color-managements",
      },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingOutlined />,
    role: "Administrator",
    childs: [
      {
        title: "General",
        href: "/settings/general",
      },
    ],
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: <MdSubscriptions className="anticon" style={{ marginRight: 15 }} />,
    childs: [
      {
        title: "Overview",
        href: "/subscriptions/overview",
        role: "Seller",
      },
      {
        title: "Pricing-plans",
        href: "/subscriptions/pricing-plans",
      },
      {
        title: "Statistic",
        href: "/subscriptions/statistic",
        role: "Seller",
      },
      {
        title: "Invoices",
        href: "/subscriptions/invoices",
        role: "Administrator",
      },
      {
        title: "Payment",
        href: "/subscriptions/payment",
        role: "Administrator",
      },
    ],
  },
];
const MainMenu = () => {
  const [{ menuCollapsed, currentUser }, dispatch] = useAppValue();
  const [items] = useState(menuItems);
  const router = useRouter();
  const toggleCollapsed = () => {
    dispatch({
      type: "toggleMenuCollapsed",
    });
  };
  const childMenu = _.filter(items, (item) => {
    return item.childs;
  });
  const defaultOpenKeys = _.filter(childMenu, (children) => {
    return _.find(children.childs, (childRouter) => {
      return childRouter.href === location.pathname;
    });
  });

  const isAdmin = currentUser?.roles?.some((el) => el === "Administrator");

  return (
    <Container>
      <Scrollbars
        className="ppod-left-navigation"
        style={{ height: "calc(100vh - 109px)" }}
      >
        <Menu
          mode="inline"
          selectable={false}
          style={{ background: "transparent", border: "none", paddingTop: 10 }}
          selectedKeys={[router.pathname]}
          inlineCollapsed={menuCollapsed}
          defaultOpenKeys={
            defaultOpenKeys.length > 0
              ? [defaultOpenKeys[0].href]
              : defaultOpenKeys
          }
        >
          {items.map((item) => {
            if (item.childs) {
              return (
                <SubMenu
                  className={
                    isAdmin && item.title === "Settings"
                      ? "hidden-menu"
                      : "null"
                  }
                  key={item.href}
                  icon={item.icon}
                  title={item.title}
                >
                  {item.childs.map((children) => (
                    <Menu.Item
                      hidden={
                        children.role &&
                        !currentUser?.roles.includes(children.role)
                      }
                      key={children.href}
                    >
                      <Link href={children.href || "/"}>
                        <a>{children.title}</a>
                      </Link>
                    </Menu.Item>
                  ))}
                </SubMenu>
              );
            }
            return (
              <Menu.Item
                hidden={!isAdmin && item.title === "Sellers"}
                icon={!isAdmin && item.title === "Sellers" ? null : item.icon}
                key={item.href}
              >
                <HasPermission permissions={item.permission}>
                  <Link href={item.href || "/"}>
                    <a>{item.title}</a>
                  </Link>
                </HasPermission>
              </Menu.Item>
            );
          })}
        </Menu>
      </Scrollbars>
      <Affix offsetBottom={0}>
        <Menu
          mode="inline"
          selectable={false}
          style={{
            background: "#F4F6F8",
            border: "none",
            borderTop: ".1rem solid #dfe3e8",
            //position: "fixed",
            //bottom: 0,
          }}
          selectedKeys={[router.pathname]}
          inlineCollapsed={menuCollapsed}
          defaultOpenKeys={
            defaultOpenKeys.length > 0
              ? [defaultOpenKeys[0].href]
              : defaultOpenKeys
          }
        >
          <Menu.Item
            icon={
              menuCollapsed ? (
                <CgChevronDoubleRight className="anticon" />
              ) : (
                <CgChevronDoubleLeft className="anticon" />
              )
            }
          >
            <a
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapsed();
              }}
            >
              Collapse sidebar
            </a>
          </Menu.Item>
        </Menu>
      </Affix>
    </Container>
  );
};

export default MainMenu;
