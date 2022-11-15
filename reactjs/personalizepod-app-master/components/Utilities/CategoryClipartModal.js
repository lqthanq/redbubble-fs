import { Button, Modal, notification, Form } from "antd";
import CategoryForm from "./CategoryForm";
import updateClipartCategory from "../../graphql/mutate/updateClipartCategory";
import { useMutation } from "@apollo/client";
import { get } from "lodash";
import createClipartCategoryMutation from "../../graphql/mutate/createClipartCategory";
import { messageSave } from "./message";

const CategoryClipartModal = ({
  showAddNewTo,
  visible,
  title,
  setShowAddNew,
  showRename,
  setShowRename,
  showAddNew,
  categories,
  refetch,
}) => {
  const [form] = Form.useForm();
  const [UpdateClipartCategory, { loading: updateLoading }] = useMutation(
    updateClipartCategory
  );
  const [CreateClipartCategory, { loading }] = useMutation(
    createClipartCategoryMutation
  );
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (showAddNew === true) {
          form.resetFields();
          CreateClipartCategory({
            variables: {
              ...values,
              // parentID: get(showAddNewTo, "id", null),
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
          UpdateClipartCategory({
            variables: {
              ...values,
              id: get(showRename, "id", null),
            },
          })
            .then((res) => {
              if (res) {
                messageSave("Category");
                refetch();
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

export default CategoryClipartModal;
