import { containerPresententer } from "utils/HoC";
import Container from "./Container"
import Presententer from "./Presententer"
/**
 * 　を表示するコンポーネントです。
 * @param {object} props プロパティ
 */
const CollectScheduleDrawer = containerPresententer(Container, Presententer)

export default CollectScheduleDrawer