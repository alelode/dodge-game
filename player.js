function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Player {
  constructor(brain) {
    this.y = height - 20;
    this.r = 12;
    this.x = random(0 + this.r, width - this.r);

    this.movespeed = 3;

    this.velocity = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(4, 8, 1);
    }

    // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }

  copy() {
    return new Player(this.brain);
  }

  show() {
    fill(10, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  // This is the key function now that decides
  think(tiles) {
    // First find the closest pipe
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < tiles.length; i++) {
      let diff = this.y - tiles[i].y;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = tiles[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      let inputs = [];

      inputs[0] = map(this.x, 0, width, 0, 1);
      inputs[1] = map(closest.y, this.y, height, 0, 1);
      inputs[2] = map(closest.left, 0, width, 0, 1);
      inputs[3] = map(closest.right, 0, width, 0, 1);

      // Get the outputs from the network
      let action = this.brain.predict(inputs);
      // Decide to jump or not!
      if (action[0] > 0.5) {
        this.left();
      } else {
        this.right();
      }
    }
  }

  left() {
    this.velocity = -1;
  }
  right() {
    this.velocity = 1;
  }

  update() {
    this.x += this.velocity;
    this.velocity = 0;
    this.score++;
  }
}
