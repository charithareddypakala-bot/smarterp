const API = "https://smarterp-production-b6c9.up.railway.app/api/contra";

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

export async function getContraVouchers() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: { Authorization: `Bearer ${token()}` },
  });

  return res.json();
}

export async function createContraVoucher(data: any) {
  const res = await fetch(API, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      ...data,
      companyId: companyId(),
    }),
  });

  return res.json();
}