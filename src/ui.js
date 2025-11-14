/**
 * UI Manager
 * Gerencia toda a renderização e interação de UI
 */

/**
 * Mostra uma tela específica
 * @param {string} screenId - ID da tela
 */
export function showScreen(screenId) {
  // Remove tela ativa anterior
  const activeScreen = document.querySelector('.screen.active');
  if (activeScreen) {
    activeScreen.classList.remove('active');
  }

  // Ativa nova tela
  const screen = document.getElementById(screenId);
  if (screen) {
    screen.classList.add('active');
  }
}

/**
 * Mostra modal
 * @param {string} modalId - ID do modal
 */
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

/**
 * Esconde modal
 * @param {string} modalId - ID do modal
 */
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

/**
 * Renderiza lista de rotas
 * @param {Array} routes - Array de rotas
 * @param {Function} onSelectRoute - Callback ao selecionar
 * @param {Function} onDeleteRoute - Callback ao deletar
 */
export function renderRoutesList(routes, onSelectRoute, onDeleteRoute) {
  const container = document.getElementById('routes-list-container');
  
  if (!routes || routes.length === 0) {
    container.innerHTML = '<p class="empty-message">Nenhuma rota salva ainda</p>';
    return;
  }

  container.innerHTML = routes.map(route => {
    const date = new Date(route.createdAt);
    const dateFormatted = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return `
      <div class="route-card" data-route-id="${route.id}">
        <div class="route-card-name">${escapeHtml(route.name)}</div>
        <div class="route-card-meta">
          <span>📍 ${route.pointsCount || route.points.length} pontos</span>
          <span>📏 ${formatDistance(route.distance || 0)}</span>
          <span>📅 ${dateFormatted}</span>
        </div>
      </div>
    `;
  }).join('');

  // Listeners
  container.querySelectorAll('.route-card').forEach(card => {
    card.addEventListener('click', () => {
      const routeId = parseFloat(card.dataset.routeId);
      if (onSelectRoute) onSelectRoute(routeId);
    });
  });
}

/**
 * Atualiza contagem de pontos
 * @param {number} count - Quantidade de pontos
 */
export function updatePointsCount(count) {
  const element = document.getElementById('points-count');
  if (element) {
    element.textContent = `Pontos: ${count}`;
  }
}

/**
 * Atualiza exibição de distância
 * @param {number} distance - Distância em km
 */
export function updateDistanceDisplay(distance) {
  const element = document.getElementById('distance-display');
  if (element) {
    element.textContent = `Distância: ${formatDistance(distance)}`;
  }
}

/**
 * Renderiza informações da rota
 * @param {Object} route - Dados da rota
 */
export function renderRouteInfo(route) {
  const titleEl = document.getElementById('view-route-title');
  const distanceEl = document.getElementById('view-distance');
  const pointsEl = document.getElementById('view-points');
  const dateEl = document.getElementById('view-date');

  if (titleEl) titleEl.textContent = escapeHtml(route.name);
  if (distanceEl) distanceEl.textContent = formatDistance(route.distance || 0);
  if (pointsEl) pointsEl.textContent = route.pointsCount || route.points.length;
  
  if (dateEl) {
    const date = new Date(route.createdAt);
    dateEl.textContent = date.toLocaleDateString('pt-BR');
  }
}

/**
 * Atualiza informações de navegação
 * @param {Object} status - Status da navegação
 */
export function updateNavigationStatus(status) {
  const nextPointEl = document.getElementById('next-point');
  const distanceEl = document.getElementById('nav-distance');
  const progressEl = document.getElementById('nav-progress');

  if (nextPointEl && status.nextPoint) {
    nextPointEl.textContent = `Próximo: Ponto ${status.currentPointIndex + 2}`;
  }

  if (distanceEl) {
    distanceEl.textContent = `Distância: ${status.remainingDistanceFormatted}`;
  }

  if (progressEl) {
    progressEl.textContent = `Progresso: ${status.progress}%`;
  }
}

/**
 * Mostra notificação toast
 * @param {string} message - Mensagem
 * @param {string} type - Tipo (success, error, warning, info)
 * @param {number} duration - Duração em ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Cria elemento
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    padding: 16px;
    background-color: ${getToastColor(type)};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2000;
    animation: slideUp 0.3s ease;
    font-weight: 500;
  `;

  document.body.appendChild(toast);

  // Remove após duração
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Obtém cor do toast
 * @param {string} type - Tipo
 * @returns {string} Cor
 */
function getToastColor(type) {
  const colors = {
    success: '#1db854',
    error: '#ff4444',
    warning: '#ffaa00',
    info: '#2196F3'
  };
  return colors[type] || colors.info;
}

/**
 * Mostra dialog de confirmação
 * @param {string} title - Título
 * @param {string} message - Mensagem
 * @param {Function} onConfirm - Callback confirm
 * @param {Function} onCancel - Callback cancel
 */
export function showConfirmDialog(title, message, onConfirm, onCancel) {
  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;

  dialog.innerHTML = `
    <div class="modal-content" style="border-radius: 16px; max-width: 300px;">
      <h3>${escapeHtml(title)}</h3>
      <p style="color: #a0a0a0; margin: 16px 0;">${escapeHtml(message)}</p>
      <div class="modal-buttons">
        <button class="btn btn-secondary" id="dialog-cancel">Cancelar</button>
        <button class="btn btn-danger" id="dialog-confirm">Confirmar</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  const cancelBtn = dialog.querySelector('#dialog-cancel');
  const confirmBtn = dialog.querySelector('#dialog-confirm');

  cancelBtn.addEventListener('click', () => {
    dialog.remove();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    dialog.remove();
    if (onConfirm) onConfirm();
  });

  // Fecha ao clicar fora
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove();
      if (onCancel) onCancel();
    }
  });
}

/**
 * Obtém valor de input
 * @param {string} inputId - ID do input
 * @returns {string}
 */
export function getInputValue(inputId) {
  const input = document.getElementById(inputId);
  return input ? input.value.trim() : '';
}

/**
 * Define valor de input
 * @param {string} inputId - ID do input
 * @param {string} value - Valor
 */
export function setInputValue(inputId, value) {
  const input = document.getElementById(inputId);
  if (input) {
    input.value = value;
  }
}

/**
 * Limpa input
 * @param {string} inputId - ID do input
 */
export function clearInput(inputId) {
  setInputValue(inputId, '');
}

/**
 * Ativa/desativa botão
 * @param {string} buttonId - ID do botão
 * @param {boolean} enabled - Habilitado
 */
export function setButtonEnabled(buttonId, enabled) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.disabled = !enabled;
    btn.style.opacity = enabled ? '1' : '0.5';
    btn.style.pointerEvents = enabled ? 'auto' : 'none';
  }
}

/**
 * Escapa caracteres HTML
 * @param {string} text - Texto
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formata distância
 * @param {number} distance - Distância em km
 * @returns {string}
 */
function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(2)} km`;
}

/**
 * Download de arquivo
 * @param {string} content - Conteúdo
 * @param {string} filename - Nome do arquivo
 * @param {string} mimeType - Tipo MIME
 */
export function downloadFile(content, filename, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lê arquivo
 * @param {File} file - Arquivo
 * @returns {Promise<string>}
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}

/**
 * Cria input file oculto e abre diálogo
 * @returns {Promise<File>}
 */
export function openFileDialog() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        resolve(file);
      } else {
        reject(new Error('Arquivo não selecionado'));
      }
    };
    input.click();
  });
}

/**
 * Mostra/esconde botão de instalar PWA
 * @param {boolean} show - Mostrar
 */
export function setInstallButtonVisible(show) {
  const btn = document.getElementById('install-btn');
  if (btn) {
    btn.style.display = show ? 'flex' : 'none';
  }
}

/**
 * Limpa todos os inputs
 */
export function clearAllInputs() {
  document.querySelectorAll('.input').forEach(input => {
    input.value = '';
  });
}

/**
 * Focus em elemento
 * @param {string} elementId - ID do elemento
 */
export function focusElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}
