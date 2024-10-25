import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Select,
  Card,
  Tooltip,
} from "antd";
import { PlusOutlined, ExportOutlined } from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import axiosInstance from "../../Services/AxiosInstance";

const { Option } = Select;

const HobbiesTable = () => {
  const [loading, setLoading] = useState(false);
  const [hobbies, setHobbies] = useState([]);
  const [filteredhobbies, setFilteredhobbies] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      const response = await axiosInstance.get("/master/hobbies");
      setHobbies(response.data.data.results);
      setFilteredhobbies(response.data.data.results);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch records");
    }
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(hobbies);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "hobbies");
    XLSX.writeFile(wb, `hobbies.xlsx`);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    const filteredData = hobbies.filter((item) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredhobbies(filteredData);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hobby Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Card title="Hobbies List">
      <Space style={{ marginBottom: 16 }}>
        {/* <Button icon={<PlusOutlined />} onClick={handleAdd}>
          Add New Hobby
        </Button> */}
        <Input
          placeholder="Search Hobby"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Button icon={<ExportOutlined />} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredhobbies}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
};

export default HobbiesTable;
