import React, { useRef } from 'react';
import Papa from 'papaparse';
import { Input, Button, Modal, Form } from 'antd';
import './ActionMenu.css';

const { Search } = Input;

const ActionMenu = ({ onAddNew, onAddMore, onExportCSV, onSearch }) => {
  const fileInputRef = useRef();

  const handleAddNew = () => {
    Modal.confirm({
      title: 'Add New Trailblazer',
      content: (
        <Form layout="vertical" onFinish={onAddNew}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="profileUrl" label="Profile URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      ),
      onOk() {
        document.querySelector('.ant-form').dispatchEvent(new Event('submit', { cancelable: true }));
      },
    });
  };

  const handleAddMore = () => {
    fileInputRef.current.click();
  };

  const handleFileLoad = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        onAddMore(results.data);
      },
    });
  };

  return (
    <div className="slds-box slds-theme_shade slds-p-around_medium action-menu">
      <div className="slds-grid slds-wrap slds-gutters">
        <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-4 slds-p-around_small">
          <Button type="primary" onClick={handleAddNew} className="slds-m-right_small">Add New</Button>
        </div>
        <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-4 slds-p-around_small">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileLoad}
          />
          <Button type="primary" onClick={handleAddMore} className="slds-m-right_small">Add More</Button>
        </div>
        <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-4 slds-p-around_small">
          <Button type="primary" onClick={onExportCSV} className="slds-m-right_small">Export All to CSV</Button>
        </div>
        <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-4 slds-p-around_small">
          <Search
            placeholder="Search Trailblazer"
            onSearch={onSearch}
            enterButton
            className="slds-m-left_small"
          />
        </div>
      </div>
    </div>
  );
};

export default ActionMenu;
