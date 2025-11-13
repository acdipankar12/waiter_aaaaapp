import { StyleSheet } from "react-native";

export const orderListstyles = StyleSheet.create({
    orderWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 20
    },
    orderBox: {
        borderColor: "#cccccc",
        borderWidth: 1,
        padding: 8,
        borderRadius: 10,
        backgroundColor: "#F8FFFC",
        gap: 13
    },
    head: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    headtiming: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    second: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    butt: {
        backgroundColor: "#000",
        alignSelf: "baseline",
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8
    },
    butttext: {
        color: "#fff",
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    }

})
