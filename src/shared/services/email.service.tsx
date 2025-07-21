// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import CheapDealMail from 'emails/cheap-deal-mail'; // Import the email component
import ForgotPassword from 'emails/forgot-password';
import { Resend } from 'resend';
import envConfig from 'src/shared/config';
@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY); // Đặt trong .env
  }

  async sendEmail( email: string, name: string, code: string, type: 'verify' | 'reset' = 'verify') {
    const result = await this.resend.emails.send({
      from: 'Cheap Deals <noreply@fink.io.vn>',
      to: email,
      subject: type === 'verify' ? 'Verify your Cheap Deals account' : 'Reset your Cheap Deals password',
      react:type ? <CheapDealMail loginCode={code}/> : <ForgotPassword forgotCode={code}  userName={name} />, 
    });
    return result;
  }
}
