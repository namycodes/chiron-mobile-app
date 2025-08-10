import { grayLightBorder } from "@/constants/Colors";
import { View } from "react-native";

export default function Divider() {
    return <View style={{borderColor: grayLightBorder, borderBottomWidth: 1, paddingVertical: 5}} />
}