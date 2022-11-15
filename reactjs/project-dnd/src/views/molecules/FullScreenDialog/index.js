import { containerPresententer } from "utils/HoC";
import { Container } from "./Container";
import { Presententer } from "./Presententer";

/**
 * @param {boolean} open ダイアログを開閉するイベントです。
 * @param {string} textConfirm submitボタンのテキストです。
 * @param {string} title ダイアログのタイトル
 * @param {func} onClickSubmit submitボタンをクリックする時のイベントです。
 * @param {func} onClose ダイアログを閉じるイベントです。
 * @callback children ダイアログの内容
 *
 */

const FullScreenDialog = containerPresententer(Container, Presententer);
FullScreenDialog.defaultProps = {
  open: true,
  textConfirm: "登録",
  title: "新しいの追加",
  onClose: () => {},
};
export default FullScreenDialog;
