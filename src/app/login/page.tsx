"use client";
import React from "react";
import { usePostApi } from "@/common/usePostApi";
import { Form, Input, Button, Spin } from "antd";
import API_URL from "@/common/api-url";
const LoginForm = () => {
  const { mutation, contextHolder } = usePostApi(API_URL.LOGIN_PAGE.DEFAULT);
  const isLoading = mutation.isPending;
  const onFinish = (values: { username: string; password: string }) => {
    const loginData = {
      user_name: values.username,
      password: values.password,
    };
    mutation.mutate(loginData);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      {contextHolder}
      <h1>Login</h1>
      <Form name="login-form" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter username!" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter password!" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin tip="Logging in..." />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
