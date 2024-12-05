public static class EnumMappings
{
    public static readonly Dictionary<string, TaskStatus> StatusMap = new()
    {
        { "pendente", TaskStatus.Pendente },
        { "concluido", TaskStatus.Concluído }
    };
}
