const API = "http://localhost:5000/api/customer-ledger";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getCustomerLedger(customerId: string) {
  const res = await fetch(
    `${API}?companyId=${companyId()}&customerId=${customerId}`,
    {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    },
  );

  return res.json();
}