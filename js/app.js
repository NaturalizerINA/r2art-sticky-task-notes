/**
 * R2Art Sticky Task Notes - Main Application Controller
 * Orchestrates UI interactions, Modals, Filters, Search, PNG Export, and Shortcuts
 */

const App = {
  activeDoodleData: null,
  activeEditingId: null,

  init() {
    // 1. Initialize Submodules
    window.I18N.init();
    window.SoundFX.init();
    window.NoteEngine.init();
    window.BoardManager.init();
    window.PomodoroTimer.init();
    window.DoodleStudio.init();

    // 2. Load User Settings
    this.applySettings();

    // 3. Bind UI Events & Listeners
    this.bindGlobalEvents();
    this.bindModalEvents();
    this.bindToolbarEvents();
    this.bindShortcuts();

    // 4. Initial Render
    this.refreshTagsFilter();
    window.BoardManager.render();
  },

  applySettings() {
    const settings = window.Storage.loadSettings();
    
    // Apply Theme
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.textContent = settings.theme === 'dark' ? '☀️' : '🌙';
    }

    // Apply View
    if (settings.viewMode) {
      window.BoardManager.setView(settings.viewMode);
    }

    // Apply Sound State
    const soundIcon = document.getElementById('soundIcon');
    if (soundIcon) {
      soundIcon.textContent = settings.sound ? '🔊' : '🔇';
    }
  },

  bindGlobalEvents() {
    // Language Switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang) {
          window.I18N.setLang(lang);
          this.refreshTagsFilter();
          window.BoardManager.render();
        }
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);

        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
          themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
        }

        const settings = window.Storage.loadSettings();
        settings.theme = next;
        window.Storage.saveSettings(settings);
      });
    }

    // Sound FX Toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const enabled = window.SoundFX.toggleSound();
        const soundIcon = document.getElementById('soundIcon');
        if (soundIcon) {
          soundIcon.textContent = enabled ? '🔊' : '🔇';
        }
        const settings = window.Storage.loadSettings();
        settings.sound = enabled;
        window.Storage.saveSettings(settings);
        this.showToast(enabled ? window.I18N.t('soundOn') : window.I18N.t('soundOff'));
      });
    }

    // Global Click Delegation for Sticky Note Interactions
    document.addEventListener('click', (e) => {
      // 1. Checklist checkbox click
      const chkInput = e.target.closest('input[type="checkbox"][data-checklist-id]');
      if (chkInput) {
        const noteCard = chkInput.closest('.sticky-note');
        const noteId = noteCard?.getAttribute('data-id');
        const chkId = chkInput.getAttribute('data-checklist-id');
        if (noteId && chkId) {
          window.NoteEngine.toggleChecklist(noteId, chkId);
          window.BoardManager.render();
        }
        return;
      }

      // 2. Edit note button
      const editBtn = e.target.closest('.btn-note-edit');
      if (editBtn) {
        const noteId = editBtn.getAttribute('data-id');
        this.openNoteModal(noteId);
        return;
      }

      // 3. Delete note button
      const delBtn = e.target.closest('.btn-note-delete');
      if (delBtn) {
        const noteId = delBtn.getAttribute('data-id');
        if (noteId) {
          window.NoteEngine.deleteNote(noteId);
          this.refreshTagsFilter();
          window.BoardManager.render();
          this.showToast(window.I18N.t('toastNoteDeleted'));
        }
        return;
      }

      // 4. Duplicate note button
      const dupBtn = e.target.closest('.btn-note-duplicate');
      if (dupBtn) {
        const noteId = dupBtn.getAttribute('data-id');
        if (noteId) {
          window.NoteEngine.duplicateNote(noteId);
          this.refreshTagsFilter();
          window.BoardManager.render();
          this.showToast(window.I18N.t('toastNoteDuplicated'));
        }
        return;
      }

      // 5. Pomodoro Link Task
      const pomoBtn = e.target.closest('.btn-pomo-link');
      if (pomoBtn) {
        const noteId = pomoBtn.getAttribute('data-id');
        const note = window.NoteEngine.getNoteById(noteId);
        if (note) {
          window.PomodoroTimer.linkTask(note.id, note.title);
        }
        return;
      }

      // 6. Tag Chip Click Filter
      const tagChip = e.target.closest('.tag-chip');
      if (tagChip) {
        const tag = tagChip.getAttribute('data-tag');
        if (tag) {
          this.setTagFilter(tag);
        }
        return;
      }
    });
  },

  bindToolbarEvents() {
    // New Note Button
    document.getElementById('btnNewNote')?.addEventListener('click', () => {
      this.openNoteModal();
    });

    // Quick Add Button in column or header
    document.getElementById('btnQuickAdd')?.addEventListener('click', () => {
      const note = window.NoteEngine.createNote({
        title: window.I18N.t('placeholderTitle') || 'Quick Task',
        color: 'lemon',
        status: 'todo'
      });
      this.refreshTagsFilter();
      window.BoardManager.render();
      this.openNoteModal(note.id);
    });

    // Search Input with Debounce
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        window.NoteEngine.searchQuery = e.target.value;
        window.BoardManager.render();
      });
    }

    // Sort Selector
    const sortSelect = document.getElementById('sortBySelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        window.NoteEngine.sortBy = e.target.value;
        window.BoardManager.render();
      });
    }

    // Filter Selectors
    document.getElementById('filterPrioritySelect')?.addEventListener('change', (e) => {
      window.NoteEngine.activeFilterPriority = e.target.value;
      window.BoardManager.render();
    });

    document.getElementById('filterColorSelect')?.addEventListener('change', (e) => {
      window.NoteEngine.activeFilterColor = e.target.value;
      window.BoardManager.render();
    });

    document.getElementById('filterStatusSelect')?.addEventListener('change', (e) => {
      window.NoteEngine.activeFilterStatus = e.target.value;
      window.BoardManager.render();
    });

    // Pomodoro Trigger Button
    document.getElementById('btnTogglePomodoro')?.addEventListener('click', () => {
      window.PomodoroTimer.toggleWidget();
    });

    // Stats Modal Trigger
    document.getElementById('btnOpenStats')?.addEventListener('click', () => {
      this.openStatsModal();
    });

    // Export / Import Trigger
    document.getElementById('btnOpenExport')?.addEventListener('click', () => {
      this.openExportModal();
    });
  },

  bindShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore shortcut if user is typing inside an input/textarea
      const isInputActive = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

      if (e.key === 'Escape') {
        this.closeAllModals();
        return;
      }

      if (isInputActive) return;

      // 'N' for New Note
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        this.openNoteModal();
      }

      // '/' to focus Search
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('globalSearchInput')?.focus();
      }

      // 'T' for Pomodoro Timer
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        window.PomodoroTimer.toggleWidget();
      }
    });
  },

  refreshTagsFilter() {
    const container = document.getElementById('tagsFilterChips');
    if (!container) return;

    container.innerHTML = '';
    const allNotes = window.NoteEngine.getAllNotes();
    const tagCounts = {};

    allNotes.forEach(n => {
      (n.tags || []).forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    // "All" chip
    const allBtn = document.createElement('button');
    allBtn.className = `filter-chip ${!window.NoteEngine.activeFilterTag ? 'active' : ''}`;
    allBtn.textContent = window.I18N.t('filterAll');
    allBtn.addEventListener('click', () => {
      this.setTagFilter(null);
    });
    container.appendChild(allBtn);

    Object.keys(tagCounts).sort().forEach(tag => {
      const chip = document.createElement('button');
      chip.className = `filter-chip ${window.NoteEngine.activeFilterTag === tag ? 'active' : ''}`;
      chip.innerHTML = `#${tag} <span class="chip-count">${tagCounts[tag]}</span>`;
      chip.addEventListener('click', () => {
        this.setTagFilter(window.NoteEngine.activeFilterTag === tag ? null : tag);
      });
      container.appendChild(chip);
    });
  },

  setTagFilter(tag) {
    window.NoteEngine.activeFilterTag = tag;
    this.refreshTagsFilter();
    window.BoardManager.render();
    if (tag) {
      this.showToast(window.I18N.t('toastTagFiltered', { tag }));
    } else {
      this.showToast(window.I18N.t('toastClearedFilter'));
    }
  },

  /* ==========================================================================
     Note Creation & Edit Modal
     ========================================================================== */
  bindModalEvents() {
    const modal = document.getElementById('noteEditModal');
    if (!modal) return;

    document.getElementById('noteModalCloseBtn')?.addEventListener('click', () => this.closeNoteModal());
    document.getElementById('btnCancelNoteModal')?.addEventListener('click', () => this.closeNoteModal());

    // Color Selector Options
    document.querySelectorAll('.color-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Accent Selector Options
    document.querySelectorAll('.accent-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.accent-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Add Checklist Item
    const chkInput = document.getElementById('modalChecklistInput');
    const addChkBtn = document.getElementById('btnAddModalChecklist');
    const addChkItem = () => {
      const text = chkInput.value.trim();
      if (!text) return;
      this.appendChecklistItemToModal(text, false);
      chkInput.value = '';
      chkInput.focus();
    };

    if (addChkBtn) addChkBtn.addEventListener('click', addChkItem);
    if (chkInput) {
      chkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addChkItem();
        }
      });
    }

    // Launch Doodle Studio
    document.getElementById('btnLaunchDoodle')?.addEventListener('click', () => {
      window.DoodleStudio.open(this.activeDoodleData, (newDataUrl) => {
        this.activeDoodleData = newDataUrl;
        this.updateDoodleModalPreview();
      });
    });

    // Remove Doodle
    document.getElementById('btnRemoveDoodle')?.addEventListener('click', () => {
      this.activeDoodleData = null;
      this.updateDoodleModalPreview();
    });

    // Save Note Form Submission
    document.getElementById('noteForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveNoteFromModal();
    });
  },

  openNoteModal(noteId = null, defaultCoords = null) {
    this.activeEditingId = noteId;
    const modal = document.getElementById('noteEditModal');
    const titleEl = document.getElementById('modalNoteHeaderTitle');
    const checklistList = document.getElementById('modalChecklistItems');
    if (checklistList) checklistList.innerHTML = '';

    if (noteId) {
      const note = window.NoteEngine.getNoteById(noteId);
      if (!note) return;

      if (titleEl) titleEl.textContent = window.I18N.t('modalEditTitle');
      document.getElementById('noteTitleInput').value = note.title || '';
      document.getElementById('noteContentInput').value = note.content || '';
      document.getElementById('noteDueDateInput').value = note.dueDate || '';
      document.getElementById('notePriorityInput').value = note.priority || 'medium';
      document.getElementById('noteStatusInput').value = note.status || 'todo';
      document.getElementById('noteTagsInput').value = (note.tags || []).join(', ');

      // Color selection
      document.querySelectorAll('.color-choice-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-color') === (note.color || 'lemon'));
      });

      // Accent selection
      document.querySelectorAll('.accent-choice-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-accent') === (note.accent || 'pin'));
      });

      // Checklists
      (note.checklists || []).forEach(item => {
        this.appendChecklistItemToModal(item.text, item.done, item.id);
      });

      // Doodle
      this.activeDoodleData = note.doodle || null;
      this.updateDoodleModalPreview();

    } else {
      if (titleEl) titleEl.textContent = window.I18N.t('modalNewTitle');
      document.getElementById('noteForm').reset();
      document.getElementById('notePriorityInput').value = 'medium';
      document.getElementById('noteStatusInput').value = 'todo';

      // Default color & accent
      document.querySelectorAll('.color-choice-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
      document.querySelectorAll('.accent-choice-btn').forEach((b, i) => b.classList.toggle('active', i === 0));

      this.activeDoodleData = null;
      this.updateDoodleModalPreview();
      this.pendingCoords = defaultCoords;
    }

    if (modal) modal.classList.add('active');
    setTimeout(() => document.getElementById('noteTitleInput')?.focus(), 50);
  },

  closeNoteModal() {
    const modal = document.getElementById('noteEditModal');
    if (modal) modal.classList.remove('active');
    this.activeEditingId = null;
    this.activeDoodleData = null;
  },

  appendChecklistItemToModal(text, done = false, id = null) {
    const list = document.getElementById('modalChecklistItems');
    if (!list) return;

    const itemId = id || `chk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const li = document.createElement('li');
    li.className = 'modal-chk-item';
    li.setAttribute('data-chk-id', itemId);

    li.innerHTML = `
      <label class="custom-checkbox">
        <input type="checkbox" ${done ? 'checked' : ''} class="modal-chk-box">
        <span class="checkbox-box"></span>
      </label>
      <input type="text" class="modal-chk-text-input" value="${window.NoteEngine.escapeHTML(text)}">
      <button type="button" class="btn-chk-remove" title="Remove item">✕</button>
    `;

    li.querySelector('.btn-chk-remove')?.addEventListener('click', () => {
      li.remove();
    });

    list.appendChild(li);
  },

  updateDoodleModalPreview() {
    const previewContainer = document.getElementById('modalDoodlePreviewArea');
    const previewImg = document.getElementById('modalDoodleImg');
    const removeBtn = document.getElementById('btnRemoveDoodle');

    if (this.activeDoodleData) {
      if (previewImg) previewImg.src = this.activeDoodleData;
      if (previewContainer) previewContainer.classList.remove('hidden');
      if (removeBtn) removeBtn.classList.remove('hidden');
    } else {
      if (previewContainer) previewContainer.classList.add('hidden');
      if (removeBtn) removeBtn.classList.add('hidden');
    }
  },

  saveNoteFromModal() {
    const title = document.getElementById('noteTitleInput')?.value.trim() || '';
    const content = document.getElementById('noteContentInput')?.value.trim() || '';
    const dueDate = document.getElementById('noteDueDateInput')?.value || '';
    const priority = document.getElementById('notePriorityInput')?.value || 'medium';
    const status = document.getElementById('noteStatusInput')?.value || 'todo';
    
    // Parse tags
    const tagsRaw = document.getElementById('noteTagsInput')?.value || '';
    const tags = tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    // Get active color
    const activeColorBtn = document.querySelector('.color-choice-btn.active');
    const color = activeColorBtn ? activeColorBtn.getAttribute('data-color') : 'lemon';

    // Get active accent
    const activeAccentBtn = document.querySelector('.accent-choice-btn.active');
    const accent = activeAccentBtn ? activeAccentBtn.getAttribute('data-accent') : 'pin';

    // Parse checklists
    const checklists = [];
    document.querySelectorAll('#modalChecklistItems .modal-chk-item').forEach(li => {
      const id = li.getAttribute('data-chk-id');
      const isChecked = li.querySelector('.modal-chk-box')?.checked || false;
      const textVal = li.querySelector('.modal-chk-text-input')?.value.trim() || '';
      if (textVal) {
        checklists.push({ id, text: textVal, done: isChecked });
      }
    });

    const notePayload = {
      title,
      content,
      dueDate,
      priority,
      status,
      tags,
      color,
      accent,
      checklists,
      doodle: this.activeDoodleData
    };

    if (this.activeEditingId) {
      window.NoteEngine.updateNote(this.activeEditingId, notePayload);
      this.showToast(window.I18N.t('toastNoteUpdated'));
    } else {
      if (this.pendingCoords) {
        notePayload.x = this.pendingCoords.x;
        notePayload.y = this.pendingCoords.y;
      }
      window.NoteEngine.createNote(notePayload);
      this.showToast(window.I18N.t('toastNoteCreated'));
    }

    this.closeNoteModal();
    this.refreshTagsFilter();
    window.BoardManager.render();
  },

  /* ==========================================================================
     Statistics Modal
     ========================================================================== */
  openStatsModal() {
    const modal = document.getElementById('statsModal');
    if (!modal) return;

    const notes = window.NoteEngine.getAllNotes();
    const total = notes.length;
    const completed = notes.filter(n => n.status === 'done').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let totalChecklists = 0;
    let completedChecklists = 0;
    const tagMap = {};

    notes.forEach(n => {
      (n.checklists || []).forEach(c => {
        totalChecklists++;
        if (c.done) completedChecklists++;
      });
      (n.tags || []).forEach(t => {
        tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });

    document.getElementById('statTotalNotes').textContent = total;
    document.getElementById('statCompletedTasks').textContent = completed;
    document.getElementById('statPendingTasks').textContent = pending;
    document.getElementById('statCompletionRate').textContent = `${completionRate}%`;
    document.getElementById('statChecklistsDone').textContent = `${completedChecklists} / ${totalChecklists}`;

    // Tag ranking
    const topTagsContainer = document.getElementById('statsTopTags');
    if (topTagsContainer) {
      topTagsContainer.innerHTML = '';
      const sortedTags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
      if (sortedTags.length === 0) {
        topTagsContainer.innerHTML = `<span class="empty-stat-hint">${window.I18N.t('statsNoData')}</span>`;
      } else {
        sortedTags.forEach(([tag, count]) => {
          const pill = document.createElement('span');
          pill.className = 'stat-tag-pill';
          pill.innerHTML = `<strong>#${tag}</strong> (${count})`;
          topTagsContainer.appendChild(pill);
        });
      }
    }

    modal.classList.add('active');
    document.getElementById('statsModalCloseBtn')?.addEventListener('click', () => modal.classList.remove('active'), { once: true });
  },

  /* ==========================================================================
     Export & Import Modal
     ========================================================================== */
  openExportModal() {
    const modal = document.getElementById('exportModal');
    if (!modal) return;

    modal.classList.add('active');
    document.getElementById('exportModalCloseBtn')?.addEventListener('click', () => modal.classList.remove('active'), { once: true });

    // Export JSON
    document.getElementById('btnExportJSON')?.addEventListener('click', () => {
      window.Storage.exportJSON(window.NoteEngine.getAllNotes());
      this.showToast(window.I18N.t('toastExported'));
    });

    // Export Markdown
    document.getElementById('btnExportMD')?.addEventListener('click', () => {
      window.Storage.exportMarkdown(window.NoteEngine.getAllNotes());
      this.showToast(window.I18N.t('toastExported'));
    });

    // Export PNG Board Snapshot
    document.getElementById('btnExportPNG')?.addEventListener('click', () => {
      this.exportBoardToPNG();
    });

    // File Import
    const fileInput = document.getElementById('importJSONFileInput');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = window.Storage.importJSON(event.target.result);
          if (result.success) {
            window.NoteEngine.notes = result.notes;
            this.refreshTagsFilter();
            window.BoardManager.render();
            modal.classList.remove('active');
            this.showToast(window.I18N.t('importSuccess'));
          } else {
            alert(window.I18N.t('importError'));
          }
        };
        reader.readAsText(file);
      };
    }

    // Reset to defaults
    document.getElementById('btnResetData')?.addEventListener('click', () => {
      if (confirm(window.I18N.t('confirmReset'))) {
        window.NoteEngine.notes = window.Storage.resetToDefaults();
        this.refreshTagsFilter();
        window.BoardManager.render();
        modal.classList.remove('active');
        this.showToast('Reset to starter notes! 🌟');
      }
    });
  },

  /**
   * High-Resolution PNG Snapshot Generator of Board using Canvas Rendering
   */
  exportBoardToPNG() {
    const notes = window.NoteEngine.getFilteredNotes();
    if (notes.length === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background Corkboard color
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.fillStyle = isDark ? '#191816' : '#ded6c9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title banner
    ctx.fillStyle = isDark ? '#f3ede4' : '#22201d';
    ctx.font = 'bold 28px "Architects Daughter", sans-serif';
    ctx.fillText('📌 R2Art Sticky Task Notes', 40, 50);

    ctx.font = '16px "Patrick Hand", sans-serif';
    ctx.fillStyle = isDark ? '#b8aea1' : '#555';
    ctx.fillText(`Snapshot captured on ${new Date().toLocaleString()} | NaturalizerINA`, 40, 80);

    // Color Palette mappings for canvas rendering
    const colorHex = {
      lemon: '#fef3c7',
      matcha: '#dcfce7',
      terracotta: '#ffedd5',
      sky: '#e0f2fe',
      lavender: '#f3e8ff',
      sand: '#f5f0eb',
      coral: '#ffe4e6',
      gray: '#f3f4f6'
    };

    notes.forEach((n, idx) => {
      const x = (n.x || (50 + idx * 280)) % (canvas.width - 320);
      const y = Math.min((n.y || (120 + Math.floor(idx / 4) * 260)) + 60, canvas.height - 280);
      const w = 270;
      const h = 230;

      // Note shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(x + 5, y + 5, w, h);

      // Note Paper
      ctx.fillStyle = colorHex[n.color] || '#fef3c7';
      ctx.fillRect(x, y, w, h);

      // Border
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      // Header / Title
      ctx.fillStyle = '#191816';
      ctx.font = 'bold 18px "Patrick Hand", cursive';
      const title = n.title || 'Untitled';
      ctx.fillText(title.length > 26 ? title.slice(0, 24) + '...' : title, x + 15, y + 35);

      // Content preview
      ctx.font = '14px "Patrick Hand", cursive';
      ctx.fillStyle = '#333';
      const lines = (n.content || '').split('\n').slice(0, 4);
      lines.forEach((l, i) => {
        ctx.fillText(l.length > 32 ? l.slice(0, 30) + '...' : l, x + 15, y + 65 + i * 20);
      });

      // Checklists preview
      if (n.checklists && n.checklists.length > 0) {
        ctx.font = '13px "Patrick Hand", cursive';
        ctx.fillStyle = '#059669';
        const done = n.checklists.filter(c => c.done).length;
        ctx.fillText(`✓ Checklist: ${done}/${n.checklists.length} done`, x + 15, y + 170);
      }

      // Tags preview
      if (n.tags && n.tags.length > 0) {
        ctx.font = '12px "Fira Code", monospace';
        ctx.fillStyle = '#8b5cf6';
        ctx.fillText(n.tags.map(t => `#${t}`).join(' ').slice(0, 30), x + 15, y + 200);
      }
    });

    const link = document.createElement('a');
    link.download = `r2art_sticky_board_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    link.remove();
    this.showToast(window.I18N.t('toastScreenshotReady'));
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    window.PomodoroTimer.toggleWidget(false);
  },

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Global Exposure and DOMContentLoaded Bootstrapper
window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
