const nodemailer = require("nodemailer");

module.exports = {
    send: async (receiver, title, detail) => {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'boncaumauhuong@gmail.com',
                pass: 'bon.cau.mau.huong'
            }
        });
        let info = await transporter.sendMail({
            from: 'boncaumauhuong@gmail.com',
            to: receiver,
            subject: title,
            text: detail,
            html: ""
        });
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}
