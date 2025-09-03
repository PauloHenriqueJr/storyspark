# Makefile para StorySpark
.PHONY: help build dev stop clean logs deploy-local test

# Variáveis
COMPOSE_FILE=docker-compose.yml
PROJECT_NAME=storyspark

help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Faz build da imagem Docker
	@echo "🔨 Fazendo build da imagem..."
	docker build -t $(PROJECT_NAME):latest .

dev: ## Inicia ambiente de desenvolvimento
	@echo "🚀 Iniciando ambiente de desenvolvimento..."
	npm run dev

build-docker: ## Faz build e sobe containers
	@echo "🐳 Fazendo build e subindo containers..."
	docker-compose -f $(COMPOSE_FILE) up --build -d

up: ## Sobe containers
	@echo "▶️  Subindo containers..."
	docker-compose -f $(COMPOSE_FILE) up -d

stop: ## Para containers
	@echo "⏹️  Parando containers..."
	docker-compose -f $(COMPOSE_FILE) down

restart: ## Reinicia containers
	@echo "🔄 Reiniciando containers..."
	docker-compose -f $(COMPOSE_FILE) restart

logs: ## Mostra logs dos containers
	@echo "📋 Logs dos containers:"
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-app: ## Mostra logs apenas da aplicação
	@echo "📋 Logs da aplicação:"
	docker-compose -f $(COMPOSE_FILE) logs -f storyspark-app

status: ## Mostra status dos containers
	@echo "📊 Status dos containers:"
	docker-compose -f $(COMPOSE_FILE) ps

clean: ## Remove containers, imagens e volumes
	@echo "🧹 Limpando containers, imagens e volumes..."
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -af

clean-soft: ## Remove apenas containers parados
	@echo "🧽 Limpeza suave..."
	docker container prune -f
	docker image prune -f

deploy-local: ## Deploy local completo
	@echo "🚀 Deploy local completo..."
	make clean
	make build
	make up
	@echo "✅ Deploy concluído!"
	@echo "📱 Aplicação disponível em:"
	@echo "   http://localhost (se configurado proxy local)"

test: ## Executa testes
	@echo "🧪 Executando testes..."
	npm run lint
	npm run type-check
	@echo "✅ Testes concluídos!"

install: ## Instala dependências
	@echo "📦 Instalando dependências..."
	npm install

update: ## Atualiza dependências
	@echo "🔄 Atualizando dependências..."
	npm update

health: ## Verifica saúde dos containers
	@echo "🏥 Verificando saúde dos containers..."
	@for container in $$(docker-compose ps -q); do \
		echo "Container: $$(docker inspect --format='{{.Name}}' $$container)"; \
		docker exec $$container curl -f http://localhost:3000/health.html 2>/dev/null || echo "❌ Health check falhou"; \
	done

backup: ## Faz backup dos volumes (quando aplicável)
	@echo "💾 Fazendo backup..."
	@echo "⚠️  Implementar backup quando volumes persistentes forem adicionados"

restore: ## Restaura backup (quando aplicável)
	@echo "♻️  Restaurando backup..."
	@echo "⚠️  Implementar restore quando volumes persistentes forem adicionados"

# Atalhos úteis
start: up ## Alias para up
down: stop ## Alias para stop
rebuild: clean build up ## Reconstrói tudo

# Comandos de desenvolvimento
dev-setup: ## Setup inicial para desenvolvimento
	@echo "🛠️  Setup inicial para desenvolvimento..."
	make install
	@echo "✅ Setup concluído!"
	@echo "💡 Execute 'make dev' para iniciar o servidor de desenvolvimento"

# Comandos de produção
prod-build: ## Build para produção
	@echo "🏭 Build para produção..."
	npm run build

prod-test: ## Testa build de produção
	@echo "🧪 Testando build de produção..."
	npm run preview
