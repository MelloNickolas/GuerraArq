using GuerraArq.Api.Controllers.Dtos;
using GuerraArq.Api.Data;
using GuerraArq.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GuerraArq.Api.Controllers;

// Endpoint do registro singleton StudioInfo.
// GET é público e devolve também os contadores calculados (total de projetos, anos).
// PUT é admin e atualiza os campos editáveis.
[ApiController]
[Route("api/studio")]
public class StudioController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudioController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/studio
    // Devolve infos do estúdio + stats calculadas (usado pelo site público).
    [HttpGet]
    public async Task<IActionResult> Obter()
    {
        // Busca o registro singleton (Id=1). Se não existir, cria — proteção extra.
        var info = await _db.StudioInfo.FirstOrDefaultAsync(s => s.Id == 1);
        if (info == null)
        {
            info = new StudioInfo { Id = 1 };
            _db.StudioInfo.Add(info);
            await _db.SaveChangesAsync();
        }

        // Conta quantos projetos estão cadastrados (alimenta o contador da hero).
        var totalProjetos = await _db.Projetos.CountAsync();

        // Calcula anos de estúdio a partir do ano de fundação.
        var anosEstudio = info.AnoFundacao.HasValue
            ? Math.Max(0, DateTime.UtcNow.Year - info.AnoFundacao.Value)
            : 0;

        var dto = new StudioInfoPublicoDto
        {
            Whatsapp = info.Whatsapp,
            Instagram = info.Instagram,
            Pinterest = info.Pinterest,
            Linkedin = info.Linkedin,
            Email = info.Email,
            AnoFundacao = info.AnoFundacao,
            StatCustomLabel = info.StatCustomLabel,
            StatCustomValor = info.StatCustomValor,
            SobreParagrafos = info.SobreParagrafos,
            Servicos = info.Servicos,
            FotoArquitetaUrl = info.FotoArquitetaUrl,
            FotoEstudioUrl = info.FotoEstudioUrl,
            TotalProjetos = totalProjetos,
            AnosDeEstudio = anosEstudio
        };

        return Ok(dto);
    }

    // PUT /api/studio
    // Atualiza o registro singleton. Apenas admin.
    [HttpPut]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Atualizar([FromBody] StudioInfoUpsertDto dto)
    {
        var info = await _db.StudioInfo.FirstOrDefaultAsync(s => s.Id == 1);
        if (info == null)
        {
            info = new StudioInfo { Id = 1 };
            _db.StudioInfo.Add(info);
        }

        // Copia todos os campos editáveis. O Id permanece sempre 1.
        info.Whatsapp = dto.Whatsapp;
        info.Instagram = dto.Instagram;
        info.Pinterest = dto.Pinterest;
        info.Linkedin = dto.Linkedin;
        info.Email = dto.Email;
        info.AnoFundacao = dto.AnoFundacao;
        info.StatCustomLabel = dto.StatCustomLabel;
        info.StatCustomValor = dto.StatCustomValor;
        info.SobreParagrafos = dto.SobreParagrafos;
        info.Servicos = dto.Servicos;
        info.FotoArquitetaUrl = dto.FotoArquitetaUrl;
        info.FotoEstudioUrl = dto.FotoEstudioUrl;

        await _db.SaveChangesAsync();
        return Ok(info);
    }
}
