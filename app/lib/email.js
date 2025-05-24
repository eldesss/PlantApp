import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifica tu email - PlantApp',
    html: `
      <h1>Bienvenido a PlantApp</h1>
      <p>Por favor, verifica tu email haciendo clic en el siguiente enlace:</p>
      <a href="${verificationUrl}">Verificar Email</a>
      <p>Si no has creado una cuenta en PlantApp, puedes ignorar este mensaje.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
} 