const API = "https://smarterp-production-b6c9.up.railway.app/api/suppliers";

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

export async function getSuppliers() {
  const response = await fetch(`${API}?companyId=${getCompanyId()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createSupplier(supplier: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...supplier,
      companyId: getCompanyId(),
    }),
  });

  return response.json();
}

export async function updateSupplier(id: string, supplier: any) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(supplier),
  });

  return response.json();
}

export async function deleteSupplier(id: string) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}