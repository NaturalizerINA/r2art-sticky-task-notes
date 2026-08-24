/**
 * R2Art Sticky Task Notes - i18n Localization Dictionary
 * Supported Languages: Bahasa Indonesia ('id'), English ('en')
 */

const I18N = {
  currentLang: 'id',

  translations: {
    id: {
      // Header & Navigation
      appTitle: 'R2Art Sticky Task Notes',
      appSubtitle: 'Papan Catatan & Manajemen Tugas Visual',
      viewCanvas: 'Papan Bebas',
      viewKanban: 'Kanban',
      viewGrid: 'Grid',
      viewTimeline: 'Jadwal',
      
      // Toolbar Actions
      btnNewNote: 'Catatan Baru',
      btnQuickAdd: 'Tambah Cepat',
      searchPlaceholder: 'Cari catatan, tag, atau checklist... (Tekan /)',
      filterAll: 'Semua',
      filterTags: 'Tag',
      filterPriority: 'Prioritas',
      filterColor: 'Warna',
      filterStatus: 'Status',
      sortBy: 'Urutkan:',
      sortUpdated: 'Terbaru Diubah',
      sortCreated: 'Terbaru Dibuat',
      sortPriority: 'Prioritas Tertinggi',
      sortDueDate: 'Tenggat Waktu',
      sortTitle: 'Judul (A-Z)',
      
      // Features & Tools
      btnTimer: 'Pomodoro',
      btnStats: 'Statistik',
      btnDoodle: 'Gambar / Sketsa',
      btnExport: 'Ekspor / Impor',
      btnSettings: 'Pengaturan',
      btnThemeToggle: 'Ganti Tema',
      btnSoundToggle: 'Efek Suara',
      soundOn: 'Suara Aktif',
      soundOff: 'Suara Senyap',
      btnSnapGrid: 'Snap ke Grid',
      
      // Kanban Columns
      colBacklog: 'Ide & Catatan',
      colTodo: 'Akan Dikerjakan',
      colInProgress: 'Sedang Proses',
      colDone: 'Selesai',
      addCardToCol: '+ Tambah catatan ke kolom ini',

      // Timeline Categories
      timelineOverdue: 'Terlewat / Overdue',
      timelineToday: 'Hari Ini',
      timelineThisWeek: 'Minggu Ini',
      timelineLater: 'Mendatang',
      timelineNoDate: 'Tanpa Tenggat',

      // Note Modal / Form
      modalNewTitle: 'Buat Sticky Note Baru',
      modalEditTitle: 'Edit Sticky Note',
      labelTitle: 'Judul Catatan',
      placeholderTitle: 'Contoh: Rilis Fitur Baru v2.0...',
      labelContent: 'Isi Catatan / Deskripsi',
      placeholderContent: 'Tulis detail, ide, atau catatan di sini...',
      labelChecklist: 'Checklist / Subtugas',
      placeholderChecklist: 'Tambah item checklist baru...',
      btnAddChecklist: 'Tambah',
      labelColor: 'Warna Kertas',
      labelAccent: 'Gaya Tempelan',
      accentPin: 'Pushpin 📌',
      accentTape: 'Washi Tape 🏷️',
      accentClip: 'Paperclip 📎',
      accentPlain: 'Polos / Bersih 📄',
      labelPriority: 'Tingkat Prioritas',
      priorityLow: 'Rendah (Low)',
      priorityMedium: 'Sedang (Medium)',
      priorityHigh: 'Tinggi (High)',
      priorityUrgent: 'Mendesak (Urgent)',
      labelStatus: 'Status Alur Kerja',
      labelDueDate: 'Tenggat Waktu',
      labelTags: 'Label / Tag (Pisahkan dengan koma)',
      placeholderTags: 'desain, frontend, urgent, personal',
      labelAttachment: 'Lampiran Gambar / Sketsa',
      btnDrawDoodle: '✏️ Gambar Sketsa Baru',
      btnRemoveDoodle: 'Hapus Sketsa',
      btnSaveNote: 'Simpan Catatan',
      btnCancel: 'Batal',
      btnDeleteNote: 'Hapus Catatan',
      btnDuplicateNote: 'Duplikat',

      // Doodle Canvas Modal
      doodleTitle: 'Studio Sketsa & Doodle',
      doodleColor: 'Warna Spidol:',
      doodleSize: 'Ukuran:',
      doodleEraser: 'Penghapus',
      doodlePen: 'Pena',
      doodleClear: 'Bersihkan',
      doodleSave: 'Gunakan di Catatan',
      doodleClose: 'Tutup',

      // Pomodoro Timer Widget
      pomodoroTitle: 'Focus Pomodoro',
      pomoWork: 'Fokus (25m)',
      pomoShortBreak: 'Rehat Singkat (5m)',
      pomoLongBreak: 'Rehat Panjang (15m)',
      pomoStart: 'Mulai',
      pomoPause: 'Jeda',
      pomoReset: 'Reset',
      pomoActiveTask: 'Tugas Terpilih:',
      pomoNoTask: 'Tidak ada tugas yang ditautkan',
      pomoCompletedSessions: 'Sesi Fokus Selesai:',

      // Stats Modal
      statsTitle: 'Statistik & Ringkasan Produktivitas',
      statsTotalNotes: 'Total Catatan',
      statsCompletedTasks: 'Tugas Selesai',
      statsPendingTasks: 'Tugas Berjalan',
      statsCompletionRate: 'Tingkat Penyelesaian',
      statsChecklistItems: 'Subtugas Checklist Selesai',
      statsByPriority: 'Distribusi Prioritas',
      statsByTags: 'Tag Terpopuler',
      statsNoData: 'Belum ada data yang cukup.',

      // Export / Import Modal
      exportTitle: 'Ekspor & Cadangkan Data',
      exportDesc: 'Simpan catatan Anda ke file lokal atau unduh tangkapan layar papan.',
      btnExportJSON: 'Unduh Cadangan (JSON)',
      btnExportMD: 'Ekspor Catatan (Markdown)',
      btnExportPNG: 'Unduh Gambar Papan (PNG Snapshot)',
      importTitle: 'Impor & Pulihkan Data',
      importDesc: 'Pilih file JSON cadangan untuk memuat kembali catatan Anda.',
      btnImportFile: 'Pilih File JSON',
      btnResetAll: 'Kembalikan Catatan Bawaan (Reset)',
      confirmReset: 'Apakah Anda yakin ingin mengatur ulang ke catatan bawaan? Semua data saat ini akan diganti.',
      importSuccess: 'Data berhasil diimpor!',
      importError: 'File cadangan JSON tidak valid atau rusak.',

      // Note Card Actions & Badges
      pinTooltip: 'Sematkan ke depan',
      editTooltip: 'Edit catatan',
      deleteTooltip: 'Hapus catatan',
      duplicateTooltip: 'Duplikasi catatan',
      dragTooltip: 'Tahan dan geser untuk memindahkan',
      overdueBadge: 'Terlambat!',
      todayBadge: 'Hari Ini',
      progressText: '{done} dari {total} ({pct}%)',
      emptyBoardTitle: 'Papan Masih Kosong',
      emptyBoardDesc: 'Klik tombol "+ Catatan Baru" atau klik dua kali di sembarang area papan untuk membuat sticky note pertama Anda!',
      emptyKanbanCol: 'Belum ada catatan di kolom ini.',

      // Notifications / Toast
      toastNoteCreated: 'Catatan berhasil dibuat! ✨',
      toastNoteUpdated: 'Catatan diperbarui! 📝',
      toastNoteDeleted: 'Catatan telah dihapus! 🗑️',
      toastNoteDuplicated: 'Catatan diduplikasi! 📋',
      toastPomoComplete: '🎉 Waktu fokus selesai! Waktunya istirahat.',
      toastPomoBreakComplete: '🔔 Istirahat selesai! Siap fokus kembali?',
      toastExported: 'File berhasil diunduh! 🚀',
      toastScreenshotReady: 'Snapshot papan berhasil dibuat! 🖼️',
      toastTagFiltered: 'Memfilter dengan tag: #{tag}',
      toastClearedFilter: 'Semua filter dibersihkan'
    },

    en: {
      // Header & Navigation
      appTitle: 'R2Art Sticky Task Notes',
      appSubtitle: 'Visual Sticky Note & Task Management Board',
      viewCanvas: 'Freeform Canvas',
      viewKanban: 'Kanban Board',
      viewGrid: 'Grid View',
      viewTimeline: 'Timeline',

      // Toolbar Actions
      btnNewNote: 'New Note',
      btnQuickAdd: 'Quick Add',
      searchPlaceholder: 'Search notes, tags, or checklists... (Press /)',
      filterAll: 'All',
      filterTags: 'Tags',
      filterPriority: 'Priority',
      filterColor: 'Color',
      filterStatus: 'Status',
      sortBy: 'Sort by:',
      sortUpdated: 'Recently Updated',
      sortCreated: 'Recently Created',
      sortPriority: 'Highest Priority',
      sortDueDate: 'Due Date',
      sortTitle: 'Title (A-Z)',

      // Features & Tools
      btnTimer: 'Pomodoro',
      btnStats: 'Statistics',
      btnDoodle: 'Doodle Sketch',
      btnExport: 'Export / Import',
      btnSettings: 'Settings',
      btnThemeToggle: 'Toggle Theme',
      btnSoundToggle: 'Sound FX',
      soundOn: 'Sound Active',
      soundOff: 'Sound Muted',
      btnSnapGrid: 'Snap to Grid',

      // Kanban Columns
      colBacklog: 'Ideas & Notes',
      colTodo: 'To Do',
      colInProgress: 'In Progress',
      colDone: 'Completed',
      addCardToCol: '+ Add note to this column',

      // Timeline Categories
      timelineOverdue: 'Overdue',
      timelineToday: 'Today',
      timelineThisWeek: 'This Week',
      timelineLater: 'Upcoming',
      timelineNoDate: 'No Due Date',

      // Note Modal / Form
      modalNewTitle: 'Create New Sticky Note',
      modalEditTitle: 'Edit Sticky Note',
      labelTitle: 'Note Title',
      placeholderTitle: 'E.g.: Launch feature v2.0...',
      labelContent: 'Note Content / Details',
      placeholderContent: 'Write details, thoughts, or ideas here...',
      labelChecklist: 'Subtask Checklist',
      placeholderChecklist: 'Add new checklist item...',
      btnAddChecklist: 'Add',
      labelColor: 'Paper Color',
      labelAccent: 'Attachment Style',
      accentPin: 'Pushpin 📌',
      accentTape: 'Washi Tape 🏷️',
      accentClip: 'Paperclip 📎',
      accentPlain: 'Minimalist 📄',
      labelPriority: 'Priority Level',
      priorityLow: 'Low',
      priorityMedium: 'Medium',
      priorityHigh: 'High',
      priorityUrgent: 'Urgent',
      labelStatus: 'Workflow Status',
      labelDueDate: 'Due Date',
      labelTags: 'Tags / Labels (Comma separated)',
      placeholderTags: 'design, frontend, urgent, personal',
      labelAttachment: 'Sketch / Doodle Attachment',
      btnDrawDoodle: '✏️ Draw New Doodle',
      btnRemoveDoodle: 'Remove Doodle',
      btnSaveNote: 'Save Note',
      btnCancel: 'Cancel',
      btnDeleteNote: 'Delete Note',
      btnDuplicateNote: 'Duplicate',

      // Doodle Canvas Modal
      doodleTitle: 'Doodle & Sketch Studio',
      doodleColor: 'Marker Color:',
      doodleSize: 'Size:',
      doodleEraser: 'Eraser',
      doodlePen: 'Pen',
      doodleClear: 'Clear Canvas',
      doodleSave: 'Attach to Note',
      doodleClose: 'Close',

      // Pomodoro Timer Widget
      pomodoroTitle: 'Focus Pomodoro',
      pomoWork: 'Focus (25m)',
      pomoShortBreak: 'Short Break (5m)',
      pomoLongBreak: 'Long Break (15m)',
      pomoStart: 'Start',
      pomoPause: 'Pause',
      pomoReset: 'Reset',
      pomoActiveTask: 'Active Task:',
      pomoNoTask: 'No linked task',
      pomoCompletedSessions: 'Focus Sessions Completed:',

      // Stats Modal
      statsTitle: 'Productivity Statistics & Summary',
      statsTotalNotes: 'Total Notes',
      statsCompletedTasks: 'Completed Tasks',
      statsPendingTasks: 'Pending Tasks',
      statsCompletionRate: 'Completion Rate',
      statsChecklistItems: 'Checklist Subtasks Done',
      statsByPriority: 'Priority Distribution',
      statsByTags: 'Top Tags',
      statsNoData: 'Not enough data yet.',

      // Export / Import Modal
      exportTitle: 'Export & Backup Data',
      exportDesc: 'Save your sticky notes to a local backup file or download a board snapshot.',
      btnExportJSON: 'Download JSON Backup',
      btnExportMD: 'Export Notes as Markdown',
      btnExportPNG: 'Download Board Image (PNG Snapshot)',
      importTitle: 'Import & Restore Data',
      importDesc: 'Select a JSON backup file to restore your notes.',
      btnImportFile: 'Select JSON File',
      btnResetAll: 'Reset to Starter Notes',
      confirmReset: 'Are you sure you want to reset to demo notes? Current data will be replaced.',
      importSuccess: 'Data imported successfully!',
      importError: 'Invalid or corrupted JSON backup file.',

      // Note Card Actions & Badges
      pinTooltip: 'Bring to front / Pin',
      editTooltip: 'Edit note',
      deleteTooltip: 'Delete note',
      duplicateTooltip: 'Duplicate note',
      dragTooltip: 'Drag and hold to move',
      overdueBadge: 'Overdue!',
      todayBadge: 'Today',
      progressText: '{done} of {total} ({pct}%)',
      emptyBoardTitle: 'Board is currently empty',
      emptyBoardDesc: 'Click "+ New Note" or double-click anywhere on the corkboard to create your first sticky note!',
      emptyKanbanCol: 'No notes in this column yet.',

      // Notifications / Toast
      toastNoteCreated: 'Sticky note created! ✨',
      toastNoteUpdated: 'Note updated! 📝',
      toastNoteDeleted: 'Note removed! 🗑️',
      toastNoteDuplicated: 'Note duplicated! 📋',
      toastPomoComplete: '🎉 Focus session complete! Time for a break.',
      toastPomoBreakComplete: '🔔 Break finished! Ready to focus?',
      toastExported: 'File exported successfully! 🚀',
      toastScreenshotReady: 'Board snapshot generated! 🖼️',
      toastTagFiltered: 'Filtering by tag: #{tag}',
      toastClearedFilter: 'All filters cleared'
    }
  },

  /**
   * Get translation string by key with optional replacements
   */
  t(key, replacements = {}) {
    const lang = this.currentLang;
    let text = this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
    
    Object.keys(replacements).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), replacements[k]);
    });

    return text;
  },

  /**
   * Set active language and trigger DOM updates
   */
  setLang(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('r2art_notes_lang', lang);
      this.updateDOM();
      document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  },

  /**
   * Initialize language from storage or navigator
   */
  init() {
    const saved = localStorage.getItem('r2art_notes_lang');
    if (saved && this.translations[saved]) {
      this.currentLang = saved;
    } else {
      const browserLang = navigator.language?.startsWith('id') ? 'id' : 'en';
      this.currentLang = browserLang;
    }
    this.updateDOM();
  },

  /**
   * Update all elements with data-i18n attributes
   */
  updateDOM() {
    document.documentElement.lang = this.currentLang;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = this.t(key);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = this.t(key);
      }
    });

    // Update active state in switcher UI if present
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
};

window.I18N = I18N;
