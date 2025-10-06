"use client";
import { useEffect, useState } from "react";
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { useParams } from "next/navigation";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function InvestigationDetail() {
  const { id } = useParams(); // Lấy id từ dynamic route
  const [data, setData] = useState<any>([]);
  const { mutation } = usePostApi(API_URL.INVESTIGATION_PAGE.EVENTS, true);

  useEffect(() => {
    mutation.mutate(
      { filter_id: id },
      {
        onSuccess: (response: any) => {
          if (response?.data) {
            console.log(response?.data);
            setData(response.data.events); // Gán dữ liệu trả về vào state
          }
        },
      }
    );
  }, [id]);

  // Define the column definitions for ag-Grid
  const columnDefs = [
    { headerName: "Event ID", field: "event_id", sortable: true, filter: true },
    {
      headerName: "Alert Time",
      field: "alert_time",
      sortable: true,
      filter: true,
    },
    { headerName: "IP Address", field: "ip", sortable: true, filter: true },
    { headerName: "MAC Address", field: "mac", sortable: true, filter: true },
    {
      headerName: "Alert Type",
      field: "alert_type",
      sortable: true,
      filter: true,
    },
    {
      headerName: "MITRE Technique",
      field: "mitre_technique",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={data} // Bind your data to the grid
        columnDefs={columnDefs} // Define columns
        pagination={true} // Enable pagination
        domLayout="autoHeight" // Auto adjust height
      />
    </div>
  );
}
