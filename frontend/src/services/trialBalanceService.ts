const API = "http://localhost:5000/api/trial-balance";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getTrialBalance() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}