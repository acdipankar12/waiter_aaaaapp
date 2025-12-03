import { StyleSheet } from "react-native";

export const addFoodStyles = StyleSheet.create({
    modalWrapper: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        position: "absolute",
        // backgroundColor: "#000000B2",
        // zIndex: 1
    },
    descriptionSkeleton: {
        width: 120,
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
        flexShrink: 1,
        maxWidth: '100%',
    },
    addbox: {
        width: "85%",
        paddingHorizontal: 14,
        paddingVertical: 20,
        backgroundColor: "#fff",
        top: "10%",
        borderRadius: 20
    },
    head: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9
    },
    headname: {
        fontSize: 20
    },
    price: {
        fontWeight: 700,
        color: "#08D61D"
    },
    spicytext: {
        color: "#0102FD",
        fontWeight: 700,
        marginBottom: 8
    },
    spicyCheckBox: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-around",
        gap: 40,
        flexWrap: "wrap",
        marginBottom: 10
    },
    checkBoxitems: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    checkbox: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderColor: "#0102FD",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    checkboxselect: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderColor: "#0102FD",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0102FD"
    },
    checkboxname: {
        fontSize: 13
    },
    choose: {
        color: "#0102FD",
        fontWeight: 700,
        marginBottom: 8
    },
    itemCheckBox: {
        // alignItems: "center",
        // justifyContent: "space-around",
        gap: 14,
        flexWrap: "wrap",
        marginTop: 18,
        marginBottom: 10
    },
    checkBoxitems2: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    checkbox2: {
        height: 20,
        width: 20,
        borderColor: "#0102FD",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxselect2: {
        height: 20,
        width: 20,
        borderColor: "#0102FD",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0102FD"
    },
    checkboxname2: {
        fontSize: 13
    },
    addcomment: {
        // height: 120,
        height: 90,
        textAlignVertical: 'top',
        paddingVertical: 20,
        alignItems: "baseline",
        paddingHorizontal: 10,
        borderColor: "#CCCCCC",
        borderWidth: 1,
        marginVertical: 12,
        borderRadius: 10,
        color: "#888"
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    add: {
        paddingHorizontal: 13,
        paddingVertical: 5,
        backgroundColor: "#0102FD",
        borderRadius: 6
    }
}) 