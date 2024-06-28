import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "../../app"; // Adjust the path accordingly
import { expo as appName } from "../../app.json";

AppRegistry.registerComponent(appName.name, () => App);
