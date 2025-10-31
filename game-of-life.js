// Conway's Game of Life interactive background
class GameOfLife {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.cellSize = 8;
    this.cols = 0;
    this.rows = 0;
    this.grid = [];
    this.nextGrid = [];
    this.mouseX = -1;
    this.mouseY = -1;
    this.mouseRadius = 3;
    this.lastSpawn = 0;
    this.spawnInterval = 50;
    this.lastUpdate = 0;
    this.updateInterval = 150; // Slow down the simulation (ms between updates)

    this.setupCanvas();
    this.setupEventListeners();
    this.initializeGrid();
    this.animate();
  }

  setupCanvas() {
    this.canvas.id = "game-of-life";
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "-1";
    this.canvas.style.opacity = "0.15";
    this.canvas.style.pointerEvents = "none";
    document.body.appendChild(this.canvas);

    this.resize();
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("mousemove", (e) => {
      this.mouseX = Math.floor(e.clientX / this.cellSize);
      this.mouseY = Math.floor(e.clientY / this.cellSize);
    });
    document.addEventListener("mouseleave", () => {
      this.mouseX = -1;
      this.mouseY = -1;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.cols = Math.ceil(this.canvas.width / this.cellSize);
    this.rows = Math.ceil(this.canvas.height / this.cellSize);
    this.initializeGrid();
  }

  initializeGrid() {
    this.grid = [];
    this.nextGrid = [];

    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      this.nextGrid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0; // Start with empty grid
        this.nextGrid[i][j] = 0;
      }
    }
  }

  countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = (row + i + this.rows) % this.rows;
        const newCol = (col + j + this.cols) % this.cols;
        count += this.grid[newRow][newCol];
      }
    }
    return count;
  }

  update() {
    const now = Date.now();

    // Spawn cells near mouse cursor
    if (
      this.mouseX >= 0 &&
      this.mouseY >= 0 &&
      now - this.lastSpawn > this.spawnInterval
    ) {
      for (let i = -this.mouseRadius; i <= this.mouseRadius; i++) {
        for (let j = -this.mouseRadius; j <= this.mouseRadius; j++) {
          const row = this.mouseY + i;
          const col = this.mouseX + j;
          if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            if (Math.random() < 0.3) {
              this.grid[row][col] = 1;
            }
          }
        }
      }
      this.lastSpawn = now;
    }

    // Only update the simulation at the specified interval
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }
    this.lastUpdate = now;

    // Apply Conway's Game of Life rules
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const neighbors = this.countNeighbors(i, j);
        const cell = this.grid[i][j];

        if (cell === 1) {
          // Cell is alive
          this.nextGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          // Cell is dead
          this.nextGrid[i][j] = neighbors === 3 ? 1 : 0;
        }
      }
    }

    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }

  draw() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#000000";
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 1) {
          this.ctx.fillRect(
            j * this.cellSize,
            i * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
          );
        }
      }
    }
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new GameOfLife();
  });
} else {
  new GameOfLife();
}
