/* eslint-disable */
"use client";
import { Divider } from "antd";
import { useEffect, useState } from "react";
import ObjectDetailHeader from "./header";
import getFileIcon from "../../object-type/object-type";
import Description from "./description/description";
import Communication from "./communication/communication";
import MachineProfilePage from "./machine-profile/machine-profile";
import ProcessPage from "./process/process";
import { SettingOutlined } from "@ant-design/icons";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
// import { useRouter } from "next/router";
import { useParams } from "next/navigation";
export default function MalOpsManagementDetail() {
  const processData = [
    {
      alert_time: "2025-07-02 15:35:57",
      object: "Process",
      action: "Create",
      mitre_tactic: "TA0005--Defense Evasion",
      mitre_tecnique: "T1057--Discovery: Process Discovery",
      mitre_desc: "Suspicious Silent CMD Execution with Network Recon",
      fields: {
        command_line:
          "\\??\\C:\\Windows\\system32\\conhost.exe 0xffffffff -ForceV1",
        image_path: "C:\\Windows\\System32\\conhost.exe",
        exe: "conhost.exe",
        current_working_directory: "",
        pid: 1032,
        ppid: 13860,
        parent_image_path: "C:\\Windows\\System32\\Defrag.exe",
        parent_exe: ".exe",
        xxHash_path: "B81F3A87",
      },
    },
    {
      alert_time: "2025-07-02 15:41:45",
      object: "Process",
      action: "Create",
      mitre_tactic: "TA0005--Defense Evasion",
      mitre_tecnique: "T1057--Discovery: Process Discovery",
      mitre_desc: "Suspicious Silent CMD Execution with Network Recon",
      fields: {
        command_line:
          "\\??\\C:\\Windows\\system32\\conhost.exe 0xffffffff -ForceV1",
        image_path: "C:\\Windows\\System32\\conhost.exe",
        exe: "conhost.exe",
        current_working_directory: "",
        pid: 13020,
        ppid: 1280,
        parent_image_path: "C:\\Windows\\System32\\Defrag.exe",
        parent_exe: ".exe",
        xxHash_path: "B81F3A87",
      },
    },
    {
      alert_time: "2025-07-02 16:29:02",
      object: "Process",
      action: "Create",
      mitre_tactic: "TA0005--Defense Evasion",
      mitre_tecnique: "T1057--Discovery: Process Discovery",
      mitre_desc: "Suspicious Silent CMD Execution with Network Recon",
      fields: {
        command_line:
          "\\??\\C:\\Windows\\system32\\conhost.exe 0xffffffff -ForceV1",
        image_path: "C:\\Windows\\System32\\conhost.exe",
        exe: "conhost.exe",
        current_working_directory: "",
        pid: 2968,
        ppid: 11672,
        parent_image_path: "C:\\Windows\\System32\\Defrag.exe",
        parent_exe: ".exe",
        xxHash_path: "B81F3A87",
      },
    },
    {
      alert_time: "2025-07-02 16:42:06",
      object: "Process",
      action: "Create",
      mitre_tactic: "TA0005--Defense Evasion",
      mitre_tecnique: "T1057--Discovery: Process Discovery",
      mitre_desc: "Suspicious Silent CMD Execution with Network Recon",
      fields: {
        command_line:
          "\\??\\C:\\Windows\\system32\\conhost.exe 0xffffffff -ForceV1",
        image_path: "C:\\Windows\\System32\\conhost.exe",
        exe: "conhost.exe",
        current_working_directory: "",
        pid: 14260,
        ppid: 2112,
        parent_image_path: "C:\\Windows\\System32\\Defrag.exe",
        parent_exe: ".exe",
        xxHash_path: "B81F3A87",
      },
    },
    {
      alert_time: "2025-07-02 16:31:53",
      object: "Process",
      action: "Create",
      mitre_tactic: "TA0005--Defense Evasion",
      mitre_tecnique: "T1057--Discovery: Process Discovery",
      mitre_desc: "Suspicious Silent CMD Execution with Network Recon",
      fields: {
        command_line:
          "\\??\\C:\\Windows\\system32\\conhost.exe 0xffffffff -ForceV1",
        image_path: "C:\\Windows\\System32\\conhost.exe",
        exe: "conhost.exe",
        current_working_directory: "",
        pid: 3332,
        ppid: 13112,
        parent_image_path:
          "C:\\Program Files (x86)\\Foxit Software\\Foxit Reader\\FoxitReaderConnectedPDFService.exe",
        parent_exe: ".exe",
        md5_hash: "972A57DA2118408F7617096EAD48FC33",
        sha1_hash: "2EAD094611E9B7EE9B916A0B54810CCA01E1E332",
        sha256_hash: "",
        fqdn: "DESKTOP-DV2CAPI",
        host_name: "DESKTOP-DV2CAPI",
        integrity_level: "",
        sid: "",
        user: "",
        uid: 0,
        signature_valid: "",
        signer: "FOXIT SOFTWARE INC.",
        access_level: null,
        call_trace: null,
        env_vars: null,
        guid: null,
        parent_commandline: null,
        parent_guid: null,
        target_address: null,
        target_guid: null,
        target_name: null,
        target_pid: null,
        xxHash_path: "EC034312",
      },
    },
  ];

  const { id } = useParams(); // Lấy id từ dynamic route
  const [activeSection, setActiveSection] = useState("diagram");
  const [filterData, setFilterData] = useState([]);
  const { mutation: mutationList, contextHolder } = usePostApi(
    API_URL.MALOPS_PAGE.DEFAULT,
    true
  );
  useEffect(() => {
    mutationList.mutate(
      {
        start_date: "2025-03-31 00",
        end_date: "2026",
        skip: 0,
        limit: 50,
        filter: id,
      },
      {
        onSuccess: (data) => {
          // Kiểm tra nếu data là mảng, nếu không thì gán giá trị mặc định là mảng rỗng
          console.log(data.data.alerts);
          if (data.data.alerts) {
            setFilterData(data.data.alerts);
          } else {
            setFilterData([]);
          }
        },
        onError: (error) => {
          console.error("Lỗi khi gọi API:", error);
          setFilterData([]); // Gán giá trị mặc định nếu có lỗi
        },
      }
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Đảm bảo chỉ chạy trên client

    const handleScroll = () => {
      if (typeof window === "undefined") return; // Kiểm tra window có tồn tại không

      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition <= sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Kiểm tra ngay khi component mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== "undefined") {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      {contextHolder}
      <ObjectDetailHeader
        // type={"Malware"}
        icon={getFileIcon("file")}
        //@ts-ignore
        title={filterData[0]?.filter_name || ""}
        //@ts-ignore
        description={filterData[0]?.filter_description || ""}
        //@ts-ignore
        time_start={filterData[0]?.start_time || ""}
        //@ts-ignore
        time_end={filterData[0]?.end_time || ""}
      />
      <section id="diagram">
        <Description data={filterData} rootCauseDetails="Root Cause Details" />
      </section>
      <Divider />
      <section id="communication">
        <Communication />
      </section>
      <Divider />
      <section id="machine-profile">
        <MachineProfilePage />
      </section>
      <section id="process-profile">
        <ProcessPage data={processData} />
      </section>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center">
        <button
          onClick={() => scrollToSection("diagram")}
          className={`flex flex-col items-center ${
            activeSection === "diagram" ? "text-yellow-500" : "text-gray-500"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-xs">Diagram</span>
        </button>

        <button
          onClick={() => scrollToSection("communication")}
          className={`flex flex-col items-center ${
            activeSection === "communication"
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-xs">Communication</span>
        </button>

        <button
          onClick={() => scrollToSection("machine-profile")}
          className={`flex flex-col items-center ${
            activeSection === "machine-profile"
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">Machine Profile</span>
        </button>
        <button
          onClick={() => scrollToSection("process-profile")}
          className={`flex flex-col items-center ${
            activeSection === "process-profile"
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          <SettingOutlined
            className="w-6 h-6"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <span className="text-xs">Process Profile</span>
        </button>
      </div>
    </div>
  );
}
