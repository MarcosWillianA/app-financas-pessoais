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
const limparTudo = document.querySelector('#limpar-tudo');

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

    registrarReceita () {
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
    constructor(quantia, tipo) {
        super(quantia);
        this.tipo = tipo;
    }

    registrarDespesa() {
        let tipoDespesa = descricaoDespesa.value;
        if (descricaoDespesa.value === '') {
            alert('Nome da despesa está faltando');
            return '';
        }
        this.tipo = tipoDespesa;

        let novoValor = parseFloat(despesaQuantia.value);
        if (isNaN(novoValor) || despesaQuantia.value === '') {
            alert('Quantia da despesa está faltando');
            return 0;
        } 
        
        this.quantia += novoValor;
        return {
            tipo: this.tipo,
            quantia: this.quantia
        }
    }
}

const receita = new Receita(0);
const despesa = new Despesa(0);

botaoRegistrarReceita.addEventListener('click', () => {
    let totalReceita = receita.registrarReceita();
    balancoReceita.innerHTML = totalReceita;
    receitaQuantia.value = '';    
})

botaoRegistrarDespesa.addEventListener('click', () => {
    console.log('Clicou na despesa!');
    let totalDespesa = despesa.registrarDespesa();
    balancoDespesa.innerHTML = totalDespesa;
    despesaQuantia.value = '';
})