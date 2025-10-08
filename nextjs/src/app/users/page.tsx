/* eslint-disable */
"use client";
import React from "react";
import dynamic from "next/dynamic";
import type { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
// Ant Design
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Tag,
  Switch as AntSwitch,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import formatDateTime from "@/common/formatDate";
import Status from "@/common/status";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";

type UserRow = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  organizations: string[];
  status: "ACTIVE" | "INACTIVE";
  last_login: string; // ISO string
  created_at: string; // ISO string
};

export default function UsersManagement() {
  const { t } = useTranslation();

  // Nếu sau này muốn bấm toggle gọi API thật:
  const { mutation, contextHolder } = usePostApi(
    "/api/users/toggle-active",
    false
  );

  // =====================
  // State & Form
  // =====================

  const [viewing, setViewing] = React.useState<UserRow | null>(null);
  const [editing, setEditing] = React.useState<UserRow | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [form] = Form.useForm<UserRow>();

  const openCreate = () => {
    form.resetFields();
    setIsCreateOpen(true);
  };

  const openEdit = (record: UserRow) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
    });
  };

  const handleDelete = (id: string) => {
    message.success("Đã xóa người dùng");
  };

  const handleToggleActive = (row: UserRow, checked: boolean) => {
    const newStatus: UserRow["status"] = checked ? "ACTIVE" : "INACTIVE";

    // Demo gọi mutation giả
    mutation.mutate({ userId: row._id, active: checked });
  };

  // =====================
  // Submit Create / Edit
  // =====================
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        setEditing(null);
        message.success("Cập nhật người dùng thành công");
      } else {
        // Create

        setIsCreateOpen(false);
        message.success("Tạo người dùng thành công");
      }
      form.resetFields();
    } catch {
      // validate fail - do nothing
    }
  };

  // =====================
  // Column defs (ag-grid)
  // =====================
  const columns: ColDef<UserRow>[] = [
    {
      headerName: "User ID",
      field: "_id",
      width: 140,
      sortable: true,
      pinned: "left",
    },
    {
      headerName: "Full name",
      field: "name",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      width: 120,
      valueGetter: (p) => p.data?.role,
      cellRenderer: (params: any) => (
        <span
          className={
            params.value === "ADMIN"
              ? "text-red-600 font-medium"
              : "text-slate-700"
          }
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Units",
      field: "organizations",
      flex: 1.3,
      cellRenderer: (params: any) => {
        const orgs: string[] = params.data?.organizations || [];
        return (
          <Space size={4} wrap>
            {orgs.map((o: string) => (
              <Tag key={o} color="blue">
                {o}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      headerName: t("status") || "Status",
      field: "status",
      width: 140,
      cellRenderer: (params: any) => <Status status={params.value} />,
    },
    {
      headerName: t("active") || "Active",
      field: "activeSwitch",
      width: 120,
      suppressMenu: true,
      cellRenderer: (params: any) => (
        <AntSwitch
          checked={params.data?.status === "ACTIVE"}
          onChange={(checked) =>
            handleToggleActive(params.data as UserRow, checked)
          }
        />
      ),
    },

    {
      headerName: t("actions") || "Actions",
      field: "actions",
      width: 200,
      pinned: "right",
      suppressMenu: true,
      cellRenderer: (params: any) => {
        const row: UserRow = params.data;
        return (
          <Space>
            <Button
              type="text"
              icon={
                <EyeOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              onClick={() => setViewing(row)}
            />
            <Button
              type="text"
              icon={
                <EditOutlined
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
              }
              onClick={() => openEdit(row)}
            />
            <Popconfirm
              title="Xóa người dùng"
              description={`Bạn chắc chắn muốn xóa ${row.name}?`}
              okText="Xóa"
              okType="danger"
              cancelText="Hủy"
              onConfirm={() => handleDelete(row._id)}
            >
              <Button
                type="text"
                danger
                icon={
                  <DeleteOutlined
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <Button
          type="primary"
          icon={
            <PlusOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          onClick={openCreate}
        >
          {"Create user"}
        </Button>
      </div>

      {/* View Modal */}
      <Modal
        open={!!viewing}
        title="Thông tin người dùng"
        onCancel={() => setViewing(null)}
        footer={<Button onClick={() => setViewing(null)}>Đóng</Button>}
      >
        {viewing && (
          <Space direction="vertical" size="small">
            <div>
              <b>ID:</b> {viewing._id}
            </div>
            <div>
              <b>Họ tên:</b> {viewing.name}
            </div>
            <div>
              <b>Email:</b> {viewing.email}
            </div>
            <div>
              <b>Vai trò:</b> {viewing.role}
            </div>
            <div>
              <b>Đơn vị:</b> {viewing.organizations.join(", ")}
            </div>
            <div>
              <b>Trạng thái:</b> {viewing.status}
            </div>
            <div>
              <b>Lần đăng nhập gần nhất:</b>{" "}
              {formatDateTime({ value: viewing.last_login })}
            </div>
            <div>
              <b>Ngày tạo:</b> {formatDateTime({ value: viewing.created_at })}
            </div>
          </Space>
        )}
      </Modal>
      <DataTable
        tableHeight="calc(-330px + 100vh)"
        title={t("Users")}
        dataFieldName="users"
        apiUrl={API_URL.USER_PAGE.DEFAULT}
        columns={columns}
        showDatepicker={false}
      />
      {/* Create / Edit Modal (dùng chung) */}
      <Modal
        open={isCreateOpen || !!editing}
        title={editing ? "Cập nhật người dùng" : "Tạo người dùng"}
        onCancel={() => {
          setIsCreateOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={onSubmit}
        okText={editing ? "Cập nhật" : "Tạo mới"}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            role: "USER",
            organizations: [],
            status: "ACTIVE",
          }}
        >
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="VD: a.nguyen@example.com" />
          </Form.Item>

          <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "ADMIN", value: "ADMIN" },
                { label: "USER", value: "USER" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Đơn vị" name="organizations">
            <Select
              mode="tags"
              tokenSeparators={[","]}
              placeholder="Nhập tên đơn vị và Enter (đa lựa chọn)"
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" valuePropName="checked">
            {/* Map checked ↔ ACTIVE */}
            <AntSwitch
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
              onChange={(checked) =>
                form.setFieldsValue({ status: checked ? "ACTIVE" : "INACTIVE" })
              }
              checked={form.getFieldValue("status") !== "INACTIVE"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
