/* eslint-disable  */
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
  const [notificationApi, contextHolder] = notification.useNotification(); // Đảm bảo notification được khởi tạo

  // Định nghĩa mutation
  const mutation = useMutation<PostResponse, Error, PostRequestBody>({
    mutationFn: async (data: PostRequestBody) => {
      const response = await axios.post(url, data);
      return response.data;
    },
    onMutate: () => {
      // Hiển thị thông báo khi bắt đầu request
      if (isNotification) {
        notificationApi.info({
          message: "Đang xử lý...",
          description: "Yêu cầu đang được gửi đi. Vui lòng đợi!",
          duration: 2,
        });
      }
    },
    onSuccess: () => {
      // Hiển thị thông báo khi thành công
      if (isNotification) {
        notificationApi.success({
          message: "Thành công!",
          description: "Dữ liệu đã được gửi thành công!",
          duration: 3,
        });
      }
    },
    onError: (error: Error) => {
      // Hiển thị thông báo khi có lỗi
      if (isNotification) {
        notificationApi.error({
          message: "Lỗi!",
          description: `Có lỗi xảy ra: ${error.message}`,
          duration: 3,
        });
      }
    },
  });

  return { mutation, contextHolder }; // Trả về mutation và contextHolder
};
