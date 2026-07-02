const API = "http://localhost:5000/api/banking";

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

export async function getBankTransactions() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}

export async function createBankTransaction(data: any) {
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

export async function reconcileTransaction(id: string) {
  const res = await fetch(`${API}/${id}/reconcile`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}