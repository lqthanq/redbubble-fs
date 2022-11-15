import { containerPresententer } from "utils/HoC";
import Container from "./Container";
import Presententer from "./Presententer";
const AuthenticatedTemplate = containerPresententer(Container, Presententer);
export default AuthenticatedTemplate;
