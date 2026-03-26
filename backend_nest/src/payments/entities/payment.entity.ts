import { Payment, PaymentMethod, PaymentStatus } from "../models/payments.model";

export class PaymentEntity {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string | null;
  metadata?: any;
  paid_at?: Date | null;  // ✅ Permitir null
  notes?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  constructor(partial: Partial<PaymentEntity>) {
    Object.assign(this, partial);
  }

  static fromModel(payment: Payment): PaymentEntity {
    return new PaymentEntity({
      id: payment.id,
      order_id: payment.order_id,
      user_id: payment.user_id,
      amount: Number(payment.amount),
      payment_method: payment.payment_method,
      status: payment.status,
      transaction_id: payment.transaction_id,
      metadata: payment.metadata,
      paid_at: payment.paid_at,
      notes: payment.notes,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      deleted_at: payment.deleted_at,
    });
  }
}