import React, { useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import { Modal, Button, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ActionMenu = ({ onAddNew, onAddMore, onExportCSV, onSearch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCSVModalVisible, setIsCSVModalVisible] = useState(false);
  const [newTrailblazer, setNewTrailblazer] = useState({ firstName: '', lastName: '', profileUrl: '' });

  const { readString } = usePapaParse();

  const handleAddNew = () => {
    onAddNew(newTrailblazer);
    setIsModalVisible(false);
    setNewTrailblazer({ firstName: '', lastName: '', profileUrl: '' });
  };

  const handleCSVUpload = (info) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target.result;
      readString(csvData, {
        header: true,
        complete: (results) => {
          onAddMore(results.data);
          setIsCSVModalVisible(false);
        },
        error: (error) => {
          message.error('Error reading CSV file: ' + error.message);
        },
      });
    };
    reader.readAsText(info.file);
  };

  return (
    <div className="action-menu">
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Add New</Button>
      <Button type="primary" onClick={() => setIsCSVModalVisible(true)}>Add More</Button>
      <Button type="primary" onClick={onExportCSV}>Export All to CSV</Button>
      <Input.Search placeholder="Search Trailblazer" onSearch={onSearch} style={{ width: 200 }} />

      <Modal title="Add New Trailblazer" visible={isModalVisible} onOk={handleAddNew} onCancel={() => setIsModalVisible(false)}>
        <Input placeholder="First Name" value={newTrailblazer.firstName} onChange={(e) => setNewTrailblazer({ ...newTrailblazer, firstName: e.target.value })} />
        <Input placeholder="Last Name" value={newTrailblazer.lastName} onChange={(e) => setNewTrailblazer({ ...newTrailblazer, lastName: e.target.value })} />
        <Input placeholder="Profile URL" value={newTrailblazer.profileUrl} onChange={(e) => setNewTrailblazer({ ...newTrailblazer, profileUrl: e.target.value })} />
      </Modal>

      <Modal title="Add More Trailblazers" visible={isCSVModalVisible} onCancel={() => setIsCSVModalVisible(false)} footer={null}>
        <Upload accept=".csv" showUploadList={false} beforeUpload={(file) => { handleCSVUpload({ file }); return false; }}>
          <Button icon={<UploadOutlined />}>Upload CSV</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default ActionMenu;
