# Dockerfile multi-stage para deploy no Render.
# Stage 1: builda o projeto. Stage 2: imagem final só com runtime (menor).

# === Build stage ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia o csproj primeiro pra cachear o restore do NuGet.
COPY *.csproj .
RUN dotnet restore

# Copia o resto do código e publica o binário em /app/publish.
COPY . .
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# === Runtime stage (imagem final) ===
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Render injeta a porta na variável PORT — ASP.NET ouve aqui.
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}
EXPOSE 8080

ENTRYPOINT ["dotnet", "GuerraArq.Api.dll"]
