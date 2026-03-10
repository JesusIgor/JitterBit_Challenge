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