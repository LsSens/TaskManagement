import { initializeTaskTable } from "./ui/table.js";
import { openTaskModal, closeTaskModal } from "./ui/modals.js";
import { saveTask } from "./api/tasks.js";

$(document).ready(function () {
  const taskTable = initializeTaskTable();

  $("#createTaskBtn").click(() => openTaskModal());

  $("#taskForm").submit(async function (e) {
    e.preventDefault();

    const taskId = $("#taskId").val();
    const taskData = {
      title: $("#taskTitle").val(),
      description: $("#taskDescription").val(),
      priority: $("#taskPriority").val(),
      status: $("#taskStatus").val(),
    };

    try {
      const response = await saveTask(taskId, taskData);
      closeTaskModal();
      taskTable.ajax.reload();

      showAlert("Tarefa salva com sucesso!", "success");
    } catch (error) {
      const errorMessage =
        error.responseJSON?.message || "Erro ao salvar a tarefa!";
      showAlert(errorMessage, "danger");
    }
  });
});

function showAlert(message, type) {
  const alertBox = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  $("#alertBootstrap").prepend(alertBox);

  setTimeout(() => $(".alert").alert("close"), 5000);
}
