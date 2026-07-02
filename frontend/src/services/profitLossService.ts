const API = "http://localhost:5000/api/profit-loss";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getProfitLoss() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}