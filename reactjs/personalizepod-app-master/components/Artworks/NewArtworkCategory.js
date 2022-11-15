import { Input, Divider, Tree, Form } from "antd";
import CategoryForm from "components/Utilities/CategoryForm";
import { useState, useEffect } from "react";
const NewArtworkCategory = (props) => {
  const { tree, data, submit, onSubmit, onError } = props;
  const [selected, setSelected] = useState([]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (submit) {
      form
        .validateFields()
        .then((values) => {
          values.parentID = selected.length ? selected[0] : null;
          onSubmit(values);
        })
        .catch(() => onError());
    }
  }, [submit]);
  return (
    <div>
      <CategoryForm form={form} />
      <Divider />
      <Tree
        treeData={tree(data)}
        multiple={false}
        showIcon={false}
        // selectedKeys={[]}
        showLine={{ showLeafIcon: false }}
        onSelect={(id) => setSelected(id)}
      />
    </div>
  );
};

export default NewArtworkCategory;
