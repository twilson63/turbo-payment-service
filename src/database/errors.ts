/**
 * Copyright (C) 2022-2024 Permanent Data Solutions, Inc. All Rights Reserved.
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
import { CurrencyType, PaymentAmount, Timestamp, UserAddress } from "./dbTypes";

export class UserNotFoundWarning extends Error {
  constructor(userAddress: UserAddress) {
    super(`No user found in database with address '${userAddress}'`);
    this.name = "UserNotFoundWarning";
  }
}

export class InsufficientBalance extends Error {
  constructor(userAddress: UserAddress) {
    super(`Insufficient balance for '${userAddress}'`);
    this.name = "InsufficientBalance";
  }
}

export abstract class PaymentValidationError extends Error {}

export class UnsupportedCurrencyType extends PaymentValidationError {
  constructor(currencyType: CurrencyType) {
    super(
      `The currency type '${currencyType}' is currently not supported by this API!`
    );
    this.name = "UnsupportedCurrencyType";
  }
}

export class InvalidPaymentAmount extends PaymentValidationError {
  constructor(paymentAmount: PaymentAmount) {
    super(
      `The provided payment amount (${paymentAmount}) is invalid; it must be a positive non-decimal integer!`
    );
    this.name = "InvalidPaymentAmount";
  }
}

export class PaymentAmountTooSmall extends PaymentValidationError {
  constructor(
    paymentAmount: PaymentAmount,
    currencyType: CurrencyType,
    minimumAllowedAmount: PaymentAmount
  ) {
    super(
      `The provided payment amount (${paymentAmount}) is too small for the currency type "${currencyType}"; it must be above ${minimumAllowedAmount}!`
    );
    this.name = "PaymentAmountTooSmall";
  }
}

export class PaymentAmountTooLarge extends PaymentValidationError {
  constructor(
    paymentAmount: PaymentAmount,
    currencyType: CurrencyType,
    maximumAllowedAmount: PaymentAmount
  ) {
    super(
      `The provided payment amount (${paymentAmount}) is too large for the currency type "${currencyType}"; it must be below or equal to ${maximumAllowedAmount}!`
    );
    this.name = "PaymentAmountTooLarge";
  }
}

export abstract class PromoCodeError extends Error {}

export class UserIneligibleForPromoCode extends PromoCodeError {
  constructor(userAddress: UserAddress, promoCode: string) {
    super(
      `The user '${userAddress}' is ineligible for the promo code '${promoCode}'`
    );
    this.name = "UserIneligibleForPromoCode";
  }
}

export class PromoCodeNotFound extends PromoCodeError {
  constructor(promoCode: string) {
    super(`No promo code found with code '${promoCode}'`);
    this.name = "PromoCodeNotFound";
  }
}

export class PromoCodeExpired extends PromoCodeError {
  constructor(promoCode: string, endDate: Timestamp) {
    super(`The promo code '${promoCode}' expired on '${endDate}'`);
    this.name = "PromoCodeExpired";
  }
}

export class PaymentAmountTooSmallForPromoCode extends PromoCodeError {
  constructor(promoCode: string, minimumPaymentAmount: PaymentAmount) {
    super(
      `The promo code '${promoCode}' can only used on payments above '${minimumPaymentAmount}'`
    );
    this.name = "PaymentAmountTooSmallForPromoCode";
  }
}

export class PromoCodeExceedsMaxUses extends PromoCodeError {
  constructor(promoCode: string, maxUses: number) {
    super(
      `The promo code '${promoCode}' has already been used the maximum number of times (${maxUses})`
    );
    this.name = "PromoCodeExceedsMaxUses";
  }
}

export class GiftRedemptionError extends Error {
  constructor(errorMessage = "Failure to redeem payment receipt!") {
    super(errorMessage);
    this.name = "GiftRedemptionError";
  }
}

export class GiftAlreadyRedeemed extends GiftRedemptionError {
  constructor() {
    super("Gift has already been redeemed!");
    this.name = "GiftAlreadyRedeemed";
  }
}

export class PaymentTransactionNotMined extends Error {
  constructor(transactionId: string) {
    super(`Transaction with id '${transactionId}' has not been mined yet!`);
    this.name = "PaymentTransactionNotMined";
  }
}

export class PaymentTransactionNotFound extends Error {
  constructor(transactionId: string) {
    super(`No payment transaction found with id '${transactionId}'`);
    this.name = "PaymentTransactionNotFound";
  }
}

export class PaymentTransactionHasWrongTarget extends Error {
  constructor(transactionId: string, targetAddress?: string) {
    super(
      `Payment transaction '${transactionId}' has wrong target address '${targetAddress}'`
    );
    this.name = "PaymentTransactionHasWrongTarget";
  }
}

export class TransactionNotAPaymentTransaction extends Error {
  constructor(transactionId: string) {
    super(
      `Transaction with id '${transactionId}' is not a payment transaction!`
    );
    this.name = "TransactionNotAPaymentTransaction";
  }
}

export class PaymentTransactionRecipientOnExcludedList extends Error {
  constructor(transactionId: string, senderAddress: string) {
    super(
      `Payment transaction '${transactionId}' has sender that is on the excluded address list: '${senderAddress}'`
    );
    this.name = "PaymentTransactionRecipientOnExcludedList";
  }
}

export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequest";
  }
}

export class CryptoPaymentTooSmallError extends Error {
  constructor() {
    super(
      `Crypto payment amount is too small! Token value must convert to at least one winc`
    );
    this.name = "CryptoPaymentTooSmallError";
  }
}
