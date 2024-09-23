import nodemailer from "nodemailer";



export const sendEmail=async(to ,subject , html)=>{
  

const transporter = nodemailer.createTransport({
  service:"gmail", // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "nadiaelassal90@gmail.com",
    pass: "bola tnid vmdl rqia",
  },
});


  const info = await transporter.sendMail({
    from: '"nebulax 👻" <nadiaelassal90@gmail.com>', // sender address
    to:to ? to:"omarayman3202@gmail.com", // list of receivers
    subject:subject ? subject: "Hello ✔", // Subject line
    html:html ? html: "<b>Hello world?</b>", // html body
  });
  if(info.accepted.length){
    return true
  }
  return false


}

