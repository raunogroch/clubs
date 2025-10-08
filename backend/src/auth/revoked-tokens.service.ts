import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { RevokedToken, RevokedTokenDocument } from './schemas/revoked-token.schema';

@Injectable()
export class RevokedTokensService {
  constructor(
    @InjectModel('RevokedToken') private revokedTokenModel: Model<RevokedTokenDocument>,
  ) {}

  async revoke(jti: string, exp: number) {
    try {
      const doc = new this.revokedTokenModel({ jti, exp });
      await doc.save();
    } catch (e) {
      // ignore duplicate key errors
    }
  }

  async isRevoked(jti: string): Promise<boolean> {
    const found = await this.revokedTokenModel.findOne({ jti }).lean();
    return !!found;
  }

  // Optional: cleanup expired revoked tokens
  async cleanup() {
    const now = Math.floor(Date.now() / 1000);
    await this.revokedTokenModel.deleteMany({ exp: { $lt: now } });
  }
}
