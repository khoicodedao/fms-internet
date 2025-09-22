import { DatePicker, Space } from "antd";
import { useDateContext } from "@/common/date-context";
// import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
// import { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

const DatetimePicker = () => {
  const { startDate, setStartDate, endDate, setEndDate } = useDateContext();
  const handleRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  // Disable dates after today
  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   return current && current > dayjs().endOf("day");
  // };

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        onChange={handleRangeChange}
        // disabledDate={disabledDate}
        value={[startDate, endDate]}
      />
    </Space>
  );
};

export default DatetimePicker;
