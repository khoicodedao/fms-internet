const ObjectDetailHeader = ({ icon, title, type, description }) => {
  return (
    <div className="flex items-center justify-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10 shadow">
      {/* Icon bên trái */}
      <div className="mr-4 text-6xl">
        {icon} {/* Đây là icon được truyền vào từ props */}
      </div>
      {/* Phần chứa tiêu đề và mô tả */}
      <div className="flex-1">
        {/* Block title màu đỏ */}
        <p className="text-red-500 text-sm font-bold">{type}</p>
        <h3 className="text-xl font-bold">{title}</h3>
        {/* Mô tả bên dưới */}
        <p className="text-gray-700 opacity-75">{description}</p>
      </div>
      {/* Selector thời gian bên phải */}
      <div className="mr-4">
        <select id="timeSelector" className="border rounded p-1">
          <option value="today">Today</option>
          <option value="thisWeek">This week</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );
};

export default ObjectDetailHeader;
