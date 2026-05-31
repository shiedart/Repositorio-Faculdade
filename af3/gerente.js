$(document).ready(function() {
    const tarefasSalvas = lerCookie('listaTarefas');
    if(tarefasSalvas && tarefasSalvas.length > 0) {
        $('#listaCampos').empty(); 
        tarefasSalvas.forEach(t => adicionarLinhaTarefa(t.nome, t.concluido));
    }

    $('#btnAdicionar').on('click', function() {
        adicionarLinhaTarefa('', false);
    });

    $('#listaCampos').on('click', '.btn-remover', function() {
        $(this).closest('.campo-grupo').remove();
    });

    function adicionarLinhaTarefa(nome, concluido) {
        const checkStatus = concluido ? 'checked' : '';
        const novoCampo = `
            <div class="campo-grupo">
                <input type="text" class="input-nome" placeholder="Digite a tarefa" value="${nome}" required>
                <label>
                    <input type="checkbox" class="check-status" ${checkStatus}> Ativo
                </label>
                <button type="button" class="btn-remover">Remover</button>
            </div>`;
        $('#listaCampos').append(novoCampo);
    }

    $('#meuFormulario').on('submit', function(event) {
        event.preventDefault();
        
        const tarefas = [];
        $('.campo-grupo').each(function() {
            const campoTexto = $(this).find('input[type="text"]');
            const campoCheck = $(this).find('input[type="checkbox"]');

            if (campoTexto.length > 0) {
                tarefas.push({
                    nome: campoTexto.val().trim(),
                    concluido: campoCheck.is(':checked')
                });
            }
        });

        salvarCookie('listaTarefas', tarefas);
        alert('Lista de tarefas atualizada com sucesso para os funcionários!');
    });
});
