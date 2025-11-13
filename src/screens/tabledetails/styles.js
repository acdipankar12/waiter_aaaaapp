import { StyleSheet } from "react-native";


export const tableDetailstyles = StyleSheet.create({
    tableWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 14
    },
    tableBox: {
        borderColor: "#cccccc",
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: "space-between",
        backgroundColor: "#0102FD",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    headleft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    },
    headtext1: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Jost-Medium",
        fontWeight:'500'
    },
    headtext2: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Jost-Medium",
        fontWeight:'500'
    },
    fooditem: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        gap: 10,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1
    },
    itemhead: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    itemheadwrap: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center"
    },
    itemname: {
        fontSize: 14,
        fontFamily: "Jost_600SemiBold"
    },
    itemprice: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        color: "#0102FDBB",
        fontWeight:'600'
    },
    itemdesc: {
        fontSize: 14,
        fontFamily: "Jost-Regular",
        fontWeight:'400'
    },
    spicy: {
        gap: 4
    },
    choose: {
        gap: 4
    },
    buttWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopColor: "#cccccc",
        borderTopWidth: 1,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    buttOne: {
        width: "97%",
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#333333",
        alignItems: "center"
    },
    buttTwo: {
        width: "97%",
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: "#08D61D",
        alignItems: "center"
    },
    totals: {
        gap: 6,
        marginBottom: 30
    },
    firstrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginTop: 8,
        marginBottom: 13
    },
    secondrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        paddingBottom: 5,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1
    },
    thirdrow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 6,
        marginTop: 8,
        marginBottom: 13
    },
    textl: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    },
    texto: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        color: "#888888",
        fontWeight:'600'
    },
    totalprice: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        color: "#0102FDBB",
        fontWeight:'600'
    },
    pay: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    },
    cash: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        color: "#888888",
        fontWeight:'600'
    },
    payment: {
        marginVertical: 30,
        gap: 8
    },
    paymenttext: {
        fontSize: 14,
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    },
    payoption: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#cccccc",
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: "center",
        gap: 8,
        borderRadius: 8,
        backgroundColor: "#FBF6F6"
    },
    payoptext: {
        fontSize: 14,
        fontFamily: "Jost-Regular",
        color: "#5A5A5A",
        fontWeight:'400'
    }

})