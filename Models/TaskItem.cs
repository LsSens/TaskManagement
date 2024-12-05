using System.ComponentModel.DataAnnotations;

public enum PriorityLevel
{
    Baixa,
    Média,
    Alta
}

public enum TaskStatus
{
    Pendente,
    Concluído,
    Concluido
}

public class TaskItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O campo 'Title' é obrigatório.")]
    [MaxLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres.")]
    public string? Title { get; set; }

    [MaxLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "O campo 'Priority' é obrigatório.")]
    public PriorityLevel Priority { get; set; }

    [Required(ErrorMessage = "O campo 'Status' é obrigatório.")]
    public TaskStatus Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? CompletedAt { get; set; }
}