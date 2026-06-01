const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, default: '' },
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        price: Number,
        quantity: { type: Number, default: 1, min: 1 },
        size: String,
        color: String,
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['cod', 'online'],
      default: 'cod',
    },
    notes: String,
    whatsappNotified: {
      type: Boolean,
      default: false,
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'shopkeeper', null],
      default: null,
    },
    verificationChecklist: {
      isQualityVerified: { type: Boolean, default: false },
      isSizeVerified: { type: Boolean, default: false },
      isIntegrityVerified: { type: Boolean, default: false },
      verifiedAt: Date
    },
    isVerified: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

// Auto-generate order ID
orderSchema.pre('save', async function () {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  // NOTE: statusHistory is managed explicitly by controllers to avoid duplicates
});

module.exports = mongoose.model('Order', orderSchema);
