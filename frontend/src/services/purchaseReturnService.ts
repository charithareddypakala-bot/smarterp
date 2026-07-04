const API = "https://smarterp-production-b6c9.up.railway.app/api/purchase-returns";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  };
}

export async function getPurchaseReturns() {
  const url = `${API}?companyId=${companyId()}`;
  const res = await fetch(url, { headers: headers() });
  return res.json();
}

export async function createPurchaseReturn(data: any) {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ ...data, companyId: companyId() }),
  });

  return res.json();
}
