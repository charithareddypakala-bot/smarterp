const API = "https://smarterp-production-b6c9.up.railway.app/api/journals";

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

export async function getJournalVouchers() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}

export async function createJournalVoucher(data: any) {
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        ...data,
        companyId: companyId(),
      }),
    });

    const payload = await res.json().catch(() => ({
      success: false,
      message: "Unable to save journal voucher",
    }));

    if (!res.ok) {
      return {
        success: false,
        message: payload.message || "Unable to save journal voucher",
      };
    }

    return payload;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Unable to save journal voucher",
    };
  }
}