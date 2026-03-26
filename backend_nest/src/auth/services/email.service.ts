import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
        port: parseInt(this.configService.get<string>('SMTP_PORT') || '587'),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true', // true for 465, false for other ports
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
        tls: {
          // No fallar en certificados no confiables
          rejectUnauthorized: false,
        },
      });

      // Verificar conexión
      this.transporter.verify((error, success) => {
        if (error) {
          this.logger.error('Error al verificar conexión SMTP:', error);
        } else {
          this.logger.log('Servidor SMTP está listo para enviar correos');
        }
      });
    } catch (error) {
      this.logger.error('Error al inicializar transporter de Nodemailer:', error);
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const emailFrom = this.configService.get<string>('EMAIL_FROM') || smtpUser;
      const emailFromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Ecommerce App';
      
      const mailOptions = {
        from: `"${emailFromName}" <${emailFrom}>`,
        to: email,
        subject: '🔑 Restablecimiento de Contraseña - Ecommerce App',
        html: this.generatePasswordResetTemplate(resetUrl, token),
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Correo de restablecimiento enviado a ${email}: ${info.messageId}`);
      
      // Para desarrollo: mostrar preview del correo
      if (this.configService.get<string>('NODE_ENV') === 'development') {
        console.log('📧 Preview del correo enviado:');
        console.log(`Para: ${email}`);
        console.log(`Asunto: ${mailOptions.subject}`);
        console.log(`URL de restablecimiento: ${resetUrl}`);
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
    } catch (error) {
      this.logger.error('Error al enviar correo de restablecimiento:', error);
      
      // En desarrollo, mostrar información de depuración
      if (this.configService.get<string>('NODE_ENV') === 'development') {
        console.log(`📧 Simulación de correo para ${email}:`);
        console.log(`Token: ${token}`);
        console.log(`URL: ${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/reset-password?token=${token}`);
      }
      
      throw new Error('No se pudo enviar el correo de restablecimiento');
    }
  }

  private generatePasswordResetTemplate(resetUrl: string, token: string): string {
    const logoUrl = this.configService.get<string>('LOGO_URL') || '';
    
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecimiento de Contraseña</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #007bff;
          }
          .logo {
            max-width: 150px;
            margin-bottom: 20px;
          }
          .title {
            color: #007bff;
            font-size: 28px;
            margin: 0;
          }
          .content {
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background-color: #0056b3;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .token-info {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo">` : ''}
            <h1 class="title">🔑 Restablecimiento de Contraseña</h1>
          </div>
          
          <div class="content">
            <p>Hola,</p>
            <p>Has solicitado restablecer tu contraseña en nuestra plataforma. Para continuar, haz clic en el siguiente botón:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este enlace expirará en <strong>1 hora</strong></li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
                <li>Nunca compartas este enlace con otras personas</li>
              </ul>
            </div>
            
            <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
            <div class="token-info">
              <a href="${resetUrl}" style="word-break: break-all;">${resetUrl}</a>
            </div>
            
            <p>También puedes usar el siguiente token directamente en la aplicación:</p>
            <div class="token-info">
              <strong>Token:</strong> ${token}
            </div>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Ecommerce App. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Método para enviar correos genéricos (útil para otras funcionalidades)
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const emailFrom = this.configService.get<string>('EMAIL_FROM') || smtpUser;
      const emailFromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Ecommerce App';
      
      const mailOptions = {
        from: `"${emailFromName}" <${emailFrom}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Correo enviado a ${to}: ${subject}`);
    } catch (error) {
      this.logger.error('Error al enviar correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  }
}
