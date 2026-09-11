# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache icu-libs icu-data-full

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORTS=8080
ENV DOTNET_EnableDiagnostics=0

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=30 \
    CMD wget -q -O - http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "blazor-portfolio.dll"]