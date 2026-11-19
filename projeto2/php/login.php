<?php
header('Content-Type: application/json; charset=utf-8');

function responder(int $status, bool $sucesso, string $mensagem): void {
    http_response_code($status);
    echo json_encode(['sucesso' => $sucesso, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, false, 'Método não permitido.');
}

$dados = json_decode(file_get_contents('php://input'), true);
$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $senha === '') {
    responder(422, false, 'Informe um e-mail válido e sua senha.');
}

require_once __DIR__ . '/conexao.php';

try {
    $consulta = $conexao->prepare('SELECT id, nome, email, senha FROM usuarios WHERE email = :email LIMIT 1');
    $consulta->execute(['email' => $email]);
    $usuario = $consulta->fetch();

    if (!$usuario || !password_verify($senha, $usuario['senha'])) {
        responder(401, false, 'E-mail ou senha incorretos.');
    }

    session_start();
    session_regenerate_id(true);
    $_SESSION['usuario_id'] = (int) $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];
    $_SESSION['usuario_email'] = $usuario['email'];

    responder(200, true, 'Login realizado com sucesso!');
} catch (PDOException $erro) {
    error_log('Erro no login GoTogether: ' . $erro->getMessage());
    responder(500, false, 'Não foi possível realizar o login agora.');
}
