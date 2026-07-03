const API = "https://smarterp-production-b6c9.up.railway.app/api/supplier-ledger";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getSupplierLedger(supplierId: string) {
  const res = await fetch(
    `${API}?companyId=${companyId()}&supplierId=${supplierId}`,
    {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    }
  );

  return res.json();
}