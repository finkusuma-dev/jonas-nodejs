import nodemailer from 'nodemailer';

export default async (options: any) => {  
  
  /// 1) Create email transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {      
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASSWORD as string
    }
  });

  /// 2) Define email options
  const mailOptions = {
    from: "Natours admin <admin@natours.com>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    // html:
  }

  // console.log('mailOptions:', mailOptions);

  /// 3) Send email  
  return await transporter.sendMail(mailOptions);



}