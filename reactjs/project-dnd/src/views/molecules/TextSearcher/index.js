import { containerPresententer } from "utils/HoC";
import Container from "./Container"
import Presententer from "./Presententer"
/**
 * 　フリーワード検索を表示するコンポーネントです。
 * @param {object} props プロパティ
 */
const TextSearcher = containerPresententer(Container, Presententer)

export default TextSearcher