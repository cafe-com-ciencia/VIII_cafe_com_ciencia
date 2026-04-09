// ===== FUNÇÃO DE ROLAGEM SUAVE PARA ÂNCORAS (VERSÃO CORRIGIDA) =====
function rolarParaAncora() {
    // Verifica se tem hash na URL (ex: #programacao)
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove o #
        console.log('Hash detectado:', hash); // Log para debug
        
        // Função para encontrar e rolar até o elemento
        function encontrarERolar() {
            const element = document.getElementById(hash);
            
            if (element) {
                console.log('Elemento encontrado, rolando...');
                
                // MÉTODO 1: scrollIntoView com smooth (padrão)
                try {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } catch (e) {
                    console.log('Método 1 falhou, tentando método 2');
                }
                
                // MÉTODO 2: Fallback manual com animação
                setTimeout(() => {
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    const startPosition = window.pageYOffset;
                    const distance = elementPosition - startPosition;
                    const duration = 800; // 800ms
                    let start = null;
                    
                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const progress = Math.min(timeElapsed / duration, 1);
                        
                        // Easing function para suavizar
                        const ease = progress < 0.5 
                            ? 2 * progress * progress 
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                        
                        window.scrollTo(0, startPosition + distance * ease);
                        
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }
                    
                    requestAnimationFrame(animation);
                }, 300);
            } else {
                console.log('Elemento não encontrado ainda, tentando novamente...');
                // Se não encontrou, tenta novamente após um delay
                setTimeout(encontrarERolar, 500);
            }
        }
        
        // Tenta encontrar o elemento imediatamente
        encontrarERolar();
        
        // Tenta novamente após a página carregar
        window.addEventListener('load', function() {
            setTimeout(encontrarERolar, 500);
        });
    }
}

// Função para abrir modal
function openModal(event) {
    event.preventDefault();
    document.getElementById('modalTrabalho').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal
function closeModal() {
    document.getElementById('modalTrabalho').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Fechar modal clicando fora
window.onclick = function(event) {
    var modal = document.getElementById('modalTrabalho');
    if (event.target == modal) {
        closeModal();
    }
}

// Função para abas
function openTab(evt, tabName) {
    var i, tabcontent, tabbtns;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    tabbtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabbtns.length; i++) {
        tabbtns[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Função para cards expansíveis
function toggleCard(cardId) {
    var details = document.getElementById('details-' + cardId);
    var card = document.getElementById('card-' + cardId);
    var btn = card.querySelector('.btn-card i');
    
    if (details.style.maxHeight) {
        details.style.maxHeight = null;
        card.classList.remove('expanded');
        btn.className = 'fas fa-chevron-down';
    } else {
        details.style.maxHeight = details.scrollHeight + "px";
        card.classList.add('expanded');
        btn.className = 'fas fa-chevron-up';
    }
}

// Função para filtro de escolas
function mostrarEscola() {
    var select = document.getElementById('escolaSelect');
    var value = select.value;
    
    // Esconder todas
    var infos = document.getElementsByClassName('escola-info');
    for (var i = 0; i < infos.length; i++) {
        infos[i].classList.remove('active');
    }
    
    // Mostrar a selecionada
    if (value) {
        document.getElementById('info-' + value).classList.add('active');
    }
}

// ===== FUNÇÃO PARA MOSTRAR/ESCONDER CAMPO DE EXPERIMENTO =====
function toggleCampoExperimento() {
    // Aguarda um pouco para garantir que o DOM está carregado
    setTimeout(function() {
        const selectTipo = document.querySelector('select[name="tipo_apresentacao"]');
        const campoExperimento = document.getElementById('campo_experimento');
        
        // Só executa se os elementos existirem na página
        if (selectTipo && campoExperimento) {
            const textarea = document.querySelector('textarea[name="descricao_experimento"]');
            
            // Função para atualizar a visibilidade do campo
            function atualizarCampo() {
                if (selectTipo.value === 'experimento') {
                    campoExperimento.style.display = 'block';
                    if (textarea) textarea.required = true;
                } else {
                    campoExperimento.style.display = 'none';
                    if (textarea) textarea.required = false;
                }
            }
            
            // Executa imediatamente para definir o estado inicial
            atualizarCampo();
            
            // Adiciona evento de mudança
            selectTipo.addEventListener('change', atualizarCampo);
            
            console.log('Campo de experimento configurado com sucesso!');
        } else {
            console.log('Elementos de experimento não encontrados nesta página');
        }
    }, 200);
}

// ===== VALIDAÇÃO DO FORMULÁRIO ANTES DE ENVIAR =====
function setupFormValidation() {
    const form = document.querySelector('form[action*="formsubmit.co"]');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const selectTipo = document.querySelector('select[name="tipo_apresentacao"]');
            const campoExperimento = document.getElementById('campo_experimento');
            const textarea = document.querySelector('textarea[name="descricao_experimento"]');
            
            // Se for experimento, verifica se a descrição foi preenchida
            if (selectTipo && selectTipo.value === 'experimento' && textarea) {
                if (!textarea.value.trim()) {
                    e.preventDefault();
                    alert('Por favor, descreva o experimento que deseja apresentar.');
                    textarea.focus();
                }
            }
        });
    }
}

// Inicializar tudo quando a página carregar
window.onload = function() {
    // Inicializar cards (todos fechados)
    var details = document.getElementsByClassName('card-details');
    for (var i = 0; i < details.length; i++) {
        details[i].style.maxHeight = null;
    }
    
    // Chamar a função de rolagem suave
    setTimeout(rolarParaAncora, 100);
    
    // 🔥 ATIVAR O CAMPO DE EXPERIMENTO
    toggleCampoExperimento();
    
    // 🔥 ATIVAR VALIDAÇÃO DO FORMULÁRIO
    setupFormValidation();
};

// Também executa quando o DOM estiver pronto (para garantir)
document.addEventListener('DOMContentLoaded', function() {
    toggleCampoExperimento();
    setupFormValidation();
});
// ========== FUNÇÕES PARA SEÇÃO CONVIDADOS ==========

// Função para abrir/fechar descrição do convidado
function toggleDescricao(btn) {
    const card = btn.closest('.convidado-card');
    const descricao = card.querySelector('.convidado-descricao');
    
    if (descricao.classList.contains('ativo')) {
        descricao.classList.remove('ativo');
        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Sobre';
    } else {
        // Fecha todas as outras descrições
        document.querySelectorAll('.convidado-descricao').forEach(desc => {
            desc.classList.remove('ativo');
        });
        document.querySelectorAll('.btn-convidado').forEach(b => {
            b.innerHTML = '<i class="fas fa-chevron-down"></i> Sobre';
        });
        
        descricao.classList.add('ativo');
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Fechar';
    }
}

// Função para abrir modal com foto ampliada
function abrirModalFoto(imgElement) {
    const modal = document.getElementById('modalFoto');
    const imgAmpliada = document.getElementById('fotoAmpliada');
    imgAmpliada.src = imgElement.src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Função para fechar modal de foto
function fecharModalFoto() {
    const modal = document.getElementById('modalFoto');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Adicionar evento de clique nas fotos para ampliar
document.addEventListener('DOMContentLoaded', function() {
    const fotos = document.querySelectorAll('.foto-container img');
    fotos.forEach(foto => {
        foto.addEventListener('click', function(event) {
            event.stopPropagation();
            abrirModalFoto(this);
        });
    });
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            fecharModalFoto();
        }
    });
});