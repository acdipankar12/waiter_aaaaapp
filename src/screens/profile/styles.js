import { StyleSheet } from "react-native";

export const profilestyles = StyleSheet.create({
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },

    backbutt: {
        position: 'absolute',
        left: 1,
        top: 18, // vertically center if header is ~60
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    acctext: {
        fontSize: 18,
        fontFamily: "Jost-SemiBold",
        fontWeight:'600'
    },
    profilebody: {
        gap: 15,
        alignItems: 'center',
        justifyContent: "center"
    },
    imagewrap: {
        alignSelf: "center",
        position: "relative",
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#0102FD"
    },
    cam: {
        position: "absolute",
        zIndex: 1,
        right: 10,
        bottom: "-10%",
        padding: 8,
        backgroundColor: "#0102FD",
        borderRadius: 20
    },
    proftext: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: "Jost-Medium",
        color: "#A0A0A0",
        fontWeight:'500'
    },
    inputs: {
        gap: 10,
        width: "100%"
    },
    input: {
        paddingVertical: 8,
        paddingHorizontal: 7,
        borderWidth: 1,
        borderColor: "#B8B8B8",
        borderRadius: 10,
        position: "relative"  ,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputtext: {
        color: "#B8B8B8",
        fontFamily: "Jost-Regular",
        fontSize: 16,
        fontWeight:'400'
    },
    inputtext2: {
        color: "#B8B8B8",
        fontFamily: "Jost-Regular",
        fontSize: 16,
        width: "80%",
        fontWeight:"400"
    },
    eye: {

    },
    buttsec: {
        marginTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    butt1: {
        width: "46%",
        paddingVertical: 13,
        borderWidth: 1,
        borderColor: "#75EABA",
        alignItems: "center",
        borderRadius: 8
    },
    butt2: {
        width: "46%",
        paddingVertical: 13,
        alignItems: "center",
        borderRadius: 8,
        backgroundColor: "#000"
    }

})
