"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  KeyOutlined,
  BarChartOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Layout, Drawer, Button, Dropdown, Menu, Breadcrumb } from "antd";
import logo from "@/assets/images/logo.png";
const { Header: AntHeader } = Layout;

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const generateBreadcrumbs = () => {
    const paths = pathname?.split("/").filter((path) => path);
    return [
      { title: "Home", href: "/" },
      ...(paths?.map((path, index) => ({
        title: path.charAt(0).toUpperCase() + path.slice(1),
        href: "/" + paths.slice(0, index + 1).join("/"),
      })) || []),
    ];
  };

  const userMenu = (
    <Menu
      items={[
        {
          key: "1",
          icon: (
            <KeyOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ),
          label: "Change Password",
          onClick: () => {
            /* handle password change */
          },
        },
        {
          key: "2",
          icon: (
            <LogoutOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ),
          label: "Logout",
          onClick: () => {
            /* handle logout */
          },
        },
      ]}
    />
  );

  return (
    <AntHeader className="section-header fixed top-0 w-full bg-white border-b h-24 flex items-center justify-between px-4 z-50">
      <Button
        type="text"
        icon={
          <MenuOutlined
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        }
        onClick={() => setDrawerOpen(true)}
      />
      <Breadcrumb items={generateBreadcrumbs()} />

      <div className="flex-1 flex justify-center">
        <Image
          src={logo}
          alt="FMS Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      <Dropdown overlay={userMenu} placement="bottomRight" arrow>
        <Button
          type="text"
          icon={
            <UserOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
        />
      </Dropdown>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Menu
          mode="vertical"
          items={[
            {
              key: "1",
              label: "MalOps Management",
              icon: (
                <BarChartOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/malops-management");
                setDrawerOpen(false);
              },
            },
            {
              key: "2",
              label: "Investigation",
              icon: (
                <SearchOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/investigation");
                setDrawerOpen(false);
              },
            },
            {
              key: "3",
              label: "Device Control",
              icon: (
                <SafetyCertificateOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/device-control");
                setDrawerOpen(false);
              },
            },
          ]}
        />
      </Drawer>
    </AntHeader>
  );
}
