import { containerPresententer } from "utils/HoC";
import Container from "./Container"
import Presententer from "./Presententer"
/**
 * 配車計画フォームを表示するコンポーネントです。
 * @param {object} props プロパティ
 */
const VehicleDispatchScheduleForm = containerPresententer(Container, Presententer)

export default VehicleDispatchScheduleForm