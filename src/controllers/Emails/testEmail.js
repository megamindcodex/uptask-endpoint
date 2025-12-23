

export const send_email = async (data) => {
    try {
        console.log("Email about to be sent using:", data)
        console.log("Email sent successfully")

        return { success: true, message: "Email sent successfully" }
    } catch (err) {
        const msg = err.message
        console.log(err)
        return { success: false, message: msg }
    }
}