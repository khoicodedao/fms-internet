import {
  DesktopOutlined,
  LaptopOutlined,
  CloudOutlined,
  GlobalOutlined,
  ApartmentOutlined,
  ApiOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  SaveOutlined,
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  ToolOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileTextOutlined,
  FileMarkdownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const getNodeIcon = (label: string) => {
  const fileIconMap: Record<string, any> = {
    pdf: FilePdfOutlined,
    doc: FileWordOutlined,
    docx: FileWordOutlined,
    xls: FileExcelOutlined,
    xlsx: FileExcelOutlined,
    ppt: FilePptOutlined,
    pptx: FilePptOutlined,
    jpg: FileImageOutlined,
    jpeg: FileImageOutlined,
    png: FileImageOutlined,
    gif: FileImageOutlined,
    zip: FileZipOutlined,
    rar: FileZipOutlined,
    txt: FileTextOutlined,
    md: FileMarkdownOutlined,
    js: FileOutlined,
    jsx: FileOutlined,
    ts: FileOutlined,
    tsx: FileOutlined,
    exe: FileOutlined,
  };

  const nodeIconMap: Record<string, any> = {
    computer: DesktopOutlined,
    desktop: DesktopOutlined,
    laptop: LaptopOutlined,
    server: SaveOutlined,
    database: DatabaseOutlined,
    cloud: CloudOutlined,
    network: ApartmentOutlined,
    api: ApiOutlined,
    cluster: ClusterOutlined,
    web: GlobalOutlined,
    internet: GlobalOutlined,
    user: UserOutlined,
    team: TeamOutlined,
    setting: SettingOutlined,
    config: SettingOutlined,
    tool: ToolOutlined,
    file: FileOutlined,
    js: FileOutlined,
  };

  const normalizedLabel = label.toLowerCase();

  const extension = normalizedLabel.split(".").pop();
  if (extension && fileIconMap[extension]) {
    const IconComponent = fileIconMap[extension];
    return (
      <IconComponent onpointerenter={undefined} onpointerleave={undefined} />
    );
  }

  const matchedNode = Object.keys(nodeIconMap).find((key) =>
    normalizedLabel.includes(key)
  );

  if (matchedNode) {
    const IconComponent = nodeIconMap[matchedNode];
    return (
      <IconComponent
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      />
    );
  }

  return (
    <QuestionCircleOutlined
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  );
};

export default getNodeIcon;
