import React, { useState } from 'react';
import { CSVReader } from 'react-papaparse';
import { Modal, Button, Input } from 'antd';

const ActionMenu = ({ onAddNew, onAddMore, onExportCSV, onSearch }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCSVModalVisible, setIsCSVModalVisible] = useState(false);
  const [newTrailblazer, setNewTrailblazer] = useState({ firstName: '', lastName: '', profileUrl: '' });

  const handleAddNew = () => {
    onAddNew(newTrailblazer);
    setIsModalVisible(false);
    setNewTrailblazer({ firstName: '', lastName: '', profileUrl: '' });
  };

  const handleAddMore = (data) => {
    onAddMore(data);
    setIsCSVModalVisible(false);
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
        <CSVReader
          onDrop={handleAddMore}
          onError={(err) => console.error(err)}
          addRemoveButton
          removeButtonColor='#659cef'
        >
          <span>Drop CSV file here or click to upload.</span>
        </CSVReader>
      </Modal>
    </div>
  );
};

export default ActionMenu;
