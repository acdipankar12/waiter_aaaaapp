import { StyleSheet } from "react-native";

export const forgetEmailStyles = StyleSheet.create({
    forgetWrap: {
        alignItems: "center",
        marginTop: 80
    },
    head: {
        fontSize: 24,
        color: "#fff",
        fontFamily: "Jost-SemiBold",
        fontWeight:'600',
        marginBottom: 13
    },
    subhead: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Jost-Regular",
        fontWeight:'400',
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
    submit: {
        width: "80%",
        backgroundColor: "#000",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 40,
        gap: 8,
    },
    input: {
        fontFamily: "Jost-Regular",
        fontWeight:'400',
        width: "80%",
    },
    submittext: {
        color: "#fff",
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    }
})

export const forgetOtpStyles = StyleSheet.create({
    forgetWrap: {
        alignItems: "center",
        marginTop: 80
    },
    head: {
        fontSize: 24,
        color: "#fff",
        fontFamily: "Jost_600SemiBold",
        marginBottom: 13
    },
    subhead: {
        fontSize: 14,
        color: "#fff",
        fontFamily: "Jost_400Regular"
    },
    inputWrap: {
        width: "100%",
        alignItems: "center",
        gap: 18,
        marginVertical: 50
    },
    codeContainer: {
        marginTop: 40,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: '#fff',
        textAlign: 'center',
        marginHorizontal: 5,
        fontSize: 18,
        borderRadius: 10,
        color: '#000',
        backgroundColor: '#fff'
    },
    resendtext: {
        fontFamily: "Jost_400Regular",
        fontSize: 16,
        color: "#fff",
        marginBottom: 20
    }
})


export const forgetNewStyles = StyleSheet.create({
    inputBox: {
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 40,
        gap: 8,
    },
    input: {
        fontFamily: "Jost_400Regular",
        width: "80%",
    },
    warn: {
        alignSelf: "flex-start",
        color: "#fff",
        fontFamily: "Jost_400Regular",
    },
    submit: {
        width: "100%",
        backgroundColor: "#000",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderRadius: 40,
        gap: 8,
        marginTop: 10
    },
}) 