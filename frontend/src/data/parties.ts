import type { Customer, Supplier } from "@/types";

export const customers: Customer[] = [
  { id: "cu1", name: "Rahul Sharma", email: "rahul@northwind.in", phone: "+91 98200 11223", gstin: "27ABCDR1234F1Z5", city: "Mumbai", balance: 45200, status: "active" },
  { id: "cu2", name: "Priya Nair", email: "priya@bluewave.in", phone: "+91 99800 44556", gstin: "29ABCDP5678H1Z2", city: "Bengaluru", balance: 0, status: "active" },
  { id: "cu3", name: "Amit Verma", email: "amit@vermatech.in", phone: "+91 98110 77889", gstin: "07ABCDV9012K1Z8", city: "Delhi", balance: 128400, status: "active" },
  { id: "cu4", name: "Sneha Reddy", email: "sneha@reddymart.in", phone: "+91 90030 22110", gstin: "36ABCDS3456L1Z1", city: "Hyderabad", balance: 9800, status: "inactive" },
  { id: "cu5", name: "Vikram Singh", email: "vikram@singhco.in", phone: "+91 98730 66554", gstin: "03ABCDV7890M1Z4", city: "Amritsar", balance: 67500, status: "active" },
  { id: "cu6", name: "Anjali Mehta", email: "anjali@mehtaretail.in", phone: "+91 97690 33221", gstin: "24ABCDM2345N1Z7", city: "Ahmedabad", balance: 0, status: "active" },
  { id: "cu7", name: "Karthik Iyer", email: "karthik@iyergroup.in", phone: "+91 95000 88776", gstin: "33ABCDK6789P1Z0", city: "Chennai", balance: 32100, status: "inactive" },
  { id: "cu8", name: "Neha Gupta", email: "neha@guptasons.in", phone: "+91 99100 55443", gstin: "09ABCDN0123Q1Z3", city: "Lucknow", balance: 15600, status: "active" },
  { id: "cu9", name: "Rohan Das", email: "rohan@daskart.in", phone: "+91 98300 99887", gstin: "19ABCDR4567R1Z6", city: "Kolkata", balance: 88900, status: "active" },
  { id: "cu10", name: "Pooja Joshi", email: "pooja@joshitraders.in", phone: "+91 90040 11009", gstin: "08ABCDP8901S1Z9", city: "Jaipur", balance: 4200, status: "active" },
  { id: "cu11", name: "Sanjay Patel", email: "sanjay@patelmart.in", phone: "+91 97250 44332", gstin: "24ABCDP2345T1Z2", city: "Surat", balance: 0, status: "inactive" },
  { id: "cu12", name: "Divya Menon", email: "divya@menontrade.in", phone: "+91 95620 77665", gstin: "32ABCDD6789U1Z5", city: "Kochi", balance: 51300, status: "active" },
];

export const suppliers: Supplier[] = [
  { id: "su1", name: "Bharat Steel Works", email: "sales@bharatsteel.in", phone: "+91 98200 31415", gstin: "27ABFCB1234F1Z5", city: "Pune", balance: 234500, status: "active" },
  { id: "su2", name: "Nova Components", email: "info@novacomp.in", phone: "+91 99800 92653", gstin: "29ABFCN5678H1Z2", city: "Bengaluru", balance: 0, status: "active" },
  { id: "su3", name: "Krishna Textiles", email: "orders@krishnatex.in", phone: "+91 98110 58979", gstin: "36ABFCK9012K1Z8", city: "Hyderabad", balance: 78900, status: "active" },
  { id: "su4", name: "Orient Packaging", email: "hello@orientpack.in", phone: "+91 90030 32384", gstin: "07ABFCO3456L1Z1", city: "Delhi", balance: 12400, status: "inactive" },
  { id: "su5", name: "Pioneer Chemicals", email: "sales@pioneerchem.in", phone: "+91 98730 62643", gstin: "24ABFCP7890M1Z4", city: "Vadodara", balance: 165000, status: "active" },
  { id: "su6", name: "Summit Electricals", email: "contact@summitelec.in", phone: "+91 97690 38327", gstin: "33ABFCS2345N1Z7", city: "Chennai", balance: 0, status: "active" },
  { id: "su7", name: "Royal Hardware Co", email: "info@royalhw.in", phone: "+91 95000 95028", gstin: "19ABFCR6789P1Z0", city: "Kolkata", balance: 43200, status: "active" },
  { id: "su8", name: "Galaxy Plastics", email: "sales@galaxyplast.in", phone: "+91 99100 84197", gstin: "09ABFCG0123Q1Z3", city: "Kanpur", balance: 27800, status: "inactive" },
];
