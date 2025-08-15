import {
      CanActivate,
      ExecutionContext,
      Injectable,
      UnauthorizedException,
} from '@nestjs/common';
import envConfig from 'src/shared/config';

@Injectable()
export class PaymentTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const paymentToken = request.headers['Authorization']?.split(' ')[1] as
      | string
      | undefined;
    console.log(paymentToken, envConfig.PAYMENT_API_KEY);

    if (!paymentToken || paymentToken !== envConfig.PAYMENT_API_KEY) {
      throw new UnauthorizedException('Payment token is missing or invalid');
    }
    return true;
  }
}
