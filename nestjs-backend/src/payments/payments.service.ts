import { Injectable, BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly chapaSecretKey = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-default_temporary_key_for_compilation';
  private readonly chapaApiUrl = process.env.CHAPA_API_URL || 'https://api.chapa.co/v1';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a subscription payment on the Chapa payment gateway (200 ETB)
   */
  async initializeSubscription(dto: InitializePaymentDto) {
    const { vendorId, email, fullName, paymentAmount } = dto;
    const amount = paymentAmount || 200;

    // 1. Verify vendor exists first before billing
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID "${vendorId}" was not found in Every-zone registry`);
    }

    // 2. Generate a unique Chapa transaction reference following escrow specs
    const txRef = `evz-rent-${vendorId}-${Date.now()}`;

    // Split fullName into first/last safely
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Every-zone';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Vendor';

    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    const payload = {
      amount: amount.toString(),
      currency: 'ETB',
      email: email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: `${baseUrl}/api/payments/chapa-webhook`,
      return_url: `${baseUrl}/settings?paymentSuccess=true&tx_ref=${txRef}`,
      customization: {
        title: 'Every-zone Digital Shop Rental',
        description: `Premium activation payment for: ${vendor.shopName}`,
        logo: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=200',
      },
    };

    try {
      this.logger.log(`Requesting Chapa API to initialize payment for tx_ref: ${txRef}`);
      
      const response = await axios.post(
        `${this.chapaApiUrl}/transaction/initialize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.chapaSecretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.status === 'success') {
        return {
          status: 'success',
          message: 'Chapa checkout initialized successfully',
          tx_ref: txRef,
          checkout_url: response.data.data.checkout_url,
        };
      } else {
        throw new BadRequestException(
          response.data?.message || 'Chapa initialization returned an unsuccessful transaction response.'
        );
      }
    } catch (error: any) {
      this.logger.error(`Chapa communication failure: ${error.message}`, error.stack);
      
      const apiErrorMessage = error.response?.data?.message || error.message;
      throw new InternalServerErrorException(
        `Failed to reach Chapa checkout infrastructure. Reason: ${apiErrorMessage}`
      );
    }
  }

  /**
   * Verifies the webhook callback payload from Chapa securely
   */
  async handleChapaWebhook(body: any, chapaSignature?: string) {
    this.logger.log(`Webhook triggered; Signature header present: ${!!chapaSignature}`);

    // Validate Signature if provided in production environment (HMAC verification)
    if (chapaSignature && process.env.CHAPA_WEBHOOK_SECRET) {
      const computedSignature = crypto
        .createHmac('sha256', process.env.CHAPA_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      if (computedSignature !== chapaSignature) {
        throw new BadRequestException('HMAC Webhook signature mismatch.');
      }
    }

    const { tx_ref, status, amount } = body;

    if (status !== 'success') {
      this.logger.warn(`Transaction reference "${tx_ref}" callback received with non-success status: "${status}"`);
      return { status: 'ignored', reason: 'Non-successful status' };
    }

    // Parse the vendor ID from the transaction reference (structured as: evz-rent-vendorId-timestamp)
    const txParts = tx_ref?.split('-') || [];
    if (txParts.length < 4 || txParts[0] !== 'evz' || txParts[1] !== 'rent') {
      throw new BadRequestException(`Malformed transaction reference pattern: "${tx_ref}"`);
    }

    const vendorId = txParts[2];

    // Begin an atomic transaction using Prisma to ensure reliable updates and prevent race conditions
    return await this.prisma.$transaction(async (prismaTx) => {
      // 1. Verify corresponding vendor model exists
      const vendor = await prismaTx.vendor.findUnique({
        where: { id: vendorId },
        include: {
          subscriptionLogs: {
            orderBy: { expiryDate: 'desc' },
            take: 1,
          },
        },
      });

      if (!vendor) {
        this.logger.error(`Vendor not found for webhook vendorId: ${vendorId}`);
        throw new NotFoundException(`Linked vendor "${vendorId}" was not found.`);
      }

      // 2. High fidelity subscription extension logic (extends existing coverage, or starts new from baseline)
      const now = new Date();
      let newStartDate = now;
      let newExpiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days extension

      if (vendor.subscriptionLogs.length > 0) {
        const latestLog = vendor.subscriptionLogs[0];
        // If current subscription is still active, stack the 30-day expansion gracefully onto current expiry
        if (latestLog.expiryDate > now) {
          newStartDate = latestLog.expiryDate;
          newExpiryDate = new Date(latestLog.expiryDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
      }

      // 3. Create Subscription Log record
      const log = await prismaTx.subscriptionLog.create({
        data: {
          vendorId: vendor.id,
          amount: parseFloat(amount || '200'),
          chapaReference: tx_ref,
          activationDate: newStartDate,
          expiryDate: newExpiryDate,
        },
      });

      // 4. Update parent vendor status dynamically to Authorized ACTIVE
      await prismaTx.vendor.update({
        where: { id: vendor.id },
        data: {
          subscriptionStatus: 'ACTIVE',
        },
      });

      this.logger.log(`Success in processing subscription 200 ETB and activating shop: "${vendor.shopName}" until ${newExpiryDate.toISOString()}`);

      return {
        status: 'authorized',
        vendorId: vendor.id,
        shopName: vendor.shopName,
        subscriptionLogId: log.id,
        activeUntil: newExpiryDate,
      };
    });
  }
}
