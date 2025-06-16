"use client";

import React, { useEffect, useState } from "react";
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
  const router = useRouter();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockTime, setLockTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);

  let isLoading = mutation.isPending;

  // ⏲️ Đồng hồ đếm ngược
  useEffect(() => {
    if (lockTime !== null) {
      const interval = setInterval(() => {
        const secondsLeft = Math.max(
          0,
          Math.floor((lockTime - Date.now()) / 1000)
        );
        setTimer(secondsLeft);
        if (secondsLeft <= 0) {
          setLockTime(null);
          setLoginAttempts(0);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockTime]);

  const onFinish = async (values: { username: string; password: string }) => {
    if (lockTime) {
      messageApi.error(`Too many attempts. Try again in ${timer}s`);
      return;
    }

    const loginData = {
      user_name: values.username,
      password: values.password,
    };

    mutation.mutate(loginData, {
      onSuccess: (response: any) => {
        if (response?.code === 200) {
          const token = response?.data[0]?.token;
          if (token) {
            Cookies.set("auth_token", token, { expires: 7 });
            messageApi.success("Login successful!");
            router.push("/");
          } else {
            messageApi.error("Login failed: Token not found.");
          }
        } else {
          handleFailedAttempt(response?.message || "Login failed.");
        }
      },
      onError: (error) => {
        handleFailedAttempt(error?.message || "An error occurred.");
      },
    });
  };

  const handleFailedAttempt = (msg: string) => {
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    messageApi.error(msg);

    if (attempts >= 5) {
      const lockUntil = Date.now() + 30 * 1000; // Lock 30s
      setLockTime(lockUntil);
      messageApi.warning("Too many failed attempts. Try again in 30 seconds.");
    }
  };

  return (
    <div className="flex flex-row items-center">
      <div className="w-full flex flex-row justify-center py-8">
        <Image src={logo} alt="FMS Logo" className="object-contain" priority />
      </div>

      <div className="w-full max-w-[1200px] grid px-4 border-l border-gray-300">
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isLoading || lockTime !== null}
                  >
                    {lockTime ? `Wait ${timer}s` : "Login"}
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
