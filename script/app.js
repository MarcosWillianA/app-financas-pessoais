const receitaQuantia = document.querySelector('#receita-quantia');
const botaoRegistrarReceita = document.querySelector('#registrar-receita');
const descricaoDespesa = document.querySelector('#descricao-despesa');
const despesaQuantia = document.querySelector('#despesa-quantia');
const botaoRegistrarDespesa = document.querySelector('#registrar-despesa');
const balanco = document.querySelector('#balanco');
const balancoReceita = document.querySelector('#balanco-receita');
const balancoDespesa = document.querySelector('#balanco-despesa');
const balancoBalanco = document.querySelector('#balanco-balanco');
const listaGastos = document.querySelector('#lista-gastos');

//---------------------------

class Orcamento {
    constructor(quantia) {
        this.quantia = quantia;
    }

    exibirQuantia() {
        return this.quantia;
    }
}

class Receita extends Orcamento {
    constructor(quantia) {
        super(quantia);
    }

    registrarReceita() {
        let novoValor = parseFloat(receitaQuantia.value);
        if (isNaN(novoValor) || receitaQuantia.value === '') {
            alert('Quantia da receita está faltando');
            return 0;
        }
        this.quantia += novoValor;
        return this.quantia;
    }
}

class Despesa extends Orcamento {
    constructor() {
        super(0);
        this.lista = []; // Inicializa uma lista para as despesas
    }

    registrarDespesa(tipo, valor) {
        this.quantia += valor; // Soma ao total
        this.lista.push({ tipo, valor }); // Adiciona a despesa à lista
        return { tipo, valor };
    }
}

class Balanco {
    constructor(receita, despesa) {
        this.receita = receita;
        this.despesa = despesa;
    }

    calcularBalanco() {
        return this.receita - this.despesa;
    }
}

const receita = new Receita(0);
const despesa = new Despesa();
const balancoObj = new Balanco(receita.quantia, despesa.quantia);

const atualizarBalanco = () => {
    balancoObj.receita = receita.quantia;
    balancoObj.despesa = despesa.quantia;
    balancoBalanco.innerHTML = balancoObj.calcularBalanco();
}

const atualizarTabela = (tipo, valor) => {
    const novaLinha = document.createElement('tr');
    const novoTipo = document.createElement('td');
    const novaQuantia = document.createElement('td');
    const editarGasto = document.createElement('td');
    const excluirGasto = document.createElement('td');

    listaGastos.appendChild(novaLinha);
    novaLinha.appendChild(novoTipo);
    novaLinha.appendChild(novaQuantia);
    novaLinha.appendChild(editarGasto);
    novaLinha.appendChild(excluirGasto);

    novoTipo.innerHTML = tipo;
    novaQuantia.innerHTML = `$${valor.toFixed(2)}`;
    editarGasto.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    excluirGasto.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
}

botaoRegistrarReceita.addEventListener('click', () => {
    let totalReceita = receita.registrarReceita();
    balancoReceita.innerHTML = totalReceita;
    receitaQuantia.value = ''; 
    atualizarBalanco();
})

botaoRegistrarDespesa.addEventListener('click', () => {
    let tipoDespesa = descricaoDespesa.value;
    let valorDespesa = parseFloat(despesaQuantia.value);
    
    if (isNaN(valorDespesa) || despesaQuantia.value === '' || tipoDespesa === '') {
        alert('Por favor, preencha o tipo e a quantia da despesa');
        return;
    }

    let novaDespesa = despesa.registrarDespesa(tipoDespesa, valorDespesa);
    balancoDespesa.innerHTML = despesa.quantia; // Total de despesas
    descricaoDespesa.value = '';
    despesaQuantia.value = '';
    atualizarBalanco();
    atualizarTabela(novaDespesa.tipo, novaDespesa.valor);
});
