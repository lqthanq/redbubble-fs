import { useState } from "react";

/**
 * フリーワード検索を表示するコンポーネントです。
 * @param {func} onChangeSearch 検索値を渡すイベントです。
 * @returns
 */
const Container = ({ render, onChangeSearch, ...props }) => {
  const [value, setValue] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
    onChangeSearch && onChangeSearch(e.target.value);
  };
  //console.log("value-search: ", value);
  return render({
    value,
    onChange: handleChange,
    ...props,
  });
};
export default Container;
