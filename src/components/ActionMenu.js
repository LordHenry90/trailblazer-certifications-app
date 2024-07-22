import React, { useRef } from 'react';
import { CSVReader } from 'react-papaparse';
import { Input, Button, Modal, Form } from 'antd';
import './ActionMenu.css';

const { Search } = Input;

const ActionMenu = ({ onAddNew, onAddMore, onExportCSV, onSearch }) => {
  const buttonRef = useRef();

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

  const handleAddMore = (data) => {
    onAddMore(data);
  };

  return (
    <div className="slds-box slds-theme_shade slds-p-around_medium action-menu">
      <div className="slds-grid slds-gutters">
        <div className="slds-col">
          <Button type="primary" onClick={handleAddNew} className="slds-m-right_small">Add New</Button>
        </div>
        <div className="slds-col">
          <CSVReader
            onFileLoad={handleAddMore}
          >
            {({ file }) => (
              <Button type="primary" onClick={() => buttonRef.current.open()} className="slds-m-right_small">
                Add More
              </Button>
            )}
          </CSVReader>
        </div>
        <div className="slds-col">
          <Button type="primary" onClick={onExportCSV} className="slds-m-right_small">Export All to CSV</Button>
        </div>
        <div className="slds-col slds-grow">
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
