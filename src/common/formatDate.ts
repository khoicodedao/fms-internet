const formatDateTime = (params: any) => {
  if (!params.value) return "";
  try {
    const date = new Date(params.value);
    if (isNaN(date.getTime())) return params.value;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return params.value;
  }
};

export default formatDateTime;
