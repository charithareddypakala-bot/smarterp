const API = "https://smarterp-production-b6c9.up.railway.app/api/purchases";

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

export async function getPurchaseVouchers() {
  const response = await fetch(`${API}?companyId=${getCompanyId()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createPurchaseVoucher(voucher: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...voucher,
      companyId: getCompanyId(),
    }),
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: "Invalid response from purchase API",
  }));

  if (!response.ok) {
    return {
      success: false,
      message: data.message || `Purchase API failed with status ${response.status}`,
    };
  }

  return data;
}
