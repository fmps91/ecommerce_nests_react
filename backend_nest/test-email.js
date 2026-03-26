const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🧪 Probando configuración de Gmail...');
  
  try {
    // Crear transporter con tu configuración
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'zobywvfeafjqjwhy@gmail.com',
        pass: 'zobywvfeafjqjwhy', // Contraseña de aplicación sin espacios
      },
      tls: {
        rejectUnauthorized: false, // Para desarrollo
      },
    });

    console.log('✅ Transporter creado');
    
    // Verificar conexión
    console.log('🔍 Verificando conexión...');
    await transporter.verify();
    console.log('✅ Conexión SMTP verificada exitosamente');
    
    // Enviar correo de prueba
    console.log('📧 Enviando correo de prueba...');
    const info = await transporter.sendMail({
      from: '"Ecommerce App" <zobywvfeafjqjwhy@gmail.com>',
      to: 'zobywvfeafjqjwhy@gmail.com', // Enviarlo a ti mismo para probar
      subject: '🧪 Prueba de Configuración SMTP',
      html: `
        <h2>✅ Configuración SMTP Funciona!</h2>
        <p>Este es un correo de prueba para verificar que la configuración de Nodemailer con Gmail está funcionando correctamente.</p>
        <p><strong>Detalles:</strong></p>
        <ul>
          <li>SMTP: smtp.gmail.com:587</li>
          <li>Usuario: zobywvfeafjqjwhy@gmail.com</li>
          <li>Fecha: ${new Date().toLocaleString()}</li>
        </ul>
        <p>Si recibes este correo, la configuración es correcta y puedes usar la funcionalidad de olvide contraseña.</p>
      `,
    });
    
    console.log('✅ Correo enviado exitosamente!');
    console.log('📬 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    
  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Soluciones posibles:');
      console.log('1. Verifica que la contraseña de aplicación sea correcta');
      console.log('2. Asegúrate de haber activado "Acceso a apps menos seguras" en tu cuenta Google');
      console.log('3. Revisa que la contraseña de aplicación esté generada correctamente');
    }
    
    if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Soluciones posibles:');
      console.log('1. Verifica tu conexión a internet');
      console.log('2. Confirma que el puerto 587 no esté bloqueado');
    }
  }
}

testEmailConfig();
