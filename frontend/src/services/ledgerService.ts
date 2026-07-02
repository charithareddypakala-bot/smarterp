const API = "http://localhost:5000/api/ledgers";

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

export async function getLedgers() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}

export async function createLedger(data: any) {
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

export async function updateLedger(id: string, data: any) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteLedger(id: string) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: headers(),
  });

  return res.json();
}