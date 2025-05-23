/* eslint-disable @typescript-eslint/no-require-imports */
const { post } = require("axios");

const API_AUTH = "http://10.32.116.244:5000/api/auth/login"; // Lấy URL từ .env hoặc sử dụng giá trị mặc định

async function retrieveToken() {
  try {
    const loginData = {
      user_name: "test2",
      password: "Zxcvbnm!@#",
    };

    const response = await post(API_AUTH, loginData);

    // Kiểm tra nếu API trả về thành công
    if (response?.data?.code === 200) {
      token = response?.data?.data[0]?.token; // Điều chỉnh theo cấu trúc phản hồi thực tế
      if (token) {
        console.log("Token retrieved successfully:", token);

        return token;
      } else {
        throw new Error("Token not found in response.");
      }
    } else {
      throw new Error(response?.data?.message || "Login failed.");
    }
  } catch (error) {
    console.error("Error retrieving token:", error.message);
    throw error;
  }
}
module.exports = { retrieveToken };
