const Supplier = require("../models/Supplier");
const Ledger = require("../models/Ledger");

// GET suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const suppliers = await Supplier.find({
      userId: req.user.id,
      companyId,
    });

    res.json({
      success: true,
      suppliers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE supplier
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      userId: req.user.id,
    });

    const existingLedger = await Ledger.findOne({
      companyId: supplier.companyId,
      userId: req.user.id,
      name: supplier.name,
    });

    if (!existingLedger) {
      await Ledger.create({
        companyId: supplier.companyId,
        userId: req.user.id,
        name: supplier.name,
        group: "Sundry Creditors",
        openingBalance: 0,
        balanceType: "Cr",
        remarks: "Auto-created from supplier",
      });
    }

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE supplier
exports.updateSupplier = async (req, res) => {
  try {
    const oldSupplier = await Supplier.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!oldSupplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    const oldName = oldSupplier.name;

    const supplier = await Supplier.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      { new: true }
    );

    await Ledger.findOneAndUpdate(
      {
        companyId: supplier.companyId,
        userId: req.user.id,
        name: oldName,
      },
      {
        name: supplier.name,
      }
    );

    res.json({
      success: true,
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    await Ledger.findOneAndDelete({
      companyId: supplier.companyId,
      userId: req.user.id,
      name: supplier.name,
    });

    res.json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};