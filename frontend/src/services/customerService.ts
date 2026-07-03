const API = "https://smarterp-production-b6c9.up.railway.app/api/customers";

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

export async function getCustomers() {
  const companyId = getCompanyId();

  const response = await fetch(`${API}?companyId=${companyId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createCustomer(customer: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...customer,
      companyId: getCompanyId(),
    }),
  });

  return response.json();
}

export async function updateCustomer(id: string, customer: any) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(customer),
  });

  return response.json();
}

export async function deleteCustomer(id: string) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}