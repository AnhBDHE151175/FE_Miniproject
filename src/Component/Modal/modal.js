import { Button, Modal } from "antd";
import { useState } from "react";

const OpenModal = ({ children, title, tag }) => {
  const Component = tag;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Component type="primary" onClick={showModal}>
        {title}
      </Component>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {children}
      </Modal>
    </>
  );
};

export default OpenModal;
