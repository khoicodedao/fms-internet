// Import các icon từ Ant Design
import {
  FileTextOutlined,
  LinkOutlined,
  CodeOutlined,
  FileProtectOutlined,
  UserOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

// Hàm trả về icon dựa trên loại file
function getFileIcon(fileType: string) {
  switch (fileType.toLowerCase()) {
    case "text":
    case "txt":
      return (
        <FileTextOutlined
          style={{ color: "#1E90FF" }} // Màu xanh dương cho file text
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    case "http":
    case "url":
      return (
        <LinkOutlined
          style={{ color: "#32CD32" }} // Màu xanh lá cây cho link hoặc URL
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    case "module":
      return (
        <CodeOutlined
          style={{ color: "#FF8C00" }} // Màu cam cho module hoặc mã nguồn
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    case "dll":
      return (
        <FileProtectOutlined
          style={{ color: "#8A2BE2" }} // Màu tím cho file DLL
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    case "user":
      return (
        <UserOutlined
          style={{ color: "#FFD700" }} // Màu vàng cho loại user
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    case "computer":
      return (
        <DesktopOutlined
          style={{ color: "#00CED1" }} // Màu xanh cyan cho loại computer
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );

    default:
      return (
        <FileTextOutlined
          style={{ color: "#808080" }} // Màu xám cho icon mặc định
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      );
  }
}

export default getFileIcon;
