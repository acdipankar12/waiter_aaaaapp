import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    foodSection: {
        marginVertical: 12,
        gap: 0
    },
    foodsbox: {
        alignItems: "center",
        gap: 10
    },
    cartFloat: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#0102FD",
        right: "5%",
        bottom: "5%",
        alignItems: "center",
        justifyContent: "center"
    },
    cartcount: {
        position: "absolute",
        top: -8,
        left: 0,
        borderRadius: 15,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#cccccc",
        alignItems: "center",
        justifyContent: "center",
        height: 30,
        width: 30
    }

})