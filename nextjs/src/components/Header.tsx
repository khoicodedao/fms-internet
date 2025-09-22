"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js
import { Divider } from "antd";
import UnitTree from "./UnitTree";
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
  DeploymentUnitOutlined,
  GlobalOutlined,
  FileExclamationOutlined,
  SecurityScanOutlined,
  AreaChartOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Layout, Drawer, Button, Dropdown, Menu, Breadcrumb } from "antd";
import logo from "@/assets/images/logo.png";
import { useTranslation } from "react-i18next";
const { Header: AntHeader } = Layout;

export default function Header() {
  const { t, i18n } = useTranslation(); // multi-language support
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };
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

  // Custom breadcrumb item renderer to use Next.js Link
  const itemRender = (route: any, params: any, routes: any[]) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.title}</span>
    ) : (
      <Link href={route.href}>{route.title}</Link>
    );
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
      <Breadcrumb items={generateBreadcrumbs()} itemRender={itemRender} />

      <div className="flex-1 flex justify-center">
        <Link href={"/"}>
          <Image
            src={logo}
            alt="FMS Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>
      </div>
      <UnitTree></UnitTree>
      <div>
        <button
          className={selectedLanguage === "vi" ? "font-bold" : "opacity-50"}
          onClick={() => handleLanguageChange("vi")}
        >
          VN
        </button>
        <Divider type="vertical" />
        <button
          className={selectedLanguage === "en" ? "font-bold" : "opacity-50"}
          onClick={() => handleLanguageChange("en")}
        >
          {" "}
          EN
        </button>
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
            {
              key: "2",
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
              key: "3",
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
              key: "6",
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
              key: "8",
              label: t("Rules"),
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
              key: "8",
              label: t("MITRE events"),
              icon: (
                <SecurityScanOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/mittre-events");
                setDrawerOpen(false);
              },
            },

            {
              key: "9",
              label: t("Logs"),
              icon: (
                <FileExclamationOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/error-logs");
                setDrawerOpen(false);
              },
            },

            {
              key: "10",
              label: t("Statistic"),
              icon: (
                <LineChartOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              ),
              onClick: () => {
                router.push("/statistic");
                setDrawerOpen(false);
              },
            },
          ]}
        />
      </Drawer>
    </AntHeader>
  );
}
