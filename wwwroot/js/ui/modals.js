export function openTaskModal(task = null) {
  $("#taskForm")[0].reset();
  $("#taskId").val("");

  if (task) {
    $("#taskId").val(task.id);
    $("#taskTitle").val(task.title);
    $("#taskDescription").val(task.description);
    $("#taskPriority").val(task.priority);
    $("#taskStatus").val(task.status);
    $("#taskModalLabel").text("Editar Tarefa");
  } else {
    $("#taskModalLabel").text("Nova Tarefa");
  }

  $("#taskModal").modal("show");
}

export function closeTaskModal() {
  $("#taskModal").modal("hide");
}
