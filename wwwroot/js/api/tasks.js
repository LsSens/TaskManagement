export async function fetchTaskById(id) {
  const response = await fetch(`/api/tasks/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar tarefa.");
  return response.json();
}

export async function saveTask(taskId, taskData) {
  const method = taskId ? "PUT" : "POST";
  const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao processar a solicitação.");
  }

  return response.json();
}

export async function deleteTaskById(id) {
  const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao processar a solicitação.");
  }
  return response.json();
}
