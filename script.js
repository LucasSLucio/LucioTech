document.addEventListener('DOMContentLoaded', () => {
  const imgLogo = document.getElementById('img-logo');
  const textLogo = document.getElementById('text-logo');

  if (imgLogo) {
    imgLogo.addEventListener('error', () => {
      imgLogo.style.display = 'none';
      if (textLogo) {
        textLogo.classList.remove('hidden');
      }
    });
  }

  const cepInput = document.getElementById('cep');
  const localidadeInput = document.getElementById('localidade');
  const logradouroInput = document.getElementById('logradouro');
  const loaderCep = document.getElementById('loaderCep');
  const cepError = document.getElementById('cepError');

  function limparCamposEndereco() {
    if (localidadeInput) localidadeInput.value = '';
    if (logradouroInput) logradouroInput.value = '';
  }

  if (cepInput) {
    cepInput.addEventListener('blur', function () {
      const cep = this.value.replace(/\D/g, ''); // Limpa caracteres não numéricos

      if (cep.length === 8) {
       
        if (loaderCep) loaderCep.style.display = 'block';
        if (cepError) cepError.classList.add('hidden');

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then((response) => response.json())
          .then((data) => {
            if (data.erro) {
              if (cepError) cepError.classList.remove('hidden');
              limparCamposEndereco();
            } else {
              if (localidadeInput) localidadeInput.value = `${data.localidade} / ${data.uf}`;
              if (logradouroInput) {
                logradouroInput.value = `${data.logradouro}${data.bairro ? ' - ' + data.bairro : ''}`;
              }
            }
          })
          .catch(() => {
            alert('Não foi possível conectar ao serviço de busca de CEP.');
            limparCamposEndereco();
          })
          .finally(() => {
            if (loaderCep) loaderCep.style.display = 'none';
          });
      } else if (cep.length > 0) {
        if (cepError) cepError.classList.remove('hidden');
        limparCamposEndereco();
      }
    });
  }

  const form = document.getElementById('suporteForm');
  const modal = document.getElementById('sucessoModal');
  const fecharModal = document.getElementById('fecharModal');

  if (form && modal) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Impede o reload padrão
      modal.classList.remove('hidden');
      form.reset();
    });
  }

  if (fecharModal && modal) {
    fecharModal.addEventListener('click', function () {
      modal.classList.add('hidden');
    });
  }
});