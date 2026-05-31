$(document).ready(function() {
    const tarefasDoGerente = lerCookie('listaTarefas');

    if (!tarefasDoGerente || tarefasDoGerente.length === 0) {
        $('#listaCampos').html('<p style="color: red;">O gerente não salvou nenhuma tarefa!</p>');
    } else {
        $('#listaCampos').empty();
        tarefasDoGerente.forEach((t) => {
            const checkStatus = t.concluido ? 'checked' : '';
            const campoFuncionario = `
                <div class="campo-grupo">
                    <input type="text" class="input-nome" value="${t.nome}" readonly>
                    <label>
                        <input type="checkbox" class="check-status" ${checkStatus}> Concluído
                    </label>
                </div>`;
            $('#listaCampos').append(campoFuncionario);
        });
    }

    $('#formFuncionario').on('submit', function(event) {
        event.preventDefault();

        const tarefasAtualizadas = [];
        $('.campo-grupo').each(function() {
            tarefasAtualizadas.push({
                nome: $(this).find('.input-nome').val(),
                concluido: $(this).find('.check-status').is(':checked')
            });
        });

        salvarCookie('listaTarefas', tarefasAtualizadas);
        alert('Seu progresso foi salvo nos cookies!');
    });
});
