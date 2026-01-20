# Vehicle Reservation API

API para gerenciamento de reservas de veículos construída com NestJS, MongoDB e autenticação JWT.

## Tecnologias

- **NestJS** - Framework Node.js
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Docker** - Containerização

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior / Utilizada a versão 20.19.6 )
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/)

---

## Configuração e Execução

### Opção 1: Com Docker (Recomendado)

**1. Clone o repositório e acesse a pasta:**

```bash
git clone <url-do-repositorio>
cd vehicle-reservation-api
```

**2. Suba os containers:**

```bash
docker-compose up -d
```

**3. Acesse a aplicação:**

- API: http://localhost:3000

**4. Para parar os containers:**

```bash
docker-compose down
```

---

### Opção 2: Desenvolvimento Local (sem Docker)

**1. Clone o repositório e acesse a pasta:**

```bash
git clone <url-do-repositorio>
cd vehicle-reservation-api
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database Configuration
MONGODB_URI=mongodb://root:root@localhost:27017/vehicle-reservation?authSource=admin

# Application Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Password Hashing
SALT_ROUNDS=10

# JWT Configuration
JWT_SECRET=sua-chave-secreta-aqui
JWT_EXPIRATION=86400
```

**4. Inicie o MongoDB:**

Se você não tem o MongoDB instalado localmente, pode usar Docker apenas para o banco:

```bash
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root mongo:latest
```

**5. Execute a aplicação:**

```bash
# Modo desenvolvimento (com hot-reload)
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

**6. Acesse a aplicação:**

- API: http://localhost:3000

---

## Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `MONGODB_URI` | String de conexão com o MongoDB | - |
| `PORT` | Porta da aplicação | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `FRONTEND_URL` | URL do frontend (para CORS) | `http://localhost:4200` |
| `SALT_ROUNDS` | Rounds para hash de senha (bcrypt) | `10` |
| `JWT_SECRET` | Chave secreta para tokens JWT | - | `sua-chave-secreta` |
| `JWT_EXPIRATION` | Tempo de expiração do token (segundos) | `86400` (24h) |

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Inicia com hot-reload

# Produção
npm run build          # Compila o projeto
npm run start:prod     # Inicia em modo produção
```

---

## Documentação da API

A documentação interativa da API está disponível via Swagger em:

```
http://localhost:3000/api/docs
```

---

## Estrutura do Projeto

```
vehicle-reservation-api/
├── src/
│   ├── modules/          # Módulos da aplicação
│   ├── database/         # Módulo do banco de dados
│   ├── common/           # Recursos compartilhados
│   └── main.ts           # Ponto de entrada
├── test/                 # Testes e2e
├── docker-compose.yml    # Configuração Docker
├── Dockerfile            # Imagem Docker
└── .env                  # Variáveis de ambiente
```
