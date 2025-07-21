// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import CheapDealMail from 'emails/cheap-deal-mail'; // Import the email component
import { Resend } from 'resend';
import envConfig from 'src/shared/config';
@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY); // Đặt trong .env
  }

  async sendEmail( email: string, code: string) {
    const result = await this.resend.emails.send({
      from: 'Cheap Deals <noreply@fink.io.vn>',
      to: email,
      subject: 'Verify your email',
      react: <CheapDealMail loginCode={code}/>, 
      html: `<div>
      <h1>Verify your email ${email}</h1>
        <a href="http://localhost:3000/verify-email?code=${code}" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">
          Verify Email
        </a>
      </div>`,
    });


    return result;
  }
}
