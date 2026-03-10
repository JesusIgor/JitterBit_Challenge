COMANDOS NECESSARIOS PARA RODAR A API

cd api
npm install
npx prisma generate
npm run dev
(Criar a pasta .env para plugar a string de conexao, seguindo o exemplo deixado na raíz)

##==============================================================================
OBS: Os critérios opcionais do desafio (Middleware e Swagger) foram criados com auxilio de IA

Necessario realizar um post na rota de login e utilizar o token nas rotas '/order'
JWT-KEY esta tanto no .env, quanto hardcodada como fallback
Swagger adicionado somente às rotas de '/health' e '/login'
##==============================================================================

Queries usadas para DB

CREATE TABLE [Order] (
    orderId VARCHAR(50) PRIMARY KEY,
    value DECIMAL(18,2) NOT NULL,
    creationDate DATETIME2 NOT NULL
);

CREATE TABLE Items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    orderId VARCHAR(50) NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(18,2) NOT NULL,

    CONSTRAINT FK_Items_Order
        FOREIGN KEY (orderId)
        REFERENCES [Order](orderId)
        ON DELETE CASCADE
);

INSERT INTO [Order] (orderId, value, creationDate)
VALUES ('v10089016vdb', 10000, GETDATE());

INSERT INTO Items (orderId, productId, quantity, price)
VALUES ('v10089016vdb', 2434, 1, 1000);

##=============================================================================================
##Modelos criados a partir do prisma
-prisma db pull 

##Controladores criados
-OrderController.create
Recebe o JSON da requisicao em /order, valida campos obrigatorios, chama o mapper para converter os campos e salva o pedido com os itens no banco.

-OrderController.getById
Busca um pedido pelo orderId em /order/:orderId e retorna 404 quando nao encontra.

-OrderController.list
Lista todos os pedidos em /order/list com os itens.

-OrderController.update
Atualiza value e creationDate do pedido em /order/:orderId e, quando vier items no body, recria os itens do pedido com os novos valores.

-OrderController.delete
Remove o pedido em /order/:orderId e retorna mensagem de sucesso.

##Mapper criado
-OrderMapper.toDB
Pega os dados da requisicao e monta no formato do banco.

-OrderMapper.toResponse
Pega os dados do banco e retorna no formato da resposta da API.

##Autenticacao JWT
-POST /login
Envia {"username":"admin","password":"admin123"} e recebe um token JWT.

-Usar o token
Adicionar header: Authorization: Bearer {token}

-Endpoints protegidos
Todos os /order precisam do token JWT.

##Documentacao da API
-http://localhost:3000/api-docs
Swagger com todos os endpoints documentados.