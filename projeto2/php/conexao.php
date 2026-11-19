<?php
// Ajuste os dados abaixo conforme a configuração do MySQL no seu XAMPP.
$host = '127.0.0.1';
$porta = '3306';
$banco = 'gotogether';
$usuario = 'root';
$senha = '';

try {
    $conexao = new PDO(
        "mysql:host={$host};port={$porta};dbname={$banco};charset=utf8mb4",
        $usuario,
        $senha,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $erro) {
    error_log('Erro de conexão GoTogether: ' . $erro->getMessage());
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Não foi possível conectar ao banco de dados.'
    ]);
    exit;
}
