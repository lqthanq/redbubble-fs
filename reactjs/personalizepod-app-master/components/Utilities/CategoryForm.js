import { Form, Input, TreeSelect } from "antd";
import { cloneDeep, get } from "lodash";
import { useEffect } from "react";
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const CategoryForm = ({
  showAddNewTo,
  form,
  showRename,
  onSubmit,
  categories,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      title: showRename ? showRename.title : "",
      parentID: get(showAddNewTo, "id", null),
    });
  }, [showRename, showAddNewTo]);

  const getTreeData = (treeData) => {
    if (!treeData) {
      return null;
    }
    treeData.map((cat) => {
      let newCat = cloneDeep(cat);
      newCat.key = cat.id;
      newCat.value = cat.id;
      newCat.title = cat.title;
      newCat.children = getTreeData(cat.children);
      return newCat;
    });
    return treeData;
  };

  return (
    <Form {...formLayout} form={form} onFinish={(values) => onSubmit()}>
      {showAddNewTo ? (
        <Form.Item
          label="Parent"
          name="parentID"
          initialValue={get(showAddNewTo, "id", null)}
        >
          <TreeSelect
            showSearch
            disabled
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={getTreeData(categories)}
            placeholder="Select a parent category"
            treeDefaultExpandAll
          />
        </Form.Item>
      ) : showRename ? (
        <Form.Item label="Parent" name="parentID">
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={getTreeData(categories)}
            placeholder="Select a parent category"
            treeDefaultExpandAll
          />
        </Form.Item>
      ) : null}
      <Form.Item
        initialValue={showRename ? showRename.title : ""}
        rules={[{ required: true, message: "Please input title!" }]}
        label="Title"
        name="title"
      >
        <Input onPressEnter={() => form.submit()} placeholder="Title" />
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
