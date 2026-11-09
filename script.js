
const form = document.getElementById("converterForm");
const amount = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const resultMessage = document.getElementById("resultMessage");
const converterBtn = document.getElementById("converterBtn");

const API_URL = "https://open.er-api.com/v6/latest/";

async function convertMoney(event) {
    event.preventDefault();

    const value = Number(amount.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Verifica se o valor é válido
    if (!Number.isFinite(value) || value <= 0) {
        resultMessage.textContent = "Digite um valor maior que zero.";
        resultMessage.className = "result-message error";
        return;
    }

    // Mostra o carregamento
    loading.hidden = false;

    converterBtn.disabled = true;
    converterBtn.textContent = "Convertendo...";

    result.value = "Aguarde...";
    result.classList.remove("result-ready");

    resultMessage.textContent = "";
    resultMessage.className = "result-message";

    try {
        // Consulta a API
        const response = await fetch(API_URL + from);

        if (!response.ok) {
            throw new Error("Erro ao consultar a API.");
        }

        const data = await response.json();

        if (data.result !== "success" || !data.rates) {
            throw new Error("Não foi possível obter a cotação.");
        }

        // Obtém a cotação da moeda escolhida
        const rate = data.rates[to];

        if (typeof rate !== "number" || !Number.isFinite(rate)) {
            throw new Error("Cotação não encontrada.");
        }

        // Realiza a conversão
        const convertedValue = value * rate;

        // Formata o resultado como moeda
        const formattedResult = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: to
        }).format(convertedValue);

        const formattedAmount = new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 2
        }).format(value);

        // Exibe o resultado
        result.value = formattedResult;

        resultMessage.textContent =
            `${formattedAmount} ${from} = ${formattedResult}`;

        resultMessage.className = "result-message success";

        // Reinicia a animação do resultado
        void result.offsetWidth;
        result.classList.add("result-ready");

    } catch (error) {
        console.error("Erro na conversão:", error);

        result.value = "";

        resultMessage.textContent =
            "Não foi possível realizar a conversão. Verifique sua conexão e tente novamente.";

        resultMessage.className = "result-message error";

    } finally {
        // Esconde o carregamento
        loading.hidden = true;

        // Libera o botão
        converterBtn.disabled = false;
        converterBtn.textContent = "💰 Converter Moeda";
    }
}

// Detecta o envio do formulário
form.addEventListener("submit", convertMoney);
