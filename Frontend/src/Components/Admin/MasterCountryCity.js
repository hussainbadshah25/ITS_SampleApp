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

const CountryCityTable = () => {
  const [loading, setLoading] = useState(false);
  //   const [modalVisible, setModalVisible] = useState(false);
  //   const [form] = Form.useForm();
  //   const [editingRecord, setEditingRecord] = useState(null);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetchCountriesCities();
  }, []);

  const fetchCountriesCities = async () => {
    try {
      const response = await axiosInstance.get("/master/countriesCities");
      setCountries(response.data.data.results);
      setFilteredCountries(response.data.data.results);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch records");
    }
  };
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(countries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "cities");
    XLSX.writeFile(wb, `cities.xlsx`);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);

    const filteredData = countries.filter((item) => {
      return (
        item.Country_Name.toLowerCase().includes(value.toLowerCase()) ||
        item.City_Name.toLowerCase().includes(value.toLowerCase()) ||
        item.code.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredCountries(filteredData);
  };

  const columns = [
    {
      title: "Country",
      dataIndex: "Country_Name",
      key: "Country_Name",
    },
    {
      title: "Country Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "City Name",
      dataIndex: "City_Name",
      key: "City_Name",
    },
  ];

  return (
    <Card title="Country Cities List">
      <Space style={{ marginBottom: 16 }}>
        {/* <Button icon={<PlusOutlined />} onClick={handleAdd}>
          Add New City
        </Button> */}
        <Input
          placeholder="Search Country or City"
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Button icon={<ExportOutlined />} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Space>

      {/* <Select
        placeholder="Select Country"
        onChange={setSelectedCountry}
        style={{ marginBottom: 16, width: 200 }}
      >
        {countries.map((country) => (
          <Option key={country.id} value={country.id}>
            {country.name}
          </Option>
        ))}
      </Select> */}

      <Table
        columns={columns}
        dataSource={filteredCountries}
        rowKey="id"
        loading={loading}
      />

      {/* <Modal
        title={editingRecord ? "Edit City" : "Add City"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="City Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="countryId"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select>
              {countries.map((country) => (
                <Option key={country.id} value={country.id}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}
    </Card>
  );
};

export default CountryCityTable;
