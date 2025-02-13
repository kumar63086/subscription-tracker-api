import mongoose, { Document, Model, Schema } from 'mongoose';

// Define an interface for a Subscription document
export interface ISubscription extends Document {
  name: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: 'sports' | 'news' | 'entertainment' | 'lifestyle' | 'technology' | 'finance' | 'politics' | 'other';
  paymentMethod: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  renewalDate?: Date;
  user: mongoose.Types.ObjectId;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, 'Subscription price is required'],
      min: [0, 'Price must be greater than 0'],
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      default: 'USD',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
      type: String,
      enum: [
        'sports',
        'news',
        'entertainment',
        'lifestyle',
        'technology',
        'finance',
        'politics',
        'other',
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date): boolean {
          return value <= new Date();
        },
        message: 'Start date must be in the past',
      },
    },
    renewalDate: {
      type: Date,
      validate: {
        validator: function (value: Date): boolean {
          // Use a type guard to ensure startDate is available
          return this.startDate ? value > this.startDate : true;
        },
        message: 'Renewal date must be after the start date',
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook: Auto-calculate renewal date if missing and update status if renewal date has passed.
subscriptionSchema.pre<ISubscription>('save', function (next) {
  // If renewalDate is not set and frequency is provided, calculate it.
  if (!this.renewalDate && this.frequency) {
    const renewalPeriods: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };

    this.renewalDate = new Date(this.startDate);
    const period = renewalPeriods[this.frequency];
    if (period) {
      this.renewalDate.setDate(this.renewalDate.getDate() + period);
    }
  }

  // If the renewalDate has passed, update the status to 'expired'
  if (this.renewalDate && this.renewalDate < new Date()) {
    this.status = 'expired';
  }

  next();
});

// Create and export the Subscription model with TypeScript typing
const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  'Subscription',
  subscriptionSchema
);

export default Subscription;
