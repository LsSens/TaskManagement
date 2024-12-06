# Task Management System by Lucas Sens
### Descrição
Este projeto é uma aplicação de gerenciamento de tarefas desenvolvida com ASP.NET Core, utilizando Razor Pages e API RESTful. Ele foi projetado para ser dinâmico e responsivo, com integração completa de operações via AJAX.

### Funcionalidades
- Operações CRUD completas para tarefas.
- Listagem dinâmica com DataTables, suportando:
- Paginação, busca e ordenação.
- Filtros por status.
- Operações via AJAX, evitando recarregamento de página.
- Exportação de Tarefas para CSV/Excel diretamente da tabela.
- Modais Dinâmicos para criação e edição de tarefas.
- Feedback ao Usuário claro e informativo para erros e sucessos.

## Configuração e Execução
### Pré-requisitos
- .NET Core SDK instalado.
- Banco de dados configurado (SQLite/SQL Server ou outro definido no projeto).
- Ferramentas de linha de comando, como dotnet CLI.

### Como rodar o projeto
1. Clone o repositório
2. Restaure as dependências e aplique as migrações do banco de dados
3. Execute o servidor
`dotnet ef database update`
`dotnet run`
4. Acesse a aplicação no navegador
`http://localhost:5298/`

## Documentação dos Endpoints
- Os endpoints da API estão documentados diretamente no projeto pela utilização do swagger.
`http://localhost:5298/api-docs/`

## Tecnologias Utilizadas
- Backend:
 - 	ASP.NET Core com Razor Pages
 - 	Entity Framework Core para o banco de dados
- Frontend:
 - 	Bootstrap para estilização
 - 	DataTables para exibição de dados
- Outros:
 - 	AJAX para operações dinâmicas
 - 	XLSX.js para exportação de dados para 	CSV/Excel

## Estrutura do Projeto
- `Controllers/TasksController.cs`: Controlador RESTful para as operações de CRUD.
- `Views/`: Páginas Razor para renderização do front-end.
- `wwwroot/js/`: Arquivos JavaScript para interações e operações via AJAX.
- `Data/`: Configuração do banco de dados e classes de contexto.
