import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
    loginWrap: {
        alignItems: "center",
        marginTop: 80
    },
    head: {
        fontSize: 30,
        color: "#fff",
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    },
    subhead: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Jost-Medium",
        fontWeight:'500'
    },
    inputWrap: {
        width: "100%",
        alignItems: "center",
        gap: 18,
        marginVertical: 50
    },
    inputBox: {
        width: "80%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 40,
        gap: 8,
    },
    input: {
        fontFamily: "Jost-Regular",
        fontWeight:'400'
    },
    forget: {
        marginTop: 8,
        fontFamily: "Jost-SemiBold",
        color: "#fff",
        fontWeight:'600'
    },
    signin: {
        marginTop: 30,
        backgroundColor: "#000",
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    }
})