"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Users,
  Settings,
  MenuIcon,
  Bell,
  User,
  MessageSquare,
} from "lucide-react";
import { Layout, Menu, Button, theme, Dropdown, Badge, Avatar } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    key: "blogs",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Blogs",
    href: "/admin",
  },
  {
    key: "projects",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Projects",
    href: "/admin/projects",
  },
  {
    key: "pages",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Customer Feedback",
    href: "/admin/customerFeedback",
  },
  {
    key: "reviews",
    icon: <MessageSquare className="w-4 h-4" />,
    label: "Reviews",
    href: "/admin/reviews",
  },
  {
    key: "users",
    icon: <Users className="w-4 h-4" />,
    label: "Users",
    href: "/admin/users",
  },
];

const userMenuItems = [
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "logout",
    label: "Logout",
    danger: true,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="border-r border-gray-200"
        style={{ background: colorBgContainer }}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200">
          <Link href="/admin">
            <h1
              className={`text-xl font-bold transition-all duration-200 ${
                collapsed ? "scale-0" : "scale-100"
              }`}
            >
              Admin CMS
            </h1>
          </Link>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname.split("/")[2] || "dashboard"]}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link href={item.href}>{item.label}</Link>,
          }))}
          className="border-none"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
          }}
          className="flex items-center justify-between border-b border-gray-200"
        >
          <Button
            type="text"
            icon={<MenuIcon className="w-4 h-4" />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div className="flex items-center gap-4">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="flex items-center gap-2">
                <Avatar
                  size="small"
                  icon={<User className="w-full h-full" />}
                  className="flex items-center justify-center"
                />
                <span>Admin User</span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-6">
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}