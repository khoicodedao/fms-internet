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
  CodeOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  DeploymentUnitOutlined, // Import for EDR
  GlobalOutlined, // Import for NDR
} from "@ant-design/icons";
import { Layout, Drawer, Button, Dropdown, Menu, Breadcrumb } from "antd";
import logo from "@/assets/images/logo.png";
import { useTranslation } from "react-i18next";
const { Header: AntHeader } = Layout;

export default function Header() {
  const { t, i18n } = useTranslation(); // multi-language support
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
          label: t("change_password"),
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
          label: t("logout"),
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
      <div>
        <button onClick={() => i18n.changeLanguage("vi")}>VN | </button>
        <button onClick={() => i18n.changeLanguage("en")}> EN</button>
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
        headerStyle={{ display: "none" }}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={240}
        style={{ top: "6rem", position: "absolute" }}
      >
        <Menu
          mode="vertical"
          items={[
            {
              key: "1",
              label: t("malops_management"),
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
              label: t("investigation"),
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
              label: "NDR",
              icon: (
                <GlobalOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/ndr");
                setDrawerOpen(false);
              },
            },
            {
              key: "4",
              label: "EDR",
              icon: (
                <DeploymentUnitOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/edr");
                setDrawerOpen(false);
              },
            },
            {
              key: "5",
              label: t("cli"),
              icon: (
                <CodeOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/cli");
                setDrawerOpen(false);
              },
            },
            {
              key: "6",
              label: t("events"),
              icon: (
                <ClockCircleOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/events");
                setDrawerOpen(false);
              },
            },
            {
              key: "7",
              label: t("alerts"),
              icon: (
                <AlertOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/alerts");
                setDrawerOpen(false);
              },
            },
          ]}
        />
      </Drawer>
    </AntHeader>
  );
}
