using GuerraArq.Api.Controllers.Dtos;
using GuerraArq.Api.Data;
using GuerraArq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GuerraArq.Api.Controllers;

// CRUD completo de projetos.
// GET é público (qualquer visitante pode listar/ver projetos).
// POST/PUT/DELETE exigem token de admin.
[ApiController]
[Route("api/projetos")]
public class ProjetosController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProjetosController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/projetos
    // Lista todos os projetos ordenados pelo campo Ordem (e CreatedAt como desempate).
    // Inclui a galeria pra evitar N+1 requests do front.
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var projetos = await _db.Projetos
            .Include(p => p.Galeria.OrderBy(g => g.Ordem))
            .OrderBy(p => p.Ordem)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();
        return Ok(projetos);
    }

    // GET /api/projetos/{slug}
    // Busca um projeto específico pelo slug (URL pública).
    [HttpGet("{slug}")]
    public async Task<IActionResult> Obter(string slug)
    {
        var projeto = await _db.Projetos
            .Include(p => p.Galeria.OrderBy(g => g.Ordem))
            .FirstOrDefaultAsync(p => p.Slug == slug);

        if (projeto == null) return NotFound();
        return Ok(projeto);
    }

    // POST /api/projetos
    // Cria um novo projeto. Apenas admin.
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Criar([FromBody] ProjetoUpsertDto dto)
    {
        // Garante slug único — se já existe, devolve 409 Conflict.
        if (await _db.Projetos.AnyAsync(p => p.Slug == dto.Slug))
            return Conflict(new { erro = "Já existe um projeto com esse slug." });

        // Mapeia o DTO para a entidade.
        var projeto = new Projeto
        {
            Slug = dto.Slug,
            Titulo = dto.Titulo,
            Ano = dto.Ano,
            Tipo = dto.Tipo,
            Categoria = dto.Categoria,
            AreaM2 = dto.AreaM2,
            Localizacao = dto.Localizacao,
            Duracao = dto.Duracao,
            Cliente = dto.Cliente,
            Status = dto.Status,
            Ferramentas = dto.Ferramentas,
            DescricaoParagrafos = dto.DescricaoParagrafos,
            Citacao = dto.Citacao,
            CapaUrl = dto.CapaUrl,
            Ordem = dto.Ordem,
            // Cada item da galeria vira uma linha em GaleriaItens (cascade automático).
            Galeria = dto.Galeria.Select(g => new GaleriaItem
            {
                Url = g.Url,
                Descricao = g.Descricao,
                Ordem = g.Ordem
            }).ToList()
        };

        _db.Projetos.Add(projeto);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Obter), new { slug = projeto.Slug }, projeto);
    }

    // PUT /api/projetos/{id}
    // Atualiza um projeto existente. Apenas admin.
    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] ProjetoUpsertDto dto)
    {
        var projeto = await _db.Projetos
            .Include(p => p.Galeria)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (projeto == null) return NotFound();

        // Verifica conflito de slug com outro projeto.
        if (projeto.Slug != dto.Slug && await _db.Projetos.AnyAsync(p => p.Slug == dto.Slug))
            return Conflict(new { erro = "Já existe outro projeto com esse slug." });

        // Atualiza os campos escalares.
        projeto.Slug = dto.Slug;
        projeto.Titulo = dto.Titulo;
        projeto.Ano = dto.Ano;
        projeto.Tipo = dto.Tipo;
        projeto.Categoria = dto.Categoria;
        projeto.AreaM2 = dto.AreaM2;
        projeto.Localizacao = dto.Localizacao;
        projeto.Duracao = dto.Duracao;
        projeto.Cliente = dto.Cliente;
        projeto.Status = dto.Status;
        projeto.Ferramentas = dto.Ferramentas;
        projeto.DescricaoParagrafos = dto.DescricaoParagrafos;
        projeto.Citacao = dto.Citacao;
        projeto.CapaUrl = dto.CapaUrl;
        projeto.Ordem = dto.Ordem;

        // Substitui a galeria inteira — simples e suficiente para um portfólio pequeno.
        _db.GaleriaItens.RemoveRange(projeto.Galeria);
        projeto.Galeria = dto.Galeria.Select(g => new GaleriaItem
        {
            Url = g.Url,
            Descricao = g.Descricao,
            Ordem = g.Ordem
        }).ToList();

        await _db.SaveChangesAsync();
        return Ok(projeto);
    }

    // DELETE /api/projetos/{id}
    // Remove projeto e cascateia a remoção dos itens da galeria.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Excluir(int id)
    {
        var projeto = await _db.Projetos.FindAsync(id);
        if (projeto == null) return NotFound();

        _db.Projetos.Remove(projeto);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
