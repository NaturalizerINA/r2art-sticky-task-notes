/**
 * R2Art Sticky Task Notes - Doodle & Sketch Studio
 * HTML5 Canvas drawing tool for sketches on sticky notes
 */

const DoodleStudio = {
  canvas: null,
  ctx: null,
  isDrawing: false,
  lastX: 0,
  lastY: 0,
  currentColor: '#191816',
  currentSize: 3,
  isEraser: false,
  activeCallback: null,

  init() {
    this.canvas = document.getElementById('doodleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

    this.bindEvents();
    this.setupPalette();
  },

  setupPalette() {
    const colorButtons = document.querySelectorAll('.doodle-color-btn');
    colorButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentColor = btn.getAttribute('data-color');
        this.isEraser = false;
        document.getElementById('doodleEraserBtn')?.classList.remove('active');
        document.getElementById('doodlePenBtn')?.classList.add('active');
      });
    });

    const sizeInput = document.getElementById('doodleSizeInput');
    if (sizeInput) {
      sizeInput.addEventListener('input', (e) => {
        this.currentSize = parseInt(e.target.value, 10) || 3;
        const sizeVal = document.getElementById('doodleSizeVal');
        if (sizeVal) sizeVal.textContent = `${this.currentSize}px`;
      });
    }

    const penBtn = document.getElementById('doodlePenBtn');
    const eraserBtn = document.getElementById('doodleEraserBtn');
    const clearBtn = document.getElementById('doodleClearBtn');

    if (penBtn) {
      penBtn.addEventListener('click', () => {
        this.isEraser = false;
        penBtn.classList.add('active');
        eraserBtn?.classList.remove('active');
      });
    }

    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => {
        this.isEraser = true;
        eraserBtn.classList.add('active');
        penBtn?.classList.remove('active');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clear();
      });
    }
  },

  bindEvents() {
    if (!this.canvas) return;

    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => this.startDraw(e));
    this.canvas.addEventListener('mousemove', (e) => this.draw(e));
    this.canvas.addEventListener('mouseup', () => this.stopDraw());
    this.canvas.addEventListener('mouseleave', () => this.stopDraw());

    // Touch Events for Mobile / Tablet
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const clientX = touch.clientX;
      const clientY = touch.clientY;
      this.startDraw({ clientX, clientY });
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const clientX = touch.clientX;
      const clientY = touch.clientY;
      this.draw({ clientX, clientY });
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => this.stopDraw());
  },

  getCoordinates(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  },

  startDraw(e) {
    this.isDrawing = true;
    const { x, y } = this.getCoordinates(e);
    this.lastX = x;
    this.lastY = y;
  },

  draw(e) {
    if (!this.isDrawing || !this.ctx) return;
    const { x, y } = this.getCoordinates(e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.isEraser) {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.lineWidth = this.currentSize * 4;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.currentSize;
    }

    this.ctx.stroke();
    this.lastX = x;
    this.lastY = y;
  },

  stopDraw() {
    this.isDrawing = false;
  },

  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  open(existingDoodleDataUrl, callback) {
    this.activeCallback = callback;
    const modal = document.getElementById('doodleModal');
    if (modal) modal.classList.add('active');

    // Resize canvas internal buffer if needed
    if (this.canvas) {
      this.canvas.width = 460;
      this.canvas.height = 300;
      this.clear();

      if (existingDoodleDataUrl) {
        const img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = existingDoodleDataUrl;
      }
    }
  },

  close() {
    const modal = document.getElementById('doodleModal');
    if (modal) modal.classList.remove('active');
    this.activeCallback = null;
  },

  save() {
    if (!this.canvas) return;
    const dataUrl = this.canvas.toDataURL('image/png');
    if (this.activeCallback) {
      this.activeCallback(dataUrl);
    }
    this.close();
  }
};

window.DoodleStudio = DoodleStudio;
