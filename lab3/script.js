const GAME_AREA_WIDTH = 900;
const GAME_AREA_HEIGHT = 600;

const PADDLE_SPEED = 3;
const PADDLE_WIDTH = 150;
const PADDLE_HEIGHT = 20;
const PADDLE_Y_OFFSET = GAME_AREA_HEIGHT - PADDLE_HEIGHT - 10;
const PADDLE_X_OFFSET = GAME_AREA_WIDTH / 2 - PADDLE_WIDTH / 2;

const BALL_RADIUS = 15;
const BALL_SPEED = 1;
const MAX_BOUNCE_ANGLE = Math.PI / 3;
const BALL_START_X = PADDLE_X_OFFSET;
const BALL_START_Y = PADDLE_Y_OFFSET;

const BRICK_ROWS = 5;
const BRICK_COLUMNS = 10;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING_HORIZONTAL = 30;
const BRICK_PADDING_VERTICAL = 15;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT =
  (GAME_AREA_WIDTH -
    BRICK_COLUMNS * BRICK_WIDTH -
    (BRICK_COLUMNS - 1) * BRICK_PADDING_HORIZONTAL) /
  2;

class Paddle {
  constructor(pos_x, pos_y, width, height, speed) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.fillRect(this.pos_x, this.pos_y, this.width, this.height);
    ctx.strokeRect(this.pos_x, this.pos_y, this.width, this.height);
  }

  move(direction, game_area_width) {
    if (direction === "left" && this.pos_x > 0) {
      this.pos_x -= this.speed;
    } else if (
      direction === "right" &&
      this.pos_x < game_area_width - this.width
    ) {
      this.pos_x += this.speed;
    }
  }
}

class Ball {
  constructor(pos_x, pos_y, speed_x, speed_y, radius, color) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.speed_x = speed_x;
    this.speed_y = speed_y;
    this.radius = radius;
    this.color = color;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos_x, this.pos_y);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  bounce(angle) {
    const speed = Math.sqrt(this.speed_x ** 2 + this.speed_y ** 2);
    this.speed_x = speed * Math.sin(angle);
    this.speed_y = -speed * Math.cos(angle);
  }

  new_position() {
    this.pos_x += this.speed_x;
    this.pos_y += this.speed_y;
  }
}

class Brick {
  constructor(pos_x, pos_y, width, height, color) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.is_destroyed = false;
  }

  draw(ctx) {
    if (!this.is_destroyed) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.pos_x, this.pos_y, this.width, this.height);
      ctx.strokeRect(this.pos_x, this.pos_y, this.width, this.height);
    }
  }
}

class GameArea {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }

  draw() {
    this.canvas.id = "gameCanvas";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

class Game {
  constructor() {
    this.game_area = new GameArea(GAME_AREA_WIDTH, GAME_AREA_HEIGHT);
    this.paddle = new Paddle(
      PADDLE_X_OFFSET,
      PADDLE_Y_OFFSET,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      PADDLE_SPEED,
    );
    this.running = false;
    this.score = 0;
    this.high_score = localStorage.getItem("high_score") || 0;
    this.keys = {
      left: false,
      right: false,
    };
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        this.keys.left = true;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        this.keys.right = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        this.keys.left = false;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        this.keys.right = false;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.pause();
      }
    });
    this.ball = new Ball(
      BALL_START_X,
      BALL_START_Y,
      BALL_SPEED,
      -BALL_SPEED,
      BALL_RADIUS,
      "white",
    );
    this.bricks = [];
    this.create_bricks();
    this.start_handler = (event) => {
      if (event.key === " ") {
        this.run();
      }
    };
    this.restart_handler = (event) => {
      if (event.key === "r" || event.key === "R") {
        this.reset();
      }
    };
  }

  create_bricks() {
    const colors = ["red", "brown", "pink", "green", "yellow"];
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLUMNS; c++) {
        const brick_x =
          c * (BRICK_WIDTH + BRICK_PADDING_HORIZONTAL) + BRICK_OFFSET_LEFT;
        const brick_y =
          r * (BRICK_HEIGHT + BRICK_PADDING_VERTICAL) + BRICK_OFFSET_TOP;
        this.bricks.push(
          new Brick(brick_x, brick_y, BRICK_WIDTH, BRICK_HEIGHT, colors[r]),
        );
      }
    }
  }

  check_collision(ball, rectangle) {
    const closest_x = Math.max(
      rectangle.pos_x,
      Math.min(ball.pos_x, rectangle.pos_x + rectangle.width),
    );
    const closest_y = Math.max(
      rectangle.pos_y,
      Math.min(ball.pos_y, rectangle.pos_y + rectangle.height),
    );
    const vx = ball.pos_x - closest_x;
    const vy = ball.pos_y - closest_y;
    const distance_squared = vx ** 2 + vy ** 2;
    if (distance_squared <= ball.radius ** 2) {
      return true;
    } else {
      return false;
    }
  }

  calculate_bounce_paddle() {
    const paddle_center = this.paddle.pos_x + this.paddle.width / 2;
    const relative_intersect_x = this.ball.pos_x - paddle_center;
    const normalized_intersect_x = Math.max(
      -1,
      Math.min(1, relative_intersect_x / (this.paddle.width / 2)),
    );
    return normalized_intersect_x * MAX_BOUNCE_ANGLE;
  }

  check_paddle_collision() {
    if (this.ball.speed_y > 0 && this.check_collision(this.ball, this.paddle)) {
      this.ball.pos_y = this.paddle.pos_y - this.ball.radius;
      const angle = this.calculate_bounce_paddle();
      this.ball.bounce(angle);
    }
  }

  check_brick_collision() {
    for (const brick of this.bricks) {
      if (!brick.is_destroyed && this.check_collision(this.ball, brick)) {
        const overlap_x =
          this.ball.radius +
          brick.width / 2 -
          Math.abs(this.ball.pos_x - (brick.pos_x + brick.width / 2));
        const overlap_y =
          this.ball.radius +
          brick.height / 2 -
          Math.abs(this.ball.pos_y - (brick.pos_y + brick.height / 2));
        if (overlap_x < overlap_y) {
          this.ball.speed_x *= -1;
        } else {
          this.ball.speed_y *= -1;
        }
        brick.is_destroyed = true;
        this.score += 1;
        if (this.score > this.high_score) {
          this.high_score = this.score;
          localStorage.setItem("high_score", this.high_score);
        }
        break;
      }
    }
  }

  check_wall_collision() {
    if (this.ball.pos_x + this.ball.speed_x < this.ball.radius) {
      this.ball.pos_x = this.ball.radius;
      this.ball.speed_x *= -1;
    }
    if (
      this.ball.pos_x + this.ball.speed_x >
      this.game_area.width - this.ball.radius
    ) {
      this.ball.pos_x = this.game_area.width - this.ball.radius;
      this.ball.speed_x *= -1;
    }
    if (this.ball.pos_y + this.ball.speed_y < this.ball.radius) {
      this.ball.pos_y = this.ball.radius;
      this.ball.speed_y *= -1;
    }
    if (
      this.ball.pos_y + this.ball.speed_y >
      this.game_area.height - this.ball.radius
    ) {
      this.ball.pos_y = this.game_area.height - this.ball.radius;
      this.ball.speed_y *= -1;
    }
    if (this.ball.pos_y + this.ball.radius >= this.game_area.height) {
      this.stop("GAME OVER");
    }
  }

  check_collisions() {
    this.check_paddle_collision();
    this.check_brick_collision();
    this.check_wall_collision();
  }

  update() {
    this.game_area.clear();
    this.game_area.ctx.font = "bold 18px Verdana";
    this.game_area.ctx.fillStyle = "white";
    this.game_area.ctx.textAlign = "left";
    this.game_area.ctx.textBaseline = "middle";
    this.game_area.ctx.fillText("Current score: " + this.score, 20, 20);
    this.game_area.ctx.textAlign = "right";
    this.game_area.ctx.fillText(
      "High score: " + this.high_score,
      GAME_AREA_WIDTH - 100,
      20,
    );
    this.ball.new_position(this.game_area);
    this.ball.draw(this.game_area.ctx);
    this.paddle.draw(this.game_area.ctx);
    this.bricks.forEach((brick) => brick.draw(this.game_area.ctx));
    if (this.keys.left) {
      this.paddle.move("left", this.game_area.width);
    }
    if (this.keys.right) {
      this.paddle.move("right", this.game_area.width);
    }
    this.check_collisions();
    if (this.score === 50) {
      this.stop("CONGRATULATIONS, YOU WIN!");
    }
    if (this.running) {
      this.animation_id = requestAnimationFrame(() => this.update());
    }
  }

  start() {
    this.game_area.draw();
    this.game_area.ctx.font = "bold 36px Verdana";
    this.game_area.ctx.fillStyle = "white";
    this.game_area.ctx.textAlign = "center";
    this.game_area.ctx.textBaseline = "middle";
    this.game_area.ctx.fillText(
      "BREAKOUT",
      this.game_area.width / 2,
      this.game_area.height / 2,
    );
    this.game_area.ctx.font = "bold italic 18px Verdana";
    this.game_area.ctx.fillText(
      "Press SPACE to begin",
      this.game_area.width / 2,
      this.game_area.height / 2 + 10 + 36 / 2,
    );
    document.addEventListener("keydown", this.start_handler);
  }

  run() {
    document.removeEventListener("keydown", this.start_handler);
    this.game_area.clear();
    this.running = true;
    this.update();
  }

  stop(message) {
    if (this.running) {
      this.running = false;
      cancelAnimationFrame(this.animation_id);
      this.game_area.clear();
      this.game_area.ctx.font = "bold 36px Verdana";
      this.game_area.ctx.fillStyle = "white";
      this.game_area.ctx.textAlign = "center";
      this.game_area.ctx.textBaseline = "middle";
      this.game_area.ctx.fillText(
        message,
        this.game_area.width / 2,
        this.game_area.height / 2,
      );
      this.game_area.ctx.font = "bold italic 18px Verdana";
      this.game_area.ctx.fillText(
        "Press R to restart",
        this.game_area.width / 2,
        this.game_area.height / 2 + 10 + 36 / 2,
      );
      document.addEventListener("keydown", this.restart_handler);
    }
  }

  pause() {
    if (this.running) {
      this.running = !this.running;
      cancelAnimationFrame(this.animation_id);
      this.game_area.ctx.font = "bold 36px Verdana";
      this.game_area.ctx.fillStyle = "white";
      this.game_area.ctx.textAlign = "center";
      this.game_area.ctx.textBaseline = "middle";
      this.game_area.ctx.fillText(
        "GAME PAUSED",
        this.game_area.width / 2,
        this.game_area.height / 2,
      );
    } else {
      this.running = !this.running;
      this.update();
    }
  }

  reset() {
    document.removeEventListener("keydown", this.restart_handler);
    this.ball.pos_x = BALL_START_X;
    this.ball.pos_y = BALL_START_Y;
    this.ball.speed_x = BALL_SPEED;
    this.ball.speed_y = -BALL_SPEED;
    this.paddle.pos_x = PADDLE_X_OFFSET;
    this.paddle.pos_y = PADDLE_Y_OFFSET;
    this.bricks = [];
    this.create_bricks();
    this.score = 0;
    this.keys.left = false;
    this.keys.right = false;
    this.run();
  }
}

function start_game() {
  const game = new Game();
  game.start();
}
