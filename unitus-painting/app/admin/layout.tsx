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
  Layout as LayoutIcon,
} from "lucide-react";
import { Layout, Menu, Button, theme, Dropdown, Badge, Avatar } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "Blog",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Blog Management",
    href: "/admin",
  },
  {
    key: "projects",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Project Showcase",
    href: "/admin/projects",
  },
  {
    key: "areas-served",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Areas Served",
    href: "/admin/areas-served",
  },
  {
    key: "about",
    icon: <LayoutIcon className="w-4 h-4" />,
    label: "Update About",
    children: [
      {
        key: "about-hero",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "About Hero",
        href: "/admin/about-hero",
      },
      {
        key: "commitment",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Commitment Component",
        href: "/admin/commitment",
      },
      {
        key: "statistics",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Statistics Cards",
        href: "/admin/statistics",
      },
      {
        key: "history",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Company History",
        href: "/admin/history",
      },
      {
        key: "our-approach",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Our Approach",
        href: "/admin/our-approach",
      },
      {
        key: "our-approach",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Our Approach",
        href: "/admin/our-approach",
      },
      {
        key: "warranty",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Warranty Page",
        href: "/admin/warranty",
      }
    ]
  },
  {
    key: "landing",
    icon: <LayoutIcon className="w-4 h-4" />,
    label: "Update Home",
    children: [
      {
        key: "hero",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Hero",
        href: "/admin/hero",
      },
      {
        key: "reviews",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Reviews",
        href: "/admin/reviews",
      },
      {
        key: "about",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "About",
        href: "/admin/about",
      },
      {
        key: "services",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Services",
        href: "/admin/services",
      },
      {
        key: "clients",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Clients",
        href: "/admin/clients",
      },
      {
        key: "quote",
        icon: <MessageSquare className="w-4 h-4" />,
        label: "Get a Quote",
        href: "/admin/quote",
      },
    ],
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

  const transformMenuItem = (item: MenuItem) => {
    const menuItem: any = {
      key: item.key,
      icon: item.icon,
      label: item.href ? (
        <Link href={item.href}>{item.label}</Link>
      ) : (
        item.label
      ),
    };

    if (item.children) {
      menuItem.children = item.children.map(transformMenuItem);
    }

    return menuItem;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="border-r border-gray-200"
        style={{ 
          background: colorBgContainer,
          width: collapsed ? 80 : 320,          // Increased from 280 to 320
          minWidth: collapsed ? 80 : 320,       // Increased min width
          maxWidth: collapsed ? 80 : 320,       // Increased max width
          flex: '0 0 320px'                     // Increased flex basis
        }}
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
          defaultOpenKeys={['about', 'landing']} // Auto-expand these sections
          items={menuItems.map(transformMenuItem)}
          className="border-none"
          style={{
            fontSize: '14px',
            width: '100%'
          }}
          // Added padding to menu items
          itemStyle={{ padding: '0 24px 0 16px' }}
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