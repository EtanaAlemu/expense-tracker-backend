const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"],
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [1, "Budget limit must be greater than 0"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return value < this.endDate; // Start date must be before end date
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
