FROM alpine:latest

# Install .NET 10 runtime dependencies
RUN apk add --no-cache \
    bash \
    wget \
    ca-certificates \
    icu-libs \
    libgcc \
    libstdc++ \
    zlib \
    openssl

# Download and install .NET 10 aspnetcore runtime
RUN mkdir -p /usr/local/bin/dotnet && \
    wget -q https://builds.dotnet.microsoft.com/dotnet/aspnetcore/Runtime/10.0.9/aspnetcore-runtime-10.0.9-linux-musl-x64.tar.gz -O /tmp/dotnet.tar.gz && \
    tar -xzf /tmp/dotnet.tar.gz -C /usr/local/bin/dotnet && \
    rm /tmp/dotnet.tar.gz

WORKDIR /app
COPY publish .

EXPOSE 8080
ENV ASPNETCORE_HTTP_PORT=8080
ENV DOTNET_EnableDiagnostics=0
ENV PATH="/usr/local/bin/dotnet:$PATH"

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=30 \
    CMD wget -q -O - http://localhost:8080/health || exit 1

ENTRYPOINT ["/usr/local/bin/dotnet/dotnet", "blazor-portfolio.dll"]
