/**
 * R2Art Sticky Task Notes - Note Engine & Renderer
 * Handles Sticky Note Card generation, Checklists, Color Palettes, and Interactions
 */

const NoteEngine = {
  notes: [],
  editingNoteId: null,
  activeFilterTag: null,
  activeFilterPriority: 'all',
  activeFilterColor: 'all',
  activeFilterStatus: 'all',
  searchQuery: '',
  sortBy: 'updated',

  init() {
    this.notes = window.Storage.loadNotes();
  },

  getAllNotes() {
    return this.notes;
  },

  getNoteById(id) {
    return this.notes.find(n => n.id === id);
  },

  /**
   * Filter and sort notes based on current UI state
   */
  getFilteredNotes() {
    let list = [...this.notes];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(n => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const contentMatch = (n.content || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some(t => t.toLowerCase().includes(q));
        const checkMatch = (n.checklists || []).some(c => c.text.toLowerCase().includes(q));
        return titleMatch || contentMatch || tagMatch || checkMatch;
      });
    }

    // Tag filter
    if (this.activeFilterTag) {
      list = list.filter(n => (n.tags || []).includes(this.activeFilterTag));
    }

    // Priority filter
    if (this.activeFilterPriority !== 'all') {
      list = list.filter(n => n.priority === this.activeFilterPriority);
    }

    // Color filter
    if (this.activeFilterColor !== 'all') {
      list = list.filter(n => n.color === this.activeFilterColor);
    }

    // Status filter
    if (this.activeFilterStatus !== 'all') {
      list = list.filter(n => n.status === this.activeFilterStatus);
    }

    // Sorting
    list.sort((a, b) => {
      if (this.sortBy === 'created') return b.createdAt - a.createdAt;
      if (this.sortBy === 'updated') return b.updatedAt - a.updatedAt;
      if (this.sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (this.sortBy === 'priority') {
        const pOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      if (this.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    return list;
  },

  /**
   * Create a new note
   */
  createNote(data = {}) {
    const now = Date.now();
    const highestZ = this.notes.reduce((max, n) => Math.max(max, n.zIndex || 10), 10);
    const randomTilt = (Math.random() * 5 - 2.5).toFixed(1); // -2.5deg to +2.5deg

    const newNote = {
      id: `note-${now}-${Math.random().toString(36).substr(2, 4)}`,
      title: data.title || '',
      content: data.content || '',
      checklists: Array.isArray(data.checklists) ? data.checklists : [],
      color: data.color || 'lemon',
      accent: data.accent || 'pin',
      priority: data.priority || 'medium',
      status: data.status || 'todo',
      tags: Array.isArray(data.tags) ? data.tags : [],
      x: data.x !== undefined ? data.x : Math.max(40, Math.floor(Math.random() * 300) + 50),
      y: data.y !== undefined ? data.y : Math.max(40, Math.floor(Math.random() * 200) + 50),
      zIndex: highestZ + 1,
      rotation: data.rotation !== undefined ? data.rotation : parseFloat(randomTilt),
      dueDate: data.dueDate || '',
      doodle: data.doodle || null,
      createdAt: now,
      updatedAt: now
    };

    this.notes.unshift(newNote);
    window.Storage.saveNotes(this.notes);
    if (window.SoundFX) window.SoundFX.playPin();
    return newNote;
  },

  /**
   * Update existing note
   */
  updateNote(id, updates = {}) {
    const note = this.getNoteById(id);
    if (!note) return null;

    Object.assign(note, updates, { updatedAt: Date.now() });
    window.Storage.saveNotes(this.notes);
    return note;
  },

  /**
   * Delete note
   */
  deleteNote(id) {
    const index = this.notes.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notes.splice(index, 1);
      window.Storage.saveNotes(this.notes);
      if (window.SoundFX) window.SoundFX.playTrash();
      return true;
    }
    return false;
  },

  /**
   * Duplicate note
   */
  duplicateNote(id) {
    const source = this.getNoteById(id);
    if (!source) return null;

    const copy = JSON.parse(JSON.stringify(source));
    copy.id = `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    copy.title = `${copy.title} (Copy)`;
    copy.x = (copy.x || 50) + 30;
    copy.y = (copy.y || 50) + 30;
    copy.zIndex = (copy.zIndex || 10) + 2;
    copy.createdAt = Date.now();
    copy.updatedAt = Date.now();

    this.notes.unshift(copy);
    window.Storage.saveNotes(this.notes);
    if (window.SoundFX) window.SoundFX.playPaper();
    return copy;
  },

  /**
   * Toggle checklist item
   */
  toggleChecklist(noteId, checklistId) {
    const note = this.getNoteById(noteId);
    if (!note || !note.checklists) return;

    const item = note.checklists.find(c => c.id === checklistId);
    if (item) {
      item.done = !item.done;
      note.updatedAt = Date.now();
      window.Storage.saveNotes(this.notes);
      
      if (item.done && window.SoundFX) {
        window.SoundFX.playCheck();
      }
    }
  },

  /**
   * Bring note to highest z-index
   */
  bringToFront(id) {
    const note = this.getNoteById(id);
    if (!note) return;

    const highestZ = this.notes.reduce((max, n) => Math.max(max, n.zIndex || 10), 10);
    note.zIndex = highestZ + 1;
    window.Storage.saveNotes(this.notes);
  },

  /**
   * Render HTML for a single Sticky Note element
   */
  renderNoteElement(note, viewMode = 'canvas') {
    const el = document.createElement('div');
    el.className = `sticky-note color-${note.color || 'lemon'} accent-${note.accent || 'pin'} priority-${note.priority || 'medium'}`;
    el.id = note.id;
    el.setAttribute('data-id', note.id);
    el.setAttribute('data-status', note.status || 'todo');

    // Freeform Corkboard Positioning
    if (viewMode === 'canvas') {
      el.style.left = `${note.x || 50}px`;
      el.style.top = `${note.y || 50}px`;
      el.style.zIndex = note.zIndex || 10;
      el.style.transform = `rotate(${note.rotation || 0}deg)`;
    }

    // Header Accent (Pin / Tape / Clip)
    let accentHtml = '';
    if (note.accent === 'pin') {
      accentHtml = `<div class="note-pin" title="${window.I18N.t('accentPin')}"></div>`;
    } else if (note.accent === 'tape') {
      accentHtml = `<div class="note-washi-tape" title="${window.I18N.t('accentTape')}"></div>`;
    } else if (note.accent === 'clip') {
      accentHtml = `<div class="note-paperclip" title="${window.I18N.t('accentClip')}">📎</div>`;
    }

    // Due Date & Badges
    let dateBadgeHtml = '';
    if (note.dueDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      const isOverdue = note.dueDate < todayStr && note.status !== 'done';
      const isToday = note.dueDate === todayStr;

      let badgeClass = 'date-badge';
      let badgeLabel = note.dueDate;
      if (isOverdue) {
        badgeClass += ' overdue';
        badgeLabel = `⚠️ ${note.dueDate} (${window.I18N.t('overdueBadge')})`;
      } else if (isToday) {
        badgeClass += ' today';
        badgeLabel = `📅 ${window.I18N.t('todayBadge')}`;
      } else {
        badgeLabel = `📅 ${note.dueDate}`;
      }
      dateBadgeHtml = `<span class="${badgeClass}">${badgeLabel}</span>`;
    }

    // Priority Indicator
    const priorityEmoji = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    }[note.priority] || '🟡';

    // Checklist Progress
    let checklistHtml = '';
    if (note.checklists && note.checklists.length > 0) {
      const total = note.checklists.length;
      const doneCount = note.checklists.filter(c => c.done).length;
      const pct = Math.round((doneCount / total) * 100);

      checklistHtml = `
        <div class="note-checklist-section">
          <div class="checklist-progress-bar">
            <div class="checklist-progress-fill" style="width: ${pct}%"></div>
          </div>
          <div class="checklist-progress-text">${doneCount}/${total} (${pct}%)</div>
          <ul class="note-checklist-list">
            ${note.checklists.map(item => `
              <li class="checklist-item ${item.done ? 'checked' : ''}" data-checklist-id="${item.id}">
                <label class="custom-checkbox">
                  <input type="checkbox" ${item.done ? 'checked' : ''} data-checklist-id="${item.id}">
                  <span class="checkbox-box"></span>
                  <span class="checklist-item-text">${this.escapeHTML(item.text)}</span>
                </label>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Tags Chips
    let tagsHtml = '';
    if (note.tags && note.tags.length > 0) {
      tagsHtml = `
        <div class="note-tags-list">
          ${note.tags.map(t => `<button type="button" class="tag-chip" data-tag="${this.escapeHTML(t)}">#${this.escapeHTML(t)}</button>`).join('')}
        </div>
      `;
    }

    // Doodle Sketch Attachment
    let doodleHtml = '';
    if (note.doodle) {
      doodleHtml = `
        <div class="note-doodle-preview">
          <img src="${note.doodle}" alt="Sketch attachment" loading="lazy">
        </div>
      `;
    }

    // Format content with simple markdown (bold, lists, blockquotes)
    const formattedContent = this.formatContent(note.content);

    el.innerHTML = `
      ${accentHtml}
      <div class="note-header-bar">
        <div class="note-badges">
          <span class="priority-pill" title="Priority: ${note.priority}">${priorityEmoji}</span>
          ${dateBadgeHtml}
        </div>
        <div class="note-quick-actions">
          <button type="button" class="note-btn-action btn-pomo-link" data-id="${note.id}" title="Focus Pomodoro on this task">⏱️</button>
          <button type="button" class="note-btn-action btn-note-edit" data-id="${note.id}" title="${window.I18N.t('editTooltip')}">✏️</button>
          <button type="button" class="note-btn-action btn-note-duplicate" data-id="${note.id}" title="${window.I18N.t('duplicateTooltip')}">📋</button>
          <button type="button" class="note-btn-action btn-note-delete" data-id="${note.id}" title="${window.I18N.t('deleteTooltip')}">🗑️</button>
        </div>
      </div>

      ${note.title ? `<h3 class="note-title">${this.escapeHTML(note.title)}</h3>` : ''}
      
      ${note.content ? `<div class="note-body-text">${formattedContent}</div>` : ''}

      ${doodleHtml}
      ${checklistHtml}
      ${tagsHtml}

      <div class="note-footer-meta">
        <span class="note-status-tag status-${note.status}">${this.formatStatusLabel(note.status)}</span>
        <span class="note-time-ago">${this.timeAgo(note.updatedAt)}</span>
      </div>
    `;

    return el;
  },

  formatStatusLabel(status) {
    const map = {
      backlog: window.I18N.t('colBacklog'),
      todo: window.I18N.t('colTodo'),
      'in-progress': window.I18N.t('colInProgress'),
      done: window.I18N.t('colDone')
    };
    return map[status] || status;
  },

  formatContent(text) {
    if (!text) return '';
    let escaped = this.escapeHTML(text);
    // Convert bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert italic *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Convert inline code `code`
    escaped = escaped.replace(/`(.*?)`/g, '<code>$1</code>');
    // Convert newlines
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
  },

  escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  timeAgo(timestamp) {
    if (!timestamp) return '';
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    const isId = window.I18N.currentLang === 'id';

    if (diff < 60) return isId ? 'baru saja' : 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${isId ? 'lalu' : 'ago'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j ${isId ? 'lalu' : 'h ago'}`;
    return `${Math.floor(diff / 86400)}d ${isId ? 'lalu' : 'days ago'}`;
  }
};

window.NoteEngine = NoteEngine;
