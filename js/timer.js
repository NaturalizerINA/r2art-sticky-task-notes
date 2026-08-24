/**
 * R2Art Sticky Task Notes - Pomodoro Focus Timer Widget
 * Focus cycles, break reminders, active task indicator & audio chime alerts
 */

const PomodoroTimer = {
  MODES: {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  },
  currentMode: 'work',
  timeLeft: 25 * 60,
  timerId: null,
  isRunning: false,
  completedCycles: 0,
  activeTaskId: null,
  activeTaskTitle: '',

  init() {
    this.bindEvents();
    this.updateDisplay();
  },

  bindEvents() {
    const startBtn = document.getElementById('pomoStartBtn');
    const pauseBtn = document.getElementById('pomoPauseBtn');
    const resetBtn = document.getElementById('pomoResetBtn');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    document.querySelectorAll('.pomo-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-mode');
        if (mode && this.MODES[mode]) {
          document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.setMode(mode);
        }
      });
    });

    const closeBtn = document.getElementById('pomoCloseBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleWidget(false));
    }

    // Dismiss centered Pomodoro popup when clicking outside
    document.addEventListener('pointerdown', (e) => {
      const widget = document.getElementById('pomodoroWidget');
      const toggleBtn = document.getElementById('btnTogglePomodoro');
      if (widget && widget.classList.contains('active')) {
        if (!widget.contains(e.target) && !toggleBtn?.contains(e.target) && !e.target.closest('.note-timer-link-btn')) {
          this.toggleWidget(false);
        }
      }
    });
  },

  toggleWidget(show) {
    const widget = document.getElementById('pomodoroWidget');
    if (!widget) return;
    if (show === undefined) {
      widget.classList.toggle('active');
    } else if (show) {
      widget.classList.add('active');
    } else {
      widget.classList.remove('active');
    }
  },

  linkTask(noteId, noteTitle) {
    this.activeTaskId = noteId;
    this.activeTaskTitle = noteTitle;
    const taskEl = document.getElementById('pomoActiveTaskTitle');
    if (taskEl) {
      taskEl.textContent = noteTitle || window.I18N.t('pomoNoTask');
    }
    this.toggleWidget(true);
  },

  setMode(mode) {
    this.pause();
    this.currentMode = mode;
    this.timeLeft = this.MODES[mode];
    this.updateDisplay();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    document.getElementById('pomoStartBtn')?.classList.add('hidden');
    document.getElementById('pomoPauseBtn')?.classList.remove('hidden');

    if (window.SoundFX) window.SoundFX.playPin();

    this.timerId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplay();
      } else {
        this.complete();
      }
    }, 1000);
  },

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerId);
    this.timerId = null;

    document.getElementById('pomoStartBtn')?.classList.remove('hidden');
    document.getElementById('pomoPauseBtn')?.classList.add('hidden');
  },

  reset() {
    this.pause();
    this.timeLeft = this.MODES[this.currentMode];
    this.updateDisplay();
  },

  complete() {
    this.pause();

    if (window.SoundFX) window.SoundFX.playTimerBell();

    if (this.currentMode === 'work') {
      this.completedCycles++;
      const cyclesEl = document.getElementById('pomoCompletedCount');
      if (cyclesEl) cyclesEl.textContent = this.completedCycles;

      const msg = window.I18N.t('toastPomoComplete');
      if (window.App && window.App.showToast) {
        window.App.showToast(msg);
      }

      // Auto switch to short break or long break (every 4 cycles)
      const nextMode = (this.completedCycles % 4 === 0) ? 'longBreak' : 'shortBreak';
      this.setMode(nextMode);
      document.querySelectorAll('.pomo-mode-btn').forEach(b => {
        if (b.getAttribute('data-mode') === nextMode) b.classList.add('active');
        else b.classList.remove('active');
      });
    } else {
      const msg = window.I18N.t('toastPomoBreakComplete');
      if (window.App && window.App.showToast) {
        window.App.showToast(msg);
      }
      this.setMode('work');
      document.querySelectorAll('.pomo-mode-btn').forEach(b => {
        if (b.getAttribute('data-mode') === 'work') b.classList.add('active');
        else b.classList.remove('active');
      });
    }
  },

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const timeEl = document.getElementById('pomoTimeDisplay');
    if (timeEl) timeEl.textContent = formatted;

    // Update Progress Ring / Bar
    const totalTime = this.MODES[this.currentMode];
    const progressPct = ((totalTime - this.timeLeft) / totalTime) * 100;
    const progressFill = document.getElementById('pomoProgressFill');
    if (progressFill) {
      progressFill.style.width = `${progressPct}%`;
    }

    // Update browser title during focus
    if (this.isRunning) {
      document.title = `(${formatted}) ${this.activeTaskTitle ? this.activeTaskTitle.slice(0, 20) : 'Pomodoro'} - R2Art`;
    } else {
      document.title = window.I18N.t('appTitle') || 'R2Art Sticky Task Notes';
    }
  }
};

window.PomodoroTimer = PomodoroTimer;
