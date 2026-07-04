import { Injectable, Logger } from '@nestjs/common';

export interface FaydaVerificationResult {
  verified: boolean;
  fullNameMatched: boolean;
  digitalId: string;
  registrationDetails?: {
    fullNameAmharic: string;
    fullNameEnglish: string;
    dateOfBirth: string;
    nationality: string;
    gender: string;
    status: string;
  };
}

@Injectable()
export class FaydaService {
  private readonly logger = new Logger(FaydaService.name);

  /**
   * Simulates verification against the Ethiopia National ID (Fayda) biometric system.
   */
  async verifyDigitalId(idNumber: string, fullName: string): Promise<FaydaVerificationResult> {
    this.logger.log(`Dispatching secure SOAP/REST query to Fayda Central Registry for ID: ${idNumber}`);
    
    // Simulate latency of official API
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Simulated blacklisted check
    if (idNumber.toUpperCase().includes('BLACK') || idNumber.toUpperCase() === 'ET-BLACKLIST-999') {
      return {
        verified: false,
        fullNameMatched: false,
        digitalId: idNumber,
      };
    }

    // Default mock responder matching typical Ethiopian name structure
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Almaz';
    const fatherName = nameParts[1] || 'Kebede';

    return {
      verified: true,
      fullNameMatched: true,
      digitalId: idNumber,
      registrationDetails: {
        fullNameAmharic: `አልማዝ ከበደ`,
        fullNameEnglish: `${firstName} ${fatherName}`,
        dateOfBirth: '1995-09-12',
        nationality: 'Ethiopian',
        gender: 'F',
        status: 'ACTIVE_REGISTERED',
      },
    };
  }
}
