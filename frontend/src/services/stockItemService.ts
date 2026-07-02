const API = "http://localhost:5000/api/stock-items";

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

export async function getStockItems() {
  const response = await fetch(`${API}?companyId=${getCompanyId()}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}

export async function createStockItem(item: any) {
  const response = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...item,
      companyId: getCompanyId(),
    }),
  });

  return response.json();
}

export async function updateStockItem(id: string, item: any) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(item),
  });

  return response.json();
}

export async function deleteStockItem(id: string) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.json();
}