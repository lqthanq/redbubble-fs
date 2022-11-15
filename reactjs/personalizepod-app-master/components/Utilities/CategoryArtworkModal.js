import { Button, Modal, notification, Form } from "antd";
import CategoryForm from "./CategoryForm";
import createArtworkCategory from "../../graphql/mutate/createArtworkCategory";
import updateArtworkCategory from "../../graphql/mutate/updateArtworkCategory";
import { useMutation } from "@apollo/client";
import { get } from "lodash";
import { messageSave } from "./message";
import { useAppValue } from "context";

const CategoryArtworkModal = ({
  showAddNewTo,
  visible,
  title,
  setShowAddNew,
  showRename,
  setShowRename,
  showAddNew,
  categories,
}) => {
  const [form] = Form.useForm();
  const [{ sellerId }] = useAppValue();
  const [CreateArtworkCategory, { loading }] = useMutation(
    createArtworkCategory
  );
  const [UpdateArtworkCategory, { loading: updateLoading }] = useMutation(
    updateArtworkCategory
  );
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (showAddNew === true) {
          form.resetFields();
          CreateArtworkCategory({
            variables: {
              ...values,
              sellerId,
            },
          })
            .then((res) => {
              if (res) {
                messageSave("Category");
                setShowAddNew(false);
              }
            })
            .catch((err) => {
              notification.error({ message: err.message });
            });
        }
        if (showRename !== null) {
          form.resetFields();
          UpdateArtworkCategory({
            variables: {
              ...values,
              id: get(showRename, "id", null),
            },
          })
            .then((res) => {
              if (res) {
                messageSave("Category");
                setShowRename(null);
              }
            })
            .catch((err) => {
              get(err, notification.error({ message: err.message }), null);
            });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <div>
      <Modal
        className="p-modal-form-category"
        visible={visible}
        title={title}
        onCancel={() => {
          setShowAddNew(false);
          setShowRename(null);
          form.resetFields();
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setShowAddNew(false);
              setShowRename(null);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading || updateLoading}
            onClick={(e) => onSubmit(e)}
          >
            Save
          </Button>,
        ]}
      >
        {visible && (
          <CategoryForm
            categories={categories}
            id={showRename && showRename.id}
            key={showRename && showRename.id}
            form={form}
            showAddNewTo={showAddNewTo}
            showRename={showRename}
            onSubmit={() => onSubmit()}
          />
        )}
      </Modal>
    </div>
  );
};

export default CategoryArtworkModal;
