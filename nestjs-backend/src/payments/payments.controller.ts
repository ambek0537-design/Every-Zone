import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Initializes a subscription payment gateway checkout URL for the custom virtual micro-store
   */
  @Post('chapa-initialize')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async initializeSubscription(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializeSubscription(dto);
  }

  /**
   * Safe webhooks processor for verified Chapa transaction clearance notifications
   */
  @Post('chapa-webhook')
  @HttpCode(HttpStatus.OK)
  async handleChapaWebhook(
    @Body() body: any,
    @Headers('x-chapa-signature') chapaSignature?: string
  ) {
    return this.paymentsService.handleChapaWebhook(body, chapaSignature);
  }
}
