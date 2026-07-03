const API = "https://smarterp-production-b6c9.up.railway.app/api/companies";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getCompanies() {
  const response = await fetch(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createCompany(company: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(company),
  });

  return response.json();
}

export async function updateCompany(id: string, company: any) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(company),
  });

  return response.json();
}

export async function deleteCompany(id: string) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}