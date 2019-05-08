
function resetGame() {
   
}

function nextGeneration() {
    resetGame();
    normalizeFitness(allPlayers);
    activePlayers = generate(allPlayers);
    allPlayers = activePlayers.slice();
}

function generate(oldPlayers) {
    let newPlayers = [];
    for (let i = 0; i < oldPlayers.length; i++) {
        let player = poolSelection(oldPlayers);
        newPlayers[i] = player;
    }

    console.log("New generation ", newPlayers[0].fitness);

    return newPlayers;
}

function normalizeFitness(players){
    for (let i = 0; i < players.length; i++) {
        players[i].score = pow(players[i].score, 2);
      }
    
      // Add up all the scores
      let sum = 0;
      for (let i = 0; i < players.length; i++) {
        sum += players[i].score;
      }
      // Divide by the sum
      for (let i = 0; i < players.length; i++) {
        players[i].fitness = players[i].score / sum;
      }
}

function poolSelection(players) {
    // Start at 0
    let index = 0;
  
    // Pick a random number between 0 and 1
    let r = random(1);
  
    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
      r -= players[index].fitness;
      // And move on to the next
      index += 1;
    }
  
    // Go back one
    index -= 1;
  
    // Make sure it's a copy!
    // (this includes mutation)
    return players[index].copy();
  }