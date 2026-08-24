/**
 * R2Art Sticky Task Notes - Storage & Data Persistence Engine
 * Manages LocalStorage, Starter Demo Notes, JSON/Markdown Export & Import
 */

const Storage = {
  STORAGE_KEY: 'r2art_sticky_notes_data',
  SETTINGS_KEY: 'r2art_sticky_notes_settings',

  /**
   * Get default starter notes based on active language
   */
  getDefaultNotes() {
    const isId = (window.I18N && window.I18N.currentLang === 'id') || navigator.language?.startsWith('id');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (isId) {
      return [
        {
          id: 'note-welcome',
          title: '✨ Selamat Datang di R2Art Sticky Notes!',
          content: 'Ini adalah papan catatan & manajemen tugas visual dengan sentuhan estetika kertas alami dan sketsa tangan 🌿.\n\n• Geser catatan ini dengan bebas!\n• Coba ganti ke tampilan **Kanban**, **Grid**, atau **Jadwal** di toolbar atas.\n• Tekan tombol **Pomodoro** untuk fokus bekerja.',
          checklists: [
            { id: 'chk-1', text: 'Jelajahi fitur tampilan papan', done: true },
            { id: 'chk-2', text: 'Coba klik dua kali untuk buat catatan baru', done: false },
            { id: 'chk-3', text: 'Coba fitur Sketsa / Doodle ✏️', done: false }
          ],
          color: 'lemon',
          accent: 'pin',
          priority: 'high',
          status: 'in-progress',
          tags: ['welcome', 'tutorial', 'fitur'],
          x: 40,
          y: 40,
          zIndex: 10,
          rotation: -2,
          dueDate: new Date(now + oneDay).toISOString().split('T')[0],
          createdAt: now - 3600000,
          updatedAt: now
        },
        {
          id: 'note-roadmap',
          title: '🚀 Rencana Rilis Fitur v2.0',
          content: 'Daftar penyempurnaan modul UI dan integrasi performa tinggi untuk portofolio NaturalizerINA.',
          checklists: [
            { id: 'chk-r1', text: 'Desain mockup sketsa responsif', done: true },
            { id: 'chk-r2', text: 'Integrasi efek audio sintetis Web Audio', done: true },
            { id: 'chk-r3', text: 'Export PNG Canvas Snapshot', done: true },
            { id: 'chk-r4', text: 'Optimasi Touch Drag & Drop di Mobile', done: false }
          ],
          color: 'matcha',
          accent: 'tape',
          priority: 'urgent',
          status: 'todo',
          tags: ['dev', 'frontend', 'roadmap'],
          x: 360,
          y: 60,
          zIndex: 12,
          rotation: 1.5,
          dueDate: new Date(now + oneDay * 3).toISOString().split('T')[0],
          createdAt: now - 7200000,
          updatedAt: now
        },
        {
          id: 'note-idea',
          title: '💡 Ide Proyek: Flutter Price Ladder',
          content: 'Eksplorasi optimasi rendering 120fps untuk package `r2art_fraction_price_input` di pasar modal IDX.\n\n> Gunakan CustomPainter dan Isolates untuk perhitungan kalkulasi tick.',
          checklists: [
            { id: 'chk-i1', text: 'Benchmark performa tick data', done: true },
            { id: 'chk-i2', text: 'Unit test perhitungan lot & fraksi harga', done: true }
          ],
          color: 'terracotta',
          accent: 'clip',
          priority: 'medium',
          status: 'done',
          tags: ['flutter', 'idx', 'fintech'],
          x: 680,
          y: 50,
          zIndex: 8,
          rotation: -1.2,
          dueDate: '',
          createdAt: now - 14400000,
          updatedAt: now
        },
        {
          id: 'note-study',
          title: '📚 Bacaan & Riset Arsitektur',
          content: '• Micro-frontends dengan Module Federation\n• Go Fiber Realtime WebSockets\n• Canvas-based visual note rendering',
          checklists: [
            { id: 'chk-s1', text: 'Baca dokumentasi Web Audio API', done: true },
            { id: 'chk-s2', text: 'Tulis ringkasan arsitektur offline-first', done: false }
          ],
          color: 'sky',
          accent: 'tape',
          priority: 'low',
          status: 'backlog',
          tags: ['study', 'arsitektur'],
          x: 1000,
          y: 70,
          zIndex: 9,
          rotation: 2.2,
          dueDate: new Date(now + oneDay * 5).toISOString().split('T')[0],
          createdAt: now - 28800000,
          updatedAt: now
        },
        {
          id: 'note-quick',
          title: '🎯 Target Produktivitas Hari Ini',
          content: 'Selesaikan 4 siklus Pomodoro fokus tanpa distraksi!',
          checklists: [
            { id: 'chk-q1', text: 'Sesi Fokus #1: Review kode', done: true },
            { id: 'chk-q2', text: 'Sesi Fokus #2: Testing fitur baru', done: true },
            { id: 'chk-q3', text: 'Sesi Fokus #3: Refactor CSS tokens', done: false },
            { id: 'chk-q4', text: 'Sesi Fokus #4: Dokumentasi README', done: false }
          ],
          color: 'lavender',
          accent: 'pin',
          priority: 'high',
          status: 'in-progress',
          tags: ['fokus', 'harian'],
          x: 200,
          y: 400,
          zIndex: 11,
          rotation: -1.8,
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: now - 1800000,
          updatedAt: now
        }
      ];
    } else {
      return [
        {
          id: 'note-welcome',
          title: '✨ Welcome to R2Art Sticky Notes!',
          content: 'A tactile, visual sticky note and task management canvas with earthy aesthetics and organic sketch typography 🌿.\n\n• Drag notes anywhere on this corkboard!\n• Switch between **Kanban**, **Grid**, or **Timeline** views.\n• Launch the built-in **Pomodoro timer** to supercharge your focus.',
          checklists: [
            { id: 'chk-1', text: 'Explore different board view modes', done: true },
            { id: 'chk-2', text: 'Double-click corkboard to create note', done: false },
            { id: 'chk-3', text: 'Try drawing a sketch doodle ✏️', done: false }
          ],
          color: 'lemon',
          accent: 'pin',
          priority: 'high',
          status: 'in-progress',
          tags: ['welcome', 'tutorial', 'features'],
          x: 40,
          y: 40,
          zIndex: 10,
          rotation: -2,
          dueDate: new Date(now + oneDay).toISOString().split('T')[0],
          createdAt: now - 3600000,
          updatedAt: now
        },
        {
          id: 'note-roadmap',
          title: '🚀 Release Roadmap v2.0',
          content: 'Enhancements for high-performance responsive web applications in the NaturalizerINA portfolio.',
          checklists: [
            { id: 'chk-r1', text: 'Design tactile UI tokens', done: true },
            { id: 'chk-r2', text: 'Web Audio procedural sound synthesis', done: true },
            { id: 'chk-r3', text: 'Board snapshot PNG exporter', done: true },
            { id: 'chk-r4', text: 'Mobile touch drag gestures optimization', done: false }
          ],
          color: 'matcha',
          accent: 'tape',
          priority: 'urgent',
          status: 'todo',
          tags: ['dev', 'frontend', 'roadmap'],
          x: 360,
          y: 60,
          zIndex: 12,
          rotation: 1.5,
          dueDate: new Date(now + oneDay * 3).toISOString().split('T')[0],
          createdAt: now - 7200000,
          updatedAt: now
        },
        {
          id: 'note-idea',
          title: '💡 Idea: Flutter Price Ladder',
          content: '120fps price ladder rendering optimization for `r2art_fraction_price_input` on IDX stock markets.\n\n> Leverage CustomPainter and background Isolates.',
          checklists: [
            { id: 'chk-i1', text: 'Benchmark real-time tick streaming', done: true },
            { id: 'chk-i2', text: 'Unit tests for lot and fraction boundaries', done: true }
          ],
          color: 'terracotta',
          accent: 'clip',
          priority: 'medium',
          status: 'done',
          tags: ['flutter', 'idx', 'fintech'],
          x: 680,
          y: 50,
          zIndex: 8,
          rotation: -1.2,
          dueDate: '',
          createdAt: now - 14400000,
          updatedAt: now
        },
        {
          id: 'note-study',
          title: '📚 Architecture Research',
          content: '• Micro-frontends with Module Federation\n• Go Fiber Realtime WebSockets\n• Canvas-based visual note rendering',
          checklists: [
            { id: 'chk-s1', text: 'Read Web Audio API documentation', done: true },
            { id: 'chk-s2', text: 'Draft offline-first architecture summary', done: false }
          ],
          color: 'sky',
          accent: 'tape',
          priority: 'low',
          status: 'backlog',
          tags: ['study', 'architecture'],
          x: 1000,
          y: 70,
          zIndex: 9,
          rotation: 2.2,
          dueDate: new Date(now + oneDay * 5).toISOString().split('T')[0],
          createdAt: now - 28800000,
          updatedAt: now
        },
        {
          id: 'note-quick',
          title: '🎯 Daily Focus Targets',
          content: 'Complete 4 Pomodoro focus sprints with zero distractions!',
          checklists: [
            { id: 'chk-q1', text: 'Focus Sprint #1: Code review', done: true },
            { id: 'chk-q2', text: 'Focus Sprint #2: Feature test cases', done: true },
            { id: 'chk-q3', text: 'Focus Sprint #3: CSS tokens polish', done: false },
            { id: 'chk-q4', text: 'Focus Sprint #4: README guide', done: false }
          ],
          color: 'lavender',
          accent: 'pin',
          priority: 'high',
          status: 'in-progress',
          tags: ['focus', 'daily'],
          x: 200,
          y: 400,
          zIndex: 11,
          rotation: -1.8,
          dueDate: new Date().toISOString().split('T')[0],
          createdAt: now - 1800000,
          updatedAt: now
        }
      ];
    }
  },

  /**
   * Load all notes from localStorage or initialize with defaults
   */
  loadNotes() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        const defaults = this.getDefaultNotes();
        this.saveNotes(defaults);
        return defaults;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : this.getDefaultNotes();
    } catch (e) {
      console.error('Failed to load notes from localStorage:', e);
      return this.getDefaultNotes();
    }
  },

  /**
   * Save notes list to localStorage
   */
  saveNotes(notes) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage:', e);
    }
  },

  /**
   * Load user settings (theme, view mode, snap-to-grid, sound)
   */
  loadSettings() {
    try {
      const raw = localStorage.getItem(this.SETTINGS_KEY);
      const defaults = {
        theme: 'dark',
        viewMode: 'canvas',
        snapGrid: false,
        sound: true,
        lang: 'id'
      };
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch (e) {
      return { theme: 'dark', viewMode: 'canvas', snapGrid: false, sound: true, lang: 'id' };
    }
  },

  /**
   * Save user settings
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  /**
   * Export all notes as a downloadable JSON backup
   */
  exportJSON(notes) {
    const backup = {
      app: 'R2Art Sticky Task Notes',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      notesCount: notes.length,
      notes: notes
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `r2art_sticky_notes_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Export notes formatted as clean Markdown
   */
  exportMarkdown(notes) {
    let md = `# 📌 R2Art Sticky Task Notes Backup\n\n`;
    md += `*Exported on ${new Date().toLocaleString()}* | Total Notes: **${notes.length}**\n\n---\n\n`;

    notes.forEach((note, idx) => {
      md += `## ${idx + 1}. ${note.title || 'Untitled Note'}\n\n`;
      md += `- **Status**: \`${note.status || 'todo'}\` | **Priority**: \`${note.priority || 'normal'}\` | **Color**: \`${note.color}\`\n`;
      if (note.dueDate) md += `- **Due Date**: 📅 ${note.dueDate}\n`;
      if (note.tags && note.tags.length > 0) md += `- **Tags**: ${note.tags.map(t => `\`#${t}\``).join(' ')}\n`;
      md += `\n${note.content || ''}\n\n`;

      if (note.checklists && note.checklists.length > 0) {
        md += `### Subtasks Checklist:\n`;
        note.checklists.forEach(item => {
          md += `- [${item.done ? 'x' : ' '}] ${item.text}\n`;
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `r2art_sticky_notes_${new Date().toISOString().slice(0,10)}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  /**
   * Import notes from JSON text or file content
   */
  importJSON(jsonText) {
    try {
      const data = JSON.parse(jsonText);
      let notesToImport = null;
      if (Array.isArray(data)) {
        notesToImport = data;
      } else if (data && Array.isArray(data.notes)) {
        notesToImport = data.notes;
      }

      if (!notesToImport) {
        throw new Error('Invalid JSON format');
      }

      // Sanitize and ensure properties
      const sanitized = notesToImport.map((n, i) => ({
        id: n.id || `imported-${Date.now()}-${i}`,
        title: n.title || 'Untitled',
        content: n.content || '',
        checklists: Array.isArray(n.checklists) ? n.checklists : [],
        color: n.color || 'lemon',
        accent: n.accent || 'pin',
        priority: n.priority || 'medium',
        status: n.status || 'todo',
        tags: Array.isArray(n.tags) ? n.tags : [],
        x: typeof n.x === 'number' ? n.x : 50 + (i * 30),
        y: typeof n.y === 'number' ? n.y : 50 + (i * 30),
        zIndex: typeof n.zIndex === 'number' ? n.zIndex : 10 + i,
        rotation: typeof n.rotation === 'number' ? n.rotation : 0,
        dueDate: n.dueDate || '',
        doodle: n.doodle || null,
        createdAt: n.createdAt || Date.now(),
        updatedAt: n.updatedAt || Date.now()
      }));

      this.saveNotes(sanitized);
      return { success: true, count: sanitized.length, notes: sanitized };
    } catch (e) {
      console.error('Import failed:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Reset data to default starter notes
   */
  resetToDefaults() {
    const defaults = this.getDefaultNotes();
    this.saveNotes(defaults);
    return defaults;
  }
};

window.Storage = Storage;
