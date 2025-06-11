import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { notification } from "antd";

interface PostRequestBody {
  [key: string]: any;
}

interface PostResponse {
  [key: string]: any;
}

export const usePostApi = (url: string, isNotification: boolean = true) => {
  const [notificationApi, contextHolder] = notification.useNotification();

  const mutation = useMutation<PostResponse, Error, PostRequestBody>({
    mutationFn: async (data: PostRequestBody) => {
      // 👉 Lấy token từ cookie
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      // 👉 Gửi request kèm Bearer token
      const response = await axios.post(url, data, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      return response.data;
    },
    onMutate: () => {
      if (isNotification) {
        notificationApi.info({
          message: "Đang xử lý...",
          description: "Yêu cầu đang được gửi đi. Vui lòng đợi!",
          duration: 2,
        });
      }
    },
    onSuccess: () => {
      if (isNotification) {
        notificationApi.success({
          message: "Thành công!",
          description: "Dữ liệu đã được gửi thành công!",
          duration: 3,
        });
      }
    },
    onError: (error: Error) => {
      if (isNotification) {
        notificationApi.error({
          message: "Lỗi!",
          description: `Có lỗi xảy ra: ${error.message}`,
          duration: 3,
        });
      }

      if (
        typeof window !== "undefined" &&
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        console.error("Error:", error.response.status);
        document.cookie =
          "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/login";
      }
    },
  });

  return { mutation, contextHolder };
};
