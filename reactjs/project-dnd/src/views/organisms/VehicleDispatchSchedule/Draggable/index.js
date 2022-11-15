import { containerPresententer } from "utils/HoC";
import Container from "./Container";
import Presententer from "./Presententer";
const Draggable = containerPresententer(Container, Presententer);

export default Draggable;
