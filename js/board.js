/**
 * R2Art Sticky Task Notes - Board Manager
 * Manages Freeform Canvas Drag & Drop, Kanban Workflow, Grid View, and Timeline View
 */

const BoardManager = {
  currentView: 'canvas', // 'canvas', 'kanban', 'grid', 'timeline'
  snapToGrid: false,
  gridSize: 20,
  
  // Drag State for Freeform Canvas
  isDraggingCanvasNote: false,
  dragTarget: null,
  dragOffset: { x: 0, y: 0 },
  initialPos: { x: 0, y: 0 },

  init() {
    this.bindEvents();
  },

  setView(viewName) {
    this.currentView = viewName;
    
    // Update toolbar view buttons
    document.querySelectorAll('.view-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const canvasContainer = document.getElementById('canvasViewContainer');
    const kanbanContainer = document.getElementById('kanbanViewContainer');
    const gridContainer = document.getElementById('gridViewContainer');
    const timelineContainer = document.getElementById('timelineViewContainer');

    if (canvasContainer) canvasContainer.classList.toggle('active', viewName === 'canvas');
    if (kanbanContainer) kanbanContainer.classList.toggle('active', viewName === 'kanban');
    if (gridContainer) gridContainer.classList.toggle('active', viewName === 'grid');
    if (timelineContainer) timelineContainer.classList.toggle('active', viewName === 'timeline');

    this.render();
  },

  bindEvents() {
    // View Switcher Buttons
    document.querySelectorAll('.view-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) this.setView(view);
      });
    });

    // Snap to grid toggle
    const snapBtn = document.getElementById('btnSnapGrid');
    if (snapBtn) {
      snapBtn.addEventListener('click', () => {
        this.snapToGrid = !this.snapToGrid;
        snapBtn.classList.toggle('active', this.snapToGrid);
        if (this.currentView === 'canvas') {
          this.renderCanvas();
        }
      });
    }

    // Freeform Canvas Global Pointer Listeners
    window.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
    window.addEventListener('mouseup', () => this.onCanvasMouseUp());

    // Touch Listeners for Mobile / Tablet Canvas Dragging
    window.addEventListener('touchmove', (e) => this.onCanvasTouchMove(e), { passive: false });
    window.addEventListener('touchend', () => this.onCanvasMouseUp());

    // Double click on Canvas board to create note
    const corkboard = document.getElementById('canvasCorkboard');
    if (corkboard) {
      corkboard.addEventListener('dblclick', (e) => {
        if (e.target === corkboard || e.target.id === 'canvasCorkboard') {
          const rect = corkboard.getBoundingClientRect();
          const x = Math.max(20, e.clientX - rect.left - 120);
          const y = Math.max(20, e.clientY - rect.top - 50);
          if (window.App && window.App.openNoteModal) {
            window.App.openNoteModal(null, { x, y });
          }
        }
      });
    }
  },

  render() {
    switch (this.currentView) {
      case 'canvas':
        this.renderCanvas();
        break;
      case 'kanban':
        this.renderKanban();
        break;
      case 'grid':
        this.renderGrid();
        break;
      case 'timeline':
        this.renderTimeline();
        break;
    }
  },

  /**
   * 1. Render Freeform Corkboard Canvas
   */
  renderCanvas() {
    const corkboard = document.getElementById('canvasCorkboard');
    if (!corkboard) return;

    corkboard.innerHTML = '';
    const notes = window.NoteEngine.getFilteredNotes();

    if (notes.length === 0) {
      corkboard.innerHTML = `
        <div class="empty-state-canvas">
          <div class="empty-state-icon">📌</div>
          <h3>${window.I18N.t('emptyBoardTitle')}</h3>
          <p>${window.I18N.t('emptyBoardDesc')}</p>
          <button type="button" class="btn btn-primary" id="btnEmptyCreateNote">+ ${window.I18N.t('btnNewNote')}</button>
        </div>
      `;
      document.getElementById('btnEmptyCreateNote')?.addEventListener('click', () => {
        if (window.App) window.App.openNoteModal();
      });
      return;
    }

    notes.forEach(note => {
      const el = window.NoteEngine.renderNoteElement(note, 'canvas');
      this.attachCanvasDragEvents(el, note);
      corkboard.appendChild(el);
    });
  },

  attachCanvasDragEvents(el, note) {
    const startDrag = (clientX, clientY) => {
      this.isDraggingCanvasNote = true;
      this.dragTarget = el;
      window.NoteEngine.bringToFront(note.id);
      el.style.zIndex = note.zIndex;
      el.classList.add('is-dragging');

      const corkboard = document.getElementById('canvasCorkboard');
      const boardRect = corkboard.getBoundingClientRect();
      
      this.dragOffset = {
        x: clientX - boardRect.left - (note.x || 0),
        y: clientY - boardRect.top - (note.y || 0)
      };
      this.initialPos = { x: note.x || 0, y: note.y || 0 };
    };

    el.addEventListener('mousedown', (e) => {
      // Don't drag if clicking buttons, links, or checkboxes
      if (e.target.closest('button, input, a, .custom-checkbox')) return;
      startDrag(e.clientX, e.clientY);
    });

    el.addEventListener('touchstart', (e) => {
      if (e.target.closest('button, input, a, .custom-checkbox')) return;
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    }, { passive: true });
  },

  onCanvasMouseMove(e) {
    if (!this.isDraggingCanvasNote || !this.dragTarget) return;

    const corkboard = document.getElementById('canvasCorkboard');
    const boardRect = corkboard.getBoundingClientRect();

    let newX = e.clientX - boardRect.left - this.dragOffset.x;
    let newY = e.clientY - boardRect.top - this.dragOffset.y;

    // Boundaries
    newX = Math.max(10, Math.min(newX, corkboard.scrollWidth - 280));
    newY = Math.max(10, Math.min(newY, corkboard.scrollHeight - 240));

    // Snap to Grid if active
    if (this.snapToGrid) {
      newX = Math.round(newX / this.gridSize) * this.gridSize;
      newY = Math.round(newY / this.gridSize) * this.gridSize;
    }

    this.dragTarget.style.left = `${newX}px`;
    this.dragTarget.style.top = `${newY}px`;
  },

  onCanvasTouchMove(e) {
    if (!this.isDraggingCanvasNote || !this.dragTarget) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.onCanvasMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  },

  onCanvasMouseUp() {
    if (!this.isDraggingCanvasNote || !this.dragTarget) return;

    const noteId = this.dragTarget.getAttribute('data-id');
    const newX = parseInt(this.dragTarget.style.left, 10) || 0;
    const newY = parseInt(this.dragTarget.style.top, 10) || 0;

    this.dragTarget.classList.remove('is-dragging');

    // Only update and play sound if moved significantly
    if (Math.abs(newX - this.initialPos.x) > 4 || Math.abs(newY - this.initialPos.y) > 4) {
      window.NoteEngine.updateNote(noteId, { x: newX, y: newY });
      if (window.SoundFX) window.SoundFX.playPaper();
    }

    this.isDraggingCanvasNote = false;
    this.dragTarget = null;
  },

  /**
   * 2. Render Kanban Workflow Board
   */
  renderKanban() {
    const columns = ['backlog', 'todo', 'in-progress', 'done'];
    const notes = window.NoteEngine.getFilteredNotes();

    columns.forEach(col => {
      const colEl = document.querySelector(`.kanban-column[data-status="${col}"] .kanban-cards-wrapper`);
      const countEl = document.querySelector(`.kanban-column[data-status="${col}"] .kanban-count-badge`);
      if (!colEl) return;

      colEl.innerHTML = '';
      const colNotes = notes.filter(n => n.status === col);
      if (countEl) countEl.textContent = colNotes.length;

      if (colNotes.length === 0) {
        colEl.innerHTML = `<div class="kanban-empty-hint">${window.I18N.t('emptyKanbanCol')}</div>`;
      } else {
        colNotes.forEach(note => {
          const el = window.NoteEngine.renderNoteElement(note, 'kanban');
          el.setAttribute('draggable', 'true');
          this.attachKanbanDragEvents(el, note);
          colEl.appendChild(el);
        });
      }

      this.setupKanbanDropZone(colEl.parentElement, col);
    });
  },

  attachKanbanDragEvents(el, note) {
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', note.id);
      e.dataTransfer.effectAllowed = 'move';
      el.classList.add('kanban-is-dragging');
    });

    el.addEventListener('dragend', () => {
      el.classList.remove('kanban-is-dragging');
    });
  },

  setupKanbanDropZone(columnEl, status) {
    if (!columnEl || columnEl.hasDropListener) return;
    columnEl.hasDropListener = true;

    columnEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      columnEl.classList.add('drag-over');
    });

    columnEl.addEventListener('dragleave', (e) => {
      if (!columnEl.contains(e.relatedTarget)) {
        columnEl.classList.remove('drag-over');
      }
    });

    columnEl.addEventListener('drop', (e) => {
      e.preventDefault();
      columnEl.classList.remove('drag-over');
      const noteId = e.dataTransfer.getData('text/plain');
      if (noteId) {
        const note = window.NoteEngine.getNoteById(noteId);
        if (note && note.status !== status) {
          window.NoteEngine.updateNote(noteId, { status: status });
          if (window.SoundFX) window.SoundFX.playPaper();
          this.renderKanban();
        }
      }
    });
  },

  /**
   * 3. Render Responsive Grid View
   */
  renderGrid() {
    const gridContainer = document.getElementById('gridCardsContainer');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';
    const notes = window.NoteEngine.getFilteredNotes();

    if (notes.length === 0) {
      gridContainer.innerHTML = `
        <div class="empty-state-grid">
          <p>${window.I18N.t('emptyBoardDesc')}</p>
        </div>
      `;
      return;
    }

    notes.forEach(note => {
      const el = window.NoteEngine.renderNoteElement(note, 'grid');
      gridContainer.appendChild(el);
    });
  },

  /**
   * 4. Render Timeline / Due Date Schedule View
   */
  renderTimeline() {
    const timelineContainer = document.getElementById('timelineColumnsContainer');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';
    const notes = window.NoteEngine.getFilteredNotes();
    const todayStr = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const categories = [
      {
        id: 'overdue',
        title: window.I18N.t('timelineOverdue'),
        icon: '⚠️',
        filter: n => n.dueDate && n.dueDate < todayStr && n.status !== 'done'
      },
      {
        id: 'today',
        title: window.I18N.t('timelineToday'),
        icon: '📅',
        filter: n => n.dueDate === todayStr
      },
      {
        id: 'thisWeek',
        title: window.I18N.t('timelineThisWeek'),
        icon: '🗓️',
        filter: n => n.dueDate > todayStr && n.dueDate <= nextWeek
      },
      {
        id: 'later',
        title: window.I18N.t('timelineLater'),
        icon: '⏳',
        filter: n => n.dueDate > nextWeek
      },
      {
        id: 'noDate',
        title: window.I18N.t('timelineNoDate'),
        icon: '📝',
        filter: n => !n.dueDate
      }
    ];

    categories.forEach(cat => {
      const catNotes = notes.filter(cat.filter);
      const catSection = document.createElement('div');
      catSection.className = `timeline-category-column ${cat.id}`;
      catSection.innerHTML = `
        <div class="timeline-col-header">
          <span class="timeline-col-icon">${cat.icon}</span>
          <h4 class="timeline-col-title">${cat.title}</h4>
          <span class="timeline-col-count">${catNotes.length}</span>
        </div>
        <div class="timeline-cards-list"></div>
      `;

      const listEl = catSection.querySelector('.timeline-cards-list');
      if (catNotes.length === 0) {
        listEl.innerHTML = `<div class="timeline-empty-card">—</div>`;
      } else {
        catNotes.forEach(note => {
          const el = window.NoteEngine.renderNoteElement(note, 'timeline');
          listEl.appendChild(el);
        });
      }

      timelineContainer.appendChild(catSection);
    });
  }
};

window.BoardManager = BoardManager;
