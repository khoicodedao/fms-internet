"use client";

import React from "react";
import { usePostApi } from "@/common/usePostApi";
import { Form, Input, Button, Spin, message } from "antd";
import API_URL from "@/common/api-url";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
const LoginForm = () => {
  const [messageApi, messageHolder] = message.useMessage();
  const { mutation, contextHolder } = usePostApi(
    API_URL.LOGIN_PAGE.DEFAULT,
    false
  );
  let isLoading = mutation.isPending;
  const router = useRouter();

  const onFinish = async (values: { username: string; password: string }) => {
    const loginData = {
      user_name: values.username,
      password: values.password,
    };

    mutation.mutate(loginData, {
      onSuccess: (response: any) => {
        // Kiểm tra nếu API trả về thành công
        if (response?.code === 200) {
          const token = response?.data[0]?.token;
          console.log("Token:", response);
          if (token) {
            // Lưu token vào cookie hoặc localStorage
            Cookies.set("auth_token", token, { expires: 7 }); // Lưu trong 7 ngày
            messageApi.success("Login successful!");
            router.push("/"); // Điều hướng đến trang dashboard
          } else {
            messageApi.error("Login failed: Token not found.");
          }
        } else {
          messageApi.error(response?.message || "Login failed.");
          isLoading = false;
        }
      },
      onError: (error) => {
        messageApi.error(
          error?.message || "An error occurred. Please try again."
        );
      },
    });
  };

  return (
    <div className="flex flex-row items-center">
      <div className="w-full flex flex-row justify-center py-8">
        <Image src={logo} alt="FMS Logo" className="object-contain" priority />
      </div>

      <div className="w-full max-w-[1200px] grid px-4 border-l border-gray-300 ">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {contextHolder}
            {messageHolder}
            <h1 className="text-center text-4xl mb-8">Login</h1>
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
                <div className="flex justify-between items-center">
                  <Button type="primary" htmlType="submit" disabled={isLoading}>
                    Login
                  </Button>
                  {isLoading && <Spin tip="Logging in..." />}
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
