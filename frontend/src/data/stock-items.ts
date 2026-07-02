import type { StockItem } from "@/types";

export const stockItems: StockItem[] = [
  { id: "s1", name: "Steel Rod 12mm", sku: "STL-12MM", category: "Raw Material", quantity: 1240, unit: "kg", purchasePrice: 62, sellingPrice: 78, gstRate: 18 },
  { id: "s2", name: "Cement Bag 50kg", sku: "CEM-50", category: "Construction", quantity: 320, unit: "bag", purchasePrice: 340, sellingPrice: 395, gstRate: 28 },
  { id: "s3", name: "PVC Pipe 1 inch", sku: "PVC-1IN", category: "Plumbing", quantity: 86, unit: "pcs", purchasePrice: 110, sellingPrice: 149, gstRate: 18 },
  { id: "s4", name: "Copper Wire 2.5sqmm", sku: "CPR-25", category: "Electrical", quantity: 540, unit: "mtr", purchasePrice: 28, sellingPrice: 39, gstRate: 18 },
  { id: "s5", name: "Plywood Sheet 8x4", sku: "PLY-84", category: "Construction", quantity: 12, unit: "sheet", purchasePrice: 1450, sellingPrice: 1799, gstRate: 18 },
  { id: "s6", name: "LED Bulb 9W", sku: "LED-9W", category: "Electrical", quantity: 0, unit: "pcs", purchasePrice: 64, sellingPrice: 99, gstRate: 12 },
  { id: "s7", name: "Acrylic Paint 4L", sku: "PNT-4L", category: "Paints", quantity: 95, unit: "can", purchasePrice: 720, sellingPrice: 950, gstRate: 18 },
  { id: "s8", name: "Door Hinge SS", sku: "HNG-SS", category: "Hardware", quantity: 760, unit: "pcs", purchasePrice: 24, sellingPrice: 45, gstRate: 18 },
  { id: "s9", name: "Cement Tile 2x2", sku: "TIL-22", category: "Construction", quantity: 430, unit: "box", purchasePrice: 480, sellingPrice: 620, gstRate: 28 },
  { id: "s10", name: "MCB 32A Single Pole", sku: "MCB-32", category: "Electrical", quantity: 8, unit: "pcs", purchasePrice: 180, sellingPrice: 245, gstRate: 18 },
  { id: "s11", name: "Wall Putty 20kg", sku: "PUT-20", category: "Paints", quantity: 140, unit: "bag", purchasePrice: 410, sellingPrice: 525, gstRate: 18 },
  { id: "s12", name: "GI Sheet 10ft", sku: "GI-10", category: "Raw Material", quantity: 64, unit: "sheet", purchasePrice: 890, sellingPrice: 1120, gstRate: 18 },
];
