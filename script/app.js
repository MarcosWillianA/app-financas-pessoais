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
const botaoLimparTudo = document.querySelector('#limpar-tudo');

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
        this.salvarNoLocalStorage();
        return this.quantia;
    }

    limparReceita() {
        this.quantia = 0;
        this.salvarNoLocalStorage();
    }

    salvarNoLocalStorage() {
        localStorage.setItem('receita', this.quantia);
    }
}

class Despesa extends Orcamento {
    constructor() {
        super(0);
        this.lista = []; 
        this.carregarDoLocalStorage();
    }

    registrarDespesa(tipo, valor) {
        this.quantia += valor;  
        this.lista.push({ tipo, valor });
        this.salvarNoLocalStorage();
        return { tipo, valor };
    }

    limparDespesa() {
        this.quantia = 0
        this.lista = [];
        this.salvarNoLocalStorage();
    }

    salvarNoLocalStorage() {
        localStorage.setItem('despesa', JSON.stringify(this.lista));
    }

    carregarDoLocalStorage() {
        const despesasSalvas = JSON.parse(localStorage.getItem('despesa'));
        this.lista = Array.isArray(despesasSalvas) ? despesasSalvas : [];
        this.quantia = this.lista.reduce((total, despesa) => total + despesa.valor, 0);
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

    limparBalanco() {
        this.receita = 0;
        this.despesa = 0;
    }

    salvarNoLocalStorage() {
        localStorage.setItem('balanco', JSON.stringify({receita: this.receita, despesa: this.despesa}));
    }

    carregarDoLocalStorage() {
        const balancoSalvo = JSON.parse(localStorage.getItem('balanco'));
        if (balancoSalvo) {
            this.receita = balancoSalvo.receita;
            this.despesa = balancoSalvo.despesa;
        }
    }
}

const receita = new Receita(parseFloat(localStorage.getItem('receita')) || 0);
const despesa = new Despesa();
despesa.carregarDoLocalStorage();
const balancoObj = new Balanco(receita.quantia, despesa.quantia);
balancoObj.carregarDoLocalStorage();

const atualizarBalanco = () => {
    balancoObj.receita = receita.quantia;
    balancoObj.despesa = despesa.quantia;
    balancoBalanco.innerHTML = `$${balancoObj.calcularBalanco().toFixed(2)}`;
    balancoObj.salvarNoLocalStorage();
}

const atualizarTabela = (tipo, valor) => {
    const novaLinha = document.createElement('tr');
    const novoTipo = document.createElement('td');
    const novaQuantia = document.createElement('td');
    const excluirGasto = document.createElement('td');

    listaGastos.appendChild(novaLinha);
    novaLinha.appendChild(novoTipo);
    novaLinha.appendChild(novaQuantia);
    novaLinha.appendChild(excluirGasto);

    novoTipo.innerHTML = tipo;
    novaQuantia.innerHTML = `$${valor.toFixed(2)}`;
    excluirGasto.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    excluirGasto.addEventListener('click', () => {
        const valorDespesa = parseFloat(novaQuantia.innerHTML.replace('$', ''));
        const tipoDespesa = novoTipo.innerHTML;
        const index = despesa.lista.findIndex(item => item.valor === valorDespesa && item.tipo === tipoDespesa);
        if (index !== -1) {
            despesa.lista.splice(index, 1);
        }
        despesa.quantia -= valorDespesa;
        balancoDespesa.innerHTML = despesa.quantia.toFixed(2); 
        listaGastos.removeChild(novaLinha);
        despesa.salvarNoLocalStorage();
        atualizarBalanco();
    }); 
}

despesa.lista.forEach(item => {
    atualizarTabela(item.tipo, item.valor);
});

balancoReceita.innerHTML = receita.quantia.toFixed(2);
balancoDespesa.innerHTML = despesa.quantia.toFixed(2);
atualizarBalanco();

botaoRegistrarReceita.addEventListener('click', () => {
    let totalReceita = receita.registrarReceita();
    balancoReceita.innerHTML = totalReceita.toFixed(2);
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
    balancoDespesa.innerHTML = despesa.quantia.toFixed(2); 
    descricaoDespesa.value = '';
    despesaQuantia.value = '';
    atualizarBalanco();
    atualizarTabela(novaDespesa.tipo, novaDespesa.valor);
});

botaoLimparTudo.addEventListener('click', () => {
    listaGastos.innerHTML = '';
    receita.limparReceita();
    despesa.limparDespesa();
    balancoObj.limparBalanco();
    atualizarBalanco();
    balancoReceita.innerHTML = '0';
    balancoDespesa.innerHTML = '0';
    receitaQuantia.value = '';
    descricaoDespesa.value = '';
    despesaQuantia.value = '';
    localStorage.clear();
})