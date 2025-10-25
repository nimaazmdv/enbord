import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTestAccount, createTransport, getTestMessageUrl, Transporter } from "nodemailer";

import { render } from "@react-email/components";
import { OtpVerificationEmail } from "./templates/otp-verification-email";

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private readonly environment: "development" | "production";
  private readonly from: string;
  private transporter?: Transporter;

  constructor(private configService: ConfigService) {
    this.environment = this.configService.get("NODE_ENV", "development");
    this.from = this.configService.get("MAIL_FROM", "no-reply@example.com");
  }

  async onModuleInit() {
    // Configure a real transporter
  }

  async sendOtpVerificationEmail(to: string, otp: string) {
    const html = await render(<OtpVerificationEmail otp={otp} />);

    this.sendMail(to, "Verify your email address", html);
  }

  private async sendMail(to: string, subject: string, html: string) {
    if (!this.transporter) {
      const account = await createTestAccount();

      this.transporter = createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    }

    const info = await this.transporter.sendMail({
      from: `"No reply" <${this.from}>`,
      to,
      subject,
      html,
    });

    if (this.environment === "development") {
      this.logger.log(`Preview url: ${getTestMessageUrl(info)}`);
    }
  }
}
