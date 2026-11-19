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

require_once __DIR__ . '/conexao.php';

$nome = trim($_POST['nome'] ?? '');
$sobrenome = trim($_POST['sobrenome'] ?? '');
$cpf = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
$nascimento = trim($_POST['nascimento'] ?? '');
$genero = trim($_POST['genero'] ?? '');
$celular = trim($_POST['celular'] ?? '');
$cep = trim($_POST['cep'] ?? '');
$logradouro = trim($_POST['logradouro'] ?? '');
$numero = trim($_POST['numero'] ?? '');
$complemento = trim($_POST['complemento'] ?? '');
$bairro = trim($_POST['bairro'] ?? '');
$cidade = trim($_POST['cidade'] ?? '');
$uf = strtoupper(trim($_POST['uf'] ?? ''));
$email = strtolower(trim($_POST['email'] ?? ''));
$senha = $_POST['senha'] ?? '';
$confirmarSenha = $_POST['confirmarSenha'] ?? '';

if (
    !$nome || !$sobrenome || strlen($cpf) !== 11 || !$nascimento || !$genero ||
    !$celular || !$cep || !$logradouro || !$numero || !$bairro || !$cidade ||
    strlen($uf) !== 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    responder(422, false, 'Preencha corretamente todos os campos obrigatórios.');
}

if ($senha !== $confirmarSenha) {
    responder(422, false, 'As senhas não coincidem.');
}

if (
    strlen($senha) < 8 ||
    !preg_match('/[A-Z]/', $senha) ||
    !preg_match('/[a-z]/', $senha) ||
    !preg_match('/[0-9]/', $senha) ||
    !preg_match('/[^a-zA-Z0-9\s]/', $senha)
) {
    responder(422, false, 'A senha deve ter pelo menos 8 caracteres, com maiúscula, minúscula, número e caractere especial.');
}

try {
    $conexao->beginTransaction();

    $verificar = $conexao->prepare('SELECT id FROM usuarios WHERE email = :email OR cpf = :cpf LIMIT 1');
    $verificar->execute(['email' => $email, 'cpf' => $cpf]);

    if ($verificar->fetch()) {
        $conexao->rollBack();
        responder(409, false, 'Este e-mail ou CPF já está cadastrado.');
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    $inserirUsuario = $conexao->prepare(
        'INSERT INTO usuarios (nome, sobrenome, cpf, nascimento, genero, celular, email, senha)
         VALUES (:nome, :sobrenome, :cpf, :nascimento, :genero, :celular, :email, :senha)'
    );
    $inserirUsuario->execute([
        'nome' => $nome,
        'sobrenome' => $sobrenome,
        'cpf' => $cpf,
        'nascimento' => $nascimento,
        'genero' => $genero,
        'celular' => $celular,
        'email' => $email,
        'senha' => $senhaHash
    ]);

    $usuarioId = (int) $conexao->lastInsertId();

    $inserirEndereco = $conexao->prepare(
        'INSERT INTO enderecos (usuario_id, cep, logradouro, numero, complemento, bairro, cidade, uf)
         VALUES (:usuario_id, :cep, :logradouro, :numero, :complemento, :bairro, :cidade, :uf)'
    );
    $inserirEndereco->execute([
        'usuario_id' => $usuarioId,
        'cep' => $cep,
        'logradouro' => $logradouro,
        'numero' => $numero,
        'complemento' => $complemento !== '' ? $complemento : null,
        'bairro' => $bairro,
        'cidade' => $cidade,
        'uf' => $uf
    ]);

    $conexao->commit();
    responder(201, true, 'Cadastro realizado com sucesso! Agora você pode entrar na sua conta.');
} catch (PDOException $erro) {
    if ($conexao->inTransaction()) {
        $conexao->rollBack();
    }
    error_log('Erro no cadastro GoTogether: ' . $erro->getMessage());
    responder(500, false, 'Ocorreu um erro ao salvar o cadastro. Confira se as tabelas do banco estão criadas corretamente.');
}
