const nodemailer = require("nodemailer");
const userdb = require('../../models/user') ;

module.exports.resetPassword = async (req , res) => {

    console.log(req.body)  ; 
    // return res.status(200).json({
    //   data : {
    //      success : true 
    //   }
    // }) ; 
    let email = req.body.email ; 
    let otp = Math.floor(Math.random() * 5000) + 1000  ; 

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'reyanshdeo54@gmail.com', // generated ethereal user
            pass: 'Reyansh@123rd', // generated ethereal password
        },
      });
    let info = await transporter.sendMail({
        from: '"Educamp" <reyanshdeo54@gmail.com>', // sender address
        to:    `${email}`, // list of receivers
        subject: "Password Reset", // Subject line
        text: `Your one time password is ${otp}`, // plain text body
      });

      return res.status(200).json ({
        data : {
          code : otp , 
          success : true 
        }
      })


      
}

module.exports.passwordUpdate  = async (req , res) => {
   console.log("Updating the password") ;
   let user = await userdb.findOne({email : req.body.emailId}) ;
   user.password = req.body.password ;
   await user.save() ; 

   return res.status(200).json({
     data : {
       success : true  , 
       message : "Updating password"
     }
   })
}


async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'reyanshdeo54@gmail.com', // generated ethereal user
        pass: 'Reyansh@123rd', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Educamp" <reyanshdeo54@gmail.com>', // sender address
    to: "anuranjan8319918906@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  console.log("Info is : " , info) ;
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//main().catch("The error is :- " , console.error);

