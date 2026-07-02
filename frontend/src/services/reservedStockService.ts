const API = "http://localhost:5000/api/reserved-stock";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getReservedStock() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}

export async function createReservedStock(data: any) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token()}`,
    },
    body: JSON.stringify({
      ...data,
      companyId: companyId(),
    }),
  });

  return res.json();
}