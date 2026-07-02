const Customer = require("../models/Customer");
const Ledger = require("../models/Ledger");
// GET customers of selected company
exports.getCustomers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const customers = await Customer.find({
      userId: req.user.id,
      companyId,
    });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      userId: req.user.id,
    });
    const existingLedger = await Ledger.findOne({
  companyId: customer.companyId,
  userId: req.user.id,
  name: customer.name,
});

if (!existingLedger) {
  await Ledger.create({
    companyId: customer.companyId,
    userId: req.user.id,
    name: customer.name,
    group: "Sundry Debtors",
    openingBalance: 0,
    type: "Customer",
  });
}
    


    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const oldCustomer = await Customer.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!oldCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const oldName = oldCustomer.name;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    await Ledger.findOneAndUpdate(
      {
        companyId: customer.companyId,
        userId: req.user.id,
        name: oldName,
      },
      {
        name: customer.name,
      }
    );

    res.json({
      success: true,
      message: "Customer updated",
      customer,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await Ledger.findOneAndDelete({
      companyId: customer.companyId,
      userId: req.user.id,
      name: customer.name,
    });

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};