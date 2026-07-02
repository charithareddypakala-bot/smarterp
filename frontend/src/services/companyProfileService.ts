const API = "http://localhost:5000/api/company-profile";

function token() {
  return localStorage.getItem("token");
}

function companyId() {
  return localStorage.getItem("companyId");
}

export async function getCompanyProfile() {
  const res = await fetch(`${API}?companyId=${companyId()}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return res.json();
}

export async function saveCompanyProfile(data: any) {
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