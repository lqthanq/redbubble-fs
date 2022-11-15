import { containerPresententer } from "utils/HoC";
import Container from "./Container"
import Presententer from "./Presententer"
/**
 * ドラワーを表示するコンポーネントです。
 * @param {object} props プロパティ
 * @param {object} childer 
 * @param {String} titleDrawer プロパティ
 */
const DrawerOnRight = containerPresententer(Container, Presententer)

export default DrawerOnRight