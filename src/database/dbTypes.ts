/**
 * Copyright (C) 2022-2023 Permanent Data Solutions, Inc. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import { FinalPrice, NetworkPrice } from "../pricing/price";
import { PublicArweaveAddress } from "../types";
import { WC } from "../types/arc";

export interface Adjustment {
  name: string;
  description: string;
  /** value to calculate adjustment ( Multiplier or Added Value ) */
  operatorMagnitude: number;
  operator: "multiply" | "add";
  adjustmentAmount: WC | number;
  catalogId: IdType;
}

export interface UploadAdjustment extends Adjustment {
  /** Amount of winc this adjustment changes (e.g -600 for 600 winc saved)  */
  adjustmentAmount: WC;
}

export interface PaymentAdjustment extends Adjustment {
  /** Amount of payment amount (usd, eur, btc) this adjustment changes (e.g -600 for 600 dollars saved) */
  adjustmentAmount: PaymentAmount;
  currencyType: CurrencyType;
  maxDiscount?: number;
  promoCode?: string;
}

export type UserAddress = string | PublicArweaveAddress;
export type UserAddressType = string | "arweave";

/** Currently using Postgres Date type (ISO String) */
export type Timestamp = string;

export type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | { [member: string]: JsonSerializable }
  | JsonSerializable[];

// TODO: Promotional Info Schema. We will use JSON object
export type PromotionalInfo = Record<string, JsonSerializable>;

type IdType = string;

export type TopUpQuoteId = IdType;
export type PaymentReceiptId = IdType;
export type ChargebackReceiptId = IdType;
export type ReservationId = IdType;
export type AdjustmentId = IdType;

export type DataItemId = IdType;

export type PaymentAmount = number;

export type CurrencyType = string;

export type PaymentProvider = string | "stripe"; // TODO: "apple-pay"

export interface User {
  userAddress: UserAddress;
  userAddressType: UserAddressType;
  userCreationDate: Timestamp;
  winstonCreditBalance: WC;
  promotionalInfo: PromotionalInfo;
}

export interface TopUpQuote {
  topUpQuoteId: TopUpQuoteId;
  destinationAddress: UserAddress;
  destinationAddressType: UserAddressType;
  paymentAmount: PaymentAmount;
  quotedPaymentAmount: PaymentAmount;
  currencyType: CurrencyType;
  winstonCreditAmount: WC;
  quoteExpirationDate: Timestamp;
  quoteCreationDate: Timestamp;
  paymentProvider: PaymentProvider;
}

export type CreateTopUpQuoteParams = Omit<TopUpQuote, "quoteCreationDate"> & {
  adjustments: PaymentAdjustment[];
};

export interface FailedTopUpQuote extends TopUpQuote {
  failedReason: "expired" | string;
  quoteFailedDate: Timestamp;
}

export interface PaymentReceipt extends TopUpQuote {
  paymentReceiptId: PaymentReceiptId;
  paymentReceiptDate: Timestamp;
}
export interface CreatePaymentReceiptParams {
  paymentReceiptId: PaymentReceiptId;
  topUpQuoteId: TopUpQuoteId;
  paymentAmount: PaymentAmount;
  currencyType: CurrencyType;
}

export interface ChargebackReceipt extends PaymentReceipt {
  chargebackReceiptId: ChargebackReceiptId;
  chargebackReason: string;
  chargebackReceiptDate: Timestamp;
}

export type CreateChargebackReceiptParams = {
  topUpQuoteId: TopUpQuoteId;
  chargebackReason: string;
  chargebackReceiptId: ChargebackReceiptId;
};

export interface BalanceReservation {
  reservationId: ReservationId;
  dataItemId: DataItemId;
  userAddress: UserAddress;
  reservedDate: Timestamp;
  reservedWincAmount: WC;
  networkWincAmount: WC;
}

export type CreateBalanceReservationParams = {
  dataItemId: DataItemId;
  userAddress: UserAddress;
  reservedWincAmount: FinalPrice;
  networkWincAmount: NetworkPrice;
  adjustments: UploadAdjustment[];
};

export interface AdjustmentCatalog {
  catalogId: IdType;
  name: string;
  description: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  operator: "add" | "multiply";
  operatorMagnitude: number;
  priority: number;
}

export type UploadAdjustmentCatalog = AdjustmentCatalog;

export interface PaymentAdjustmentCatalog extends AdjustmentCatalog {
  exclusivity: Exclusivity;
}

export interface SingleUseCodePaymentCatalog extends PaymentAdjustmentCatalog {
  codeValue: string;
  targetUserGroup: TargetUserGroup;
  maxUses: number;
  minimumPaymentAmount: number;
  maximumDiscountAmount: number;
}

export interface UserDBInsert {
  user_address: string;
  user_address_type: string;
  winston_credit_balance: string;
}

export type AuditChangeReason =
  | "upload"
  | "payment"
  | "account_creation"
  | "chargeback"
  | "refund";

export interface AuditLogInsert {
  user_address: string;
  winston_credit_amount: string;
  change_reason: AuditChangeReason;
  change_id?: string;
}

export interface AuditLogDBResult extends AuditLogInsert {
  audit_id: number;
  audit_date: string;
}

export interface UserDBResult extends UserDBInsert {
  promotional_info: JsonSerializable;
  user_creation_date: string;
}

export interface TopUpQuoteDBInsert {
  top_up_quote_id: string;
  destination_address: string;
  destination_address_type: string;
  payment_amount: string;
  quoted_payment_amount: string;
  currency_type: string;
  winston_credit_amount: string;
  payment_provider: string;
  quote_expiration_date: string;
}

export interface TopUpQuoteDBResult extends TopUpQuoteDBInsert {
  quote_creation_date: string;
}

export interface FailedTopUpQuoteDBInsert extends TopUpQuoteDBResult {
  failed_reason: string;
}

export interface FailedTopUpQuoteDBResult extends FailedTopUpQuoteDBInsert {
  quote_failed_date: string;
}

export interface PaymentReceiptDBInsert extends TopUpQuoteDBResult {
  payment_receipt_id: string;
}

export interface PaymentReceiptDBResult extends PaymentReceiptDBInsert {
  payment_receipt_date: string;
}

export interface ChargebackReceiptDBInsert extends PaymentReceiptDBResult {
  chargeback_receipt_id: string;
  chargeback_reason: string;
}

export interface ChargebackReceiptDBResult extends ChargebackReceiptDBInsert {
  chargeback_receipt_date: string;
}

export interface BalanceReservationDBInsert {
  reservation_id: string;
  data_item_id: string;
  user_address: string;
  reserved_winc_amount: string;
  network_winc_amount: string;
}

export interface BalanceReservationDBResult extends BalanceReservationDBInsert {
  reserved_date: string;
}

interface AdjustmentCatalogDBInsert {
  catalog_id: string;
  adjustment_name: string;
  adjustment_description?: string;

  adjustment_start_date?: string;
  adjustment_end_date?: string;

  operator: "add" | "multiply";
  operator_magnitude: string;
  adjustment_priority?: number;
}

export type UploadAdjustmentCatalogDBInsert = AdjustmentCatalogDBInsert;

export const exclusivity = ["inclusive", "exclusive"] as const;
export type Exclusivity = (typeof exclusivity)[number];

export interface PaymentAdjustmentCatalogDBInsert
  extends AdjustmentCatalogDBInsert {
  adjustment_exclusivity?: Exclusivity;
}

type TargetUserGroup = "all" | "new" | "existing";

export interface SingleUseCodePaymentCatalogDBInsert
  extends PaymentAdjustmentCatalogDBInsert {
  code_value: string;
  target_user_group?: TargetUserGroup;
  max_uses?: number;
  minimum_payment_amount?: number;
  maximum_discount_amount?: number;
}

export interface AdjustmentCatalogDBResult extends AdjustmentCatalogDBInsert {
  adjustment_start_date: string;
  adjustment_priority: number;
  adjustment_description: string;
}

export type UploadAdjustmentCatalogDBResult = AdjustmentCatalogDBResult &
  UploadAdjustmentCatalogDBInsert;

export type PaymentAdjustmentCatalogDBResult = AdjustmentCatalogDBResult &
  PaymentAdjustmentCatalogDBInsert & {
    adjustment_exclusivity: Exclusivity;
  };

export interface SingleUseCodePaymentCatalogDBResult
  extends PaymentAdjustmentCatalogDBResult {
  code_value: string;
  target_user_group: TargetUserGroup;
  max_uses: number;
  minimum_payment_amount: number;
  maximum_discount_amount: number;
}

interface AdjustmentDBInsert {
  catalog_id: string;
  adjustment_index: number;
  user_address: string;
}

export interface UploadAdjustmentDBInsert extends AdjustmentDBInsert {
  reservation_id: string;
  adjusted_winc_amount: string;
}

export interface AdjustmentDBResult extends AdjustmentDBInsert {
  adjustment_id: number;
  adjustment_date: string;
}

export interface UploadAdjustmentDBResult
  extends UploadAdjustmentDBInsert,
    AdjustmentDBResult {}

export interface PaymentAdjustmentDBInsert extends AdjustmentDBInsert {
  top_up_quote_id: string;
  adjusted_payment_amount: string;
  adjusted_currency_type: string;
}

export interface PaymentAdjustmentDBResult
  extends PaymentAdjustmentDBInsert,
    AdjustmentDBResult {}
