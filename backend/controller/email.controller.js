import transporter from "../config/email/emailConfig.js";
import { fileURLToPath } from "url";
import path from "path";
import ejs from "ejs";

// Configuring routes for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailController {
  /**
   * Send an email using the provided options.
   * @param {Object} options - { to, subject, template, data, attachments }
   */
  static async sendEmail(options) {
    try {
      const { to, subject, template, data, attachments } = options;

      // Render template if provided
      const html = template
        ? await ejs.renderFile(
            path.join(__dirname, `../views/email/${template}.ejs`),
            data
          )
        : options.html;
      const mailOptions = {
        from: `My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: html || "<p>Email sended successfully!</p>",
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Sent succecfully :", info.messageId);
      return info;
    } catch (error) {
      console.error("Error in sendEmail:", error);
      throw new Error("Failed to send email");
    }
  }

  // Methods for specific email types
  static async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Bienvenido a My App",
      template: "welcome-email",
      data: {
        title: "¡Bienvenido!",
        message: "Gracias por registrarte en nuestra plataforma.",
        name: user.username || user.name || user.email,
      },
    });
  }

  static async sendTaskCreatedEmail(user, task) {
    return this.sendEmail({
      to: user.email,
      subject: "Nueva tarea creada",
      template: "welcome-email",
      data: {
        title: "Tarea creada exitosamente",
        message: `Se ha creado la tarea: <b>${task.title}</b>`,
        name: user.username || user.name || user.email,
        extra: task.description || '',
      },
    });
  }

  static async sendLoginEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Inicio de sesión exitoso",
      template: "welcome-email",
      data: {
        title: "¡Has iniciado sesión!",
        message: "Has accedido correctamente a tu cuenta.",
        name: user.username || user.name || user.email,
      },
    });
  }

  // Method to send password reset email
  static async sendPasswordReset(user, resetLink) {
    return this.sendEmail({
      to: user.email,
      subject: "Change Password",
      template: "reset-password",
      data: { name: user.name, resetLink },
    });
  }
}

export default EmailController;
