const API = "https://smarterp-production-b6c9.up.railway.app/api/sales";

function getToken() {
  return localStorage.getItem("token");
}

function getCompanyId() {
  return localStorage.getItem("companyId");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getSalesVouchers() {
  const response = await fetch(`${API}?companyId=${getCompanyId()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createSalesVoucher(voucher: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...voucher,
      companyId: getCompanyId(),
    }),
  });

  return response.json();
}