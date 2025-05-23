'use client';

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Users,
  Settings,
  Bell,
  User,
  MessageSquare,
  Layout as LayoutIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Layout, Menu, Button, theme, Dropdown, Badge, Avatar } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

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
    key: "Home",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Home",
    href: "/admin",
  },
  {
    key: "Blog",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Blog Management",
    href: "/admin/blogs",
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
    key: "contact",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Contact",
    href: "/admin/contact",
  },
  {
    key: "videos",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "Video Management",
    href: "/admin/videos",
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
];

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
        });

        if (!response.ok) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('isAuthenticated');
        toast.success('Logged out successfully');
        router.push('/login');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const handleMenuClick = async ({ key }: { key: string }) => {
    if (key === 'logout') {
      await handleLogout();
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => router.push('/admin/profile'),
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <div className="relative">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="border-r border-gray-200 min-h-screen"
          style={{ 
            background: colorBgContainer,
            width: collapsed ? 80 : 320,
            minWidth: collapsed ? 80 : 320,
            maxWidth: collapsed ? 80 : 320,
            flex: '0 0 320px'
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
            defaultOpenKeys={['about', 'landing']}
            items={menuItems.map(transformMenuItem)}
            className="border-none"
            style={{
              fontSize: '14px',
              width: '100%'
            }}
          />
        </Sider>
        <Button
          type="text"
          icon={collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border shadow-md rounded-full w-8 h-8 flex items-center justify-center z-10"
        />
      </div>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
          }}
          className="flex items-center justify-end border-b border-gray-200"
        >
          <div className="flex items-center gap-4">
            <Dropdown 
              menu={{ 
                items: userMenuItems,
                onClick: handleMenuClick
              }} 
              placement="bottomRight"
            >
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