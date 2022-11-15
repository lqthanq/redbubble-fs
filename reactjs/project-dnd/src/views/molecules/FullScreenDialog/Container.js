import { stylesCreator } from "./styles";

export const Container = ({
  render,
  open,
  textConfirm,
  title,
  onClickSubmit,
  onClose,
  children,
  disabled,
  action,
  isSubmit,
}) => {
  const classes = stylesCreator();
  const onSubmit = () => {
    onClickSubmit && onClickSubmit();
  };
  return render({
    classes: classes,
    open: open,
    onClose: onClose,
    onSubmit: onSubmit,
    textConfirm: textConfirm,
    title: title,
    action: action,
    isSubmit: isSubmit,
    disabled: disabled,
    children: children,
  });
};
