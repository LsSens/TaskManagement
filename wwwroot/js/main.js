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

      showAlert(response.message || "Tarefa salva com sucesso!", "success");
    } catch (error) {
      const errorMessage = error.message || "Erro ao salvar a tarefa!";
      showAlert(errorMessage, "danger");
    }
  });

  $("#csvTasksBtn").on("click", async function () {
    try {
      const data = taskTable.rows({ search: "applied" }).data().toArray();

      if (data.length === 0) {
        showAlert("Nenhum dado disponível para exportação.", "warning");
        return;
      }

      downloadExcel(data);

      showAlert("Excel gerado com sucesso!", "success");
    } catch (error) {
      showAlert(`Erro ao gerar Excel: ${error.message}`, "danger");
    }
  });
});

function downloadExcel(data) {
  const excelData = data.map((task) => ({
    Título: task.title,
    Descrição: task.description || "N/A",
    Prioridade: task.priority,
    Status: task.status,
    "Concluído Em": task.completedAt
      ? new Date(task.completedAt).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A",
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);

  const columnWidths = Object.keys(excelData[0] || {}).map((key) => ({
    wpx: Math.max(100, key.length * 10),
  }));

  ws["!cols"] = columnWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tarefas");

  XLSX.writeFile(wb, "tarefas.csv"); // PODER SER UTILIZADO EM CSV
}

export function showAlert(message, type) {
  const alertBox = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  $("#alertBootstrap").prepend(alertBox);

  setTimeout(() => $(".alert").alert("close"), 5000);
}
