-- =========================================
-- BANCO DE DADOS GOTogether
-- =========================================

CREATE DATABASE IF NOT EXISTS gotogether;

USE gotogether;


-- =========================================
-- 1. TABELA DE USUARIOS
-- =========================================

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    nascimento DATE NOT NULL,
    genero VARCHAR(30) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. TABELA DE ENDERECOS
-- =========================================

CREATE TABLE enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


-- =========================================
-- 3. TABELA DE VIAGENS
-- =========================================

CREATE TABLE viagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(80) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    quantidade_pessoas INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    orcamento_por_pessoa DECIMAL(10,2) NOT NULL,
    transporte VARCHAR(30) NOT NULL,
    hospedagem VARCHAR(120),
    descricao TEXT NOT NULL,
    status ENUM('planejamento', 'concluida')
        DEFAULT 'planejamento',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


-- =========================================
-- 4. TABELA DE PARTICIPANTES
-- =========================================

CREATE TABLE participantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT NOT NULL,
    usuario_id INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (viagem_id)
        REFERENCES viagens(id)
        ON DELETE CASCADE,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    UNIQUE (viagem_id, usuario_id)
);


-- =========================================
-- 5. TABELA DE ROTEIROS
-- =========================================

CREATE TABLE roteiros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT NOT NULL,
    atividade VARCHAR(150) NOT NULL,
    local VARCHAR(150),
    descricao TEXT,
    data_atividade DATE,
    custo_estimado DECIMAL(10,2),

    FOREIGN KEY (viagem_id)
        REFERENCES viagens(id)
        ON DELETE CASCADE
);


-- =========================================
-- 6. TABELA DE DESPESAS
-- =========================================

CREATE TABLE despesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    viagem_id INT NOT NULL,
    usuario_id INT NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_despesa DATE NOT NULL,

    FOREIGN KEY (viagem_id)
        REFERENCES viagens(id)
        ON DELETE CASCADE,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


-- =========================================
-- CONSULTAR AS TABELAS CRIADAS
-- =========================================

SHOW TABLES;
