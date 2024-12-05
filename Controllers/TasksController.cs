using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tasks")]
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
public class TasksController(AppDbContext context) : ControllerBase
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
{
    private readonly AppDbContext _context = context;

    /// <summary>
    /// Obtém todas as tarefas com suporte a filtro por status.
    /// </summary>
    /// <param name="status">Status opcional para filtrar tarefas (Pendente, Concluído).</param>
    /// <returns>Uma lista de tarefas.</returns>
    /// <response code="200">Lista de tarefas retornada com sucesso.</response>
    /// <response code="400">Status inválido fornecido.</response>
    [HttpGet]
    public IActionResult GetTasks([FromQuery] string? status)
    {
        var tasks = _context.Tasks.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            var normalizedValue = StringUtils.RemoveDiacritics(status);

            if (EnumMappings.StatusMap.TryGetValue(normalizedValue, out TaskStatus statusEnum))
            {
                tasks = tasks.Where(t => t.Status == statusEnum);
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'status': {status}");
            }
        }

        return Ok(new { data = tasks.ToList() });
    }

    /// <summary>
    /// Obtém os detalhes de uma tarefa específica.
    /// </summary>
    /// <param name="id">ID da tarefa.</param>
    /// <returns>Detalhes da tarefa.</returns>
    /// <response code="200">Tarefa retornada com sucesso.</response>
    /// <response code="404">Tarefa não encontrada.</response>
    [HttpGet("{id}")]
    public IActionResult GetTaskById(int id)
    {
        var task = _context.Tasks.FirstOrDefault(t => t.Id == id);

        if (task == null)
        {
            return NotFound(new { message = "Tarefa não encontrada." });
        }

        return Ok(task);
    }

    /// <summary>
    /// Cria uma nova tarefa.
    /// </summary>
    /// <param name="task">Dados da tarefa a ser criada.</param>
    /// <returns>Tarefa criada com sucesso.</returns>
    /// <response code="201">Tarefa criada com sucesso.</response>
    /// <response code="400">Dados inválidos.</response>
    [HttpPost]
    public IActionResult CreateTask([FromBody] TaskItem task)
    {
        if (task == null)
        {
            return BadRequest(new { message = "Dados inválidos." });
        }

        if (string.IsNullOrWhiteSpace(task.Title) ||
            string.IsNullOrWhiteSpace(task.Priority.ToString()) ||
            string.IsNullOrWhiteSpace(task.Status.ToString()))
        {
            return BadRequest(new { message = "Os campos Título, Prioridade e Status são obrigatórios." });
        }

        _context.Tasks.Add(task);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetTaskById),
         new { id = task.Id },
         new { success = true, message = "Tarefa criada com sucesso.", data = task });
    }

    /// <summary>
    /// Atualiza uma tarefa existente.
    /// </summary>
    /// <param name="id">ID da tarefa a ser atualizada.</param>
    /// <param name="updates">Dados para atualização.</param>
    /// <returns>Tarefa atualizada com sucesso.</returns>
    /// <response code="200">Tarefa atualizada com sucesso.</response>
    /// <response code="400">Dados inválidos.</response>
    /// <response code="404">Tarefa não encontrada.</response>
    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, [FromBody] JsonElement updates)
    {
        var existingTask = _context.Tasks.Find(id);
        if (existingTask == null)
            return NotFound();

        // Processa os campos enviados dinamicamente
        if (updates.TryGetProperty("title", out var titleProp))
            existingTask.Title = titleProp.GetString();

        if (updates.TryGetProperty("description", out var descriptionProp))
            existingTask.Description = descriptionProp.GetString();

        if (updates.TryGetProperty("priority", out var priorityProp))
        {
            var priorityValue = priorityProp.GetString();
            if (Enum.TryParse(priorityValue, true, out PriorityLevel priorityEnum))
            {
                existingTask.Priority = priorityEnum;
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'priority': {priorityValue}");
            }
        }

        if (updates.TryGetProperty("status", out var statusProp))
        {
            var statusValue = statusProp.GetString();
            var normalizedValue = StringUtils.RemoveDiacritics(statusValue!);

            if (EnumMappings.StatusMap.TryGetValue(normalizedValue, out TaskStatus statusEnum))
            {
                existingTask.Status = statusEnum;
                existingTask.CompletedAt = statusEnum == TaskStatus.Concluído ? DateTime.UtcNow : null;
            }
            else
            {
                return BadRequest($"Valor inválido para o campo 'status': {statusValue}");
            }
        }

        _context.SaveChanges();
        return Ok(new { success = true, message = "Tarefa atualizada com sucesso.", data = existingTask });
    }


    /// <summary>
    /// Exclui uma tarefa.
    /// </summary>
    /// <param name="id">ID da tarefa a ser excluída.</param>
    /// <returns>Confirmação da exclusão.</returns>
    /// <response code="200">Tarefa excluída com sucesso.</response>
    /// <response code="404">Tarefa não encontrada.</response>
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var task = _context.Tasks.Find(id);
        if (task == null)
            return NotFound();

        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return Ok(new { success = true, message = "Tarefa excluída com sucesso." });
    }
}
