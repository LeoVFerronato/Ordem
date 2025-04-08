function calcularTotal() {
    const quantidadeHoras = parseFloat(document.getElementById('quantidadeHoras').value);
    const valorHora = parseFloat(document.getElementById('valorHora').value);
    const valorTotalInput = document.getElementById('valorTotal');

    if (!isNaN(quantidadeHoras) && !isNaN(valorHora)) {
        const valorTotal = quantidadeHoras * valorHora;
        valorTotalInput.value = valorTotal.toFixed(2);
    } else {
        valorTotalInput.value = '0.00';
    }
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Informações da empresa
    const nomeEmpresa = "Ferronato TerraMax";
    const cnpjEmpresa = "53.667.753/0001-11";
    const tituloOS = "Ordem de Serviço";
    
    // Adiciona o cabeçalho
    pdf.setFontSize(16);
    pdf.text(nomeEmpresa, 10, 15); // Posição x=10, y=15
    pdf.setFontSize(10);
    pdf.text(`CNPJ: ${cnpjEmpresa}`, 10, 22);
    pdf.setFontSize(18);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const tituloWidth = pdf.getTextWidth(tituloOS);
    const tituloX = (pageWidth - tituloWidth) / 2;
    pdf.text(tituloOS, tituloX, 35);

    const nomeCliente = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('endereco').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const quantidadeHoras = document.getElementById('quantidadeHoras').value;
    const valorHora = parseFloat(document.getElementById('valorHora').value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const valorTotal = parseFloat(document.getElementById('valorTotal').value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Formatação das datas para DD/MM/AAAA (manipulando a string ISO)
    const formatarData = (dataISO) => {
        if (dataISO) {
            // Adiciona informação de hora para forçar interpretação local
            const dataLocalString = `${dataISO}T00:00:00`;
            const data = new Date(dataLocalString);
            const formatoBrasil = new Intl.DateTimeFormat('pt-BR');
            return formatoBrasil.format(data);
        }
        return '';
    };


    const dataInicioFormatada = formatarData(dataInicio);
    const dataFimFormatada = formatarData(dataFim);


    const data = [
        ["Nome do Cliente", nomeCliente],
        ["Endereço", endereco],
        ["Data de Início", dataInicioFormatada],
        ["Data de Fim", dataFimFormatada],
        ["Quantidade de Horas", quantidadeHoras],
        ["Valor da Hora (R$)", valorHora],
        ["Valor Total (R$)", valorTotal],
        ["Assinatura do cliente", ""]
    ];

    pdf.autoTable({
        head: [['', '']], // O cabeçalho da tabela
        body: data,
        startY: 45, // Posição inicial da tabela
        theme: 'grid', // Tema da tabela
        styles: {
            rowHeight: 15,
        },
        columnStyles: {
            0: { cellWidth: 40 }, // Largura da primeira coluna (ID)
            1: { cellWidth: 'auto' }
        }
    });

    pdf.save('ordem_de_servico_' + nomeCliente + '.pdf');
}