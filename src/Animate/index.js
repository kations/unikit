import { Platform } from "react-native";

import Web from "./web";
import Native from "./native";

export default Platform.OS === "web" ? Web : Native;
