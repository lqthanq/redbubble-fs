import { containerPresententer, withForwardRef } from "utils/HoC";
import Container from "./Container"
import Presententer from "./Presententer"
/**
 * 　を表示するコンポーネントです。
 * @param {object} props プロパティ
 */
const VehicleDispatches = withForwardRef(containerPresententer(Container, Presententer))

export default VehicleDispatches