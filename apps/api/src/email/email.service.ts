import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendVerificationCode(params: {
    to: string;
    code: string;
    appName?: string;
  }) {
    const appName = params.appName ?? process.env.APP_NAME ?? 'App';
const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev';

const subject = appName + ' verification code';

const html = `
<div style="font-family:Inter,Arial,sans-serif;line-height:1.4">
  <h2 style="margin:0 0 12px 0">${appName}</h2>
  <p style="margin:0 0 8px 0">Your verification code:</p>
  <div style="font-size:28px;font-weight:700;letter-spacing:2px">
    ${params.code}
  </div>
  <p style="margin:12px 0 0;color:#777">
    If you didn't request this, ignore this email.
  </p>
</div>
`.trim();

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is missing (check .env and ConfigModule)");
    }

    try {
      this.logger.log(`Sending verification email to: ${params.to} from: ${from}`);

      const result = await this.resend.emails.send({
        from,
        to: params.to,
        subject,
        html,
      });

      this.logger.log(`Resend result: ${JSON.stringify(result)}`);
      return result;
} catch (err: any) {
  this.logger.error(
    `Failed to send email: ${err?.message || err}`,
    err?.stack,
  );
  throw err;
}
  }
}