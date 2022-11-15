import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import useColorManagementForm from "./ColorManagementForm";

const AddSelectColor = ({ fulfillmentSelected, refetch, productBase }) => {
  const [viewForm, setViewForm] = useState(false);
  const [formColor, { form, loading }] = useColorManagementForm({
    setViewForm,
    refetch,
    fulfillmentSelected,
    productBase,
  });
  return (
    <div>
      <Button
        onClick={() => setViewForm(true)}
        icon={<FaPlusCircle className="anticon custom-icon" />}
      >
        Add color
      </Button>
      <Modal
        title="Add color"
        visible={viewForm}
        onCancel={() => setViewForm(false)}
        footer={
          <div>
            <Button onClick={() => setViewForm(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              form="formColor"
              loading={loading}
            >
              Save
            </Button>
          </div>
        }
      >
        {formColor}
      </Modal>
    </div>
  );
};

export default AddSelectColor;
