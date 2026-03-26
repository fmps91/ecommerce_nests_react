export class PasswordResetEntity {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;

  constructor(partial: Partial<PasswordResetEntity>) {
    Object.assign(this, partial);
  }

  static create(email: string, token: string): PasswordResetEntity {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

    return new PasswordResetEntity({
      id: Math.random().toString(36).substring(2, 15),
      email,
      token,
      expiresAt,
      isUsed: false,
      createdAt: new Date(),
    });
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isUsed && !this.isExpired();
  }
}
