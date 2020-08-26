<template>
  <div class="gameBoard">
    <div>
      <h1>Vaporwave 2048</h1>
      <h1>Score: {{ gameScore }}</h1>
    </div>
    <div v-for="row in displayBoard" class="row" v-bind:key="row.key">
      <div
        v-for="tile in row"
        class="tile"
        v-bind:id="setId(tile)"
        v-bind:key="tile.key"
      >
        {{ tile }}
      </div>
    </div>
    <img class="statue" alt="David Statue" src="../assets/david.png" />
    <img class="arrowKeys" alt="Use arrow keys to move blocks" src="../assets/arrow_keys.gif" />
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "game",
  data() {
    return {
      currentHighScore: 0,
      name: "",
      gameBoard: [
        [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          {
            value: 0
          }
        ],
        [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          {
            value: 0
          }
        ],
        [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          {
            value: 0
          }
        ],
        [
          { value: 0 },
          { value: 0 },
          { value: 0 },
          {
            value: 0
          }
        ]
      ],
      boardChanged: false
    };
  },

  mounted() {
    const game = this;
    const database = firebase.firestore();
    const highscore = database.collection("highscores").doc("highscore");
    highscore
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Firebase: ", doc.data());
          game.currentHighScore = doc.data().Score;
          game.name = doc.data().Name;
        } else {
          console.error("ERROR: DB NOT FOUND");
        }
      })
      .catch(function(error) {
        console.log(error);
      });

    game.initializeStartingPlaceOfTwo();
    game.initializeStartingPlaceOfTwo();
    document.addEventListener("keydown", function(event) {
      if (event.which === 39) {
        game.slideRight();
      } else if (event.which === 37) {
        game.slideLeft();
      } else if (event.which === 38) {
        game.slideUp();
      } else if (event.which === 40) {
        game.slideDown();
      } else {
        return;
      }
      if (game.boardChanged) {
        game.initializeStartingPlaceOfTwo();
        game.boardChanged = false;
      }
    });
  },

  computed: {
    displayBoard() {
      return this.gameBoard.map(row => {
        return row.map(tile => {
          return tile.value;
        });
      });
    },
    gameScore() {
      let gameBoard = this.gameBoard;
      let score = 0;
      for (let i = 0; i < gameBoard.length; i++) {
        let row = gameBoard[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j].value !== 2) {
            score += row[j].value;
          }
        }
      }
      return score;
    },
    isWinner() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let row = gameBoard[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j].value === 2048) {
            return true;
          }
        }
      }
      return false;
    },
    isLoser() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let row = gameBoard[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j].value === 0) {
            return false;
          }
          if (row[j].value !== 0 && j !== 0) {
            if (row[j].value === row[j - 1].value) {
              return false;
            }
          }
        }
      }
      return true;
    }
  },

  methods: {
    boardHasChanged() {
      this.boardChanged = true;
    },
    initializeStartingPlaceOfTwo() {
      let game = this;
      let getRandomRow = function() {
        let row =
          game.gameBoard[Math.floor(Math.random() * game.gameBoard.length)];
        return row[Math.floor(Math.random() * row.length)];
      };

      let randomRow = getRandomRow();

      while (randomRow.value != 0) {
        randomRow = getRandomRow();
      }
      randomRow.value = 2;
    },
    slideUp() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let j = 1;
        let k = 0;

        while (j < 4) {
          if (gameBoard[j][i].value === gameBoard[k][i].value) {
            gameBoard[k][i].value =
              gameBoard[j][i].value + gameBoard[k][i].value;
            gameBoard[j][i].value = 0;
            this.boardHasChanged();
            k++;
            j++;
          } else if (
            (gameBoard[k][i].value === 0 && gameBoard[k][i].value === 0) ||
            (gameBoard[k][i].value === 0 ||
              (gameBoard[j][i].value != 0 &&
                gameBoard[k][i].value != 0 &&
                j - 1 == k))
          ) {
            k++;
            j++;
          } else if (gameBoard[j][i].value != 0 && gameBoard[k][i].value != 0) {
            k++;
          } else if (gameBoard[j][i].value === 0) {
            j++;
          }
        }
        for (let l = 0; l < gameBoard.length; l++) {
          for (let m = 0; m < gameBoard.length - 1; m++) {
            if (gameBoard[m][i].value === 0) {
              let tmp = gameBoard[m + 1][i].value;
              gameBoard[m + 1][i].value = 0;
              gameBoard[m][i].value = tmp;
              this.boardHasChanged();
            }
          }
        }
      }
    },
    slideDown() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let j = this.gameBoard.length - 2;
        let k = this.gameBoard.length - 1;

        while (j >= 0) {
          if (gameBoard[j][i].value === gameBoard[k][i].value) {
            gameBoard[k][i].value =
              gameBoard[j][i].value + gameBoard[k][i].value;
            gameBoard[j][i].value = 0;
            this.boardHasChanged();
            k--;
            j--;
          } else if (
            (gameBoard[k][i].value === 0 && gameBoard[k][i].value === 0) ||
            (gameBoard[k][i].value === 0 ||
              (gameBoard[j][i].value != 0 &&
                gameBoard[k][i].value != 0 &&
                j + 1 == k))
          ) {
            k--;
            j--;
          } else if (gameBoard[j][i].value != 0 && gameBoard[k][i].value != 0) {
            k--;
          } else if (gameBoard[j][i].value === 0) {
            j--;
          }
        }
        for (let l = 0; l < gameBoard.length; l++) {
          for (let m = gameBoard.length - 1; m > 0; m--) {
            if (gameBoard[m][i].value === 0) {
              let tmp = gameBoard[m - 1][i].value;
              gameBoard[m - 1][i].value = 0;
              gameBoard[m][i].value = tmp;
              this.boardHasChanged();
            }
          }
        }
      }
    },
    slideLeft() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let j = 1;
        let k = 0;

        while (j < 4) {
          if (gameBoard[i][j].value === gameBoard[i][k].value) {
            gameBoard[i][k].value =
              gameBoard[i][j].value + gameBoard[i][k].value;
            gameBoard[i][j].value = 0;
            this.boardHasChanged();
            k++;
            j++;
          } else if (
            (gameBoard[i][k].value === 0 && gameBoard[i][k].value === 0) ||
            (gameBoard[i][k].value === 0 ||
              (gameBoard[i][j].value != 0 &&
                gameBoard[i][k].value != 0 &&
                j - 1 == k))
          ) {
            k++;
            j++;
          } else if (gameBoard[i][j].value != 0 && gameBoard[i][k].value != 0) {
            k++;
          } else if (gameBoard[i][j].value === 0) {
            j++;
          }
        }
        for (let l = 0; l < gameBoard.length; l++) {
          for (let m = 0; m < gameBoard.length - 1; m++) {
            if (gameBoard[i][m].value === 0) {
              let temp = gameBoard[i][m + 1].value;
              gameBoard[i][m + 1].value = 0;
              gameBoard[i][m].value = temp;
              this.boardHasChanged();
            }
          }
        }
      }
    },
    slideRight() {
      let gameBoard = this.gameBoard;
      for (let i = 0; i < gameBoard.length; i++) {
        let j = this.gameBoard.length - 2;
        let k = this.gameBoard.length - 1;

        while (j >= 0) {
          if (gameBoard[i][j].value === gameBoard[i][k].value) {
            gameBoard[i][k].value =
              gameBoard[i][j].value + gameBoard[i][k].value;
            gameBoard[i][j].value = 0;
            this.boardHasChanged();
            k--;
            j--;
          } else if (
            (gameBoard[i][k].value === 0 && gameBoard[i][k].value === 0) ||
            (gameBoard[i][k].value === 0 ||
              (gameBoard[i][j].value != 0 &&
                gameBoard[i][k].value != 0 &&
                j + 1 == k))
          ) {
            k--;
            j--;
          } else if (gameBoard[i][j].value != 0 && gameBoard[i][k].value != 0) {
            k--;
          } else if (gameBoard[i][j].value === 0) {
            j--;
          }
        }
        for (let l = 0; l < gameBoard.length; l++) {
          for (let m = gameBoard.length - 1; m > 0; m--) {
            if (gameBoard[i][m].value === 0) {
              let tmp = gameBoard[i][m - 1].value;
              gameBoard[i][m - 1].value = 0;
              gameBoard[i][m].value = tmp;
              this.boardHasChanged();
            }
          }
        }
      }
    },
    saveHighScore() {
      const game = this;
      const database = firebase.firestore();
      const highscore = database.collection("highscores").doc("highscore");
      setTimeout(function() {
        let name = prompt(
          "HIGH SCORE!!!\nScore: " + game.gameScore + "\nEnter Your Name: ",
          ""
        );
        highscore
          .set({
            Name: name,
            Score: game.gameScore
          })
          .then(function() {
            console.log("Successfully wrote to DB!");
            if (!alert("Replay?")) {
              window.location.reload();
            }
          })
          .catch(function(error) {
            console.error(error);
          });
      });
    },
    setId(tile) {
      if (tile === 0) {
        return "zero";
      } else if (tile === 2) {
        return "two";
      } else if (tile === 4) {
        return "four";
      } else if (tile === 8) {
        return "eight";
      } else if (tile === 16) {
        return "sixteen";
      } else if (tile === 32) {
        return "thirtyTwo";
      } else if (tile === 64) {
        return "sixtyFour";
      } else if (tile === 128) {
        return "oneTwentyEight";
      } else if (tile === 256) {
        return "twoFiftySix";
      } else if (tile === 512) {
        return "fiveTwelve";
      } else if (tile === 1024) {
        return "tenTwentyFour";
      } else if (tile === 2048) {
        return "twentyFortyEight";
      }
    }
  },
  watch: {
    isLoser() {
      let game = this;
      if (game.isLoser === true) {
        if (game.gameScore >= game.currentHighScore) {
          console.log("LOSER! BUT YOU GOT A HIGH SCORE!");
          game.saveHighScore();
        } else {
          console.log("LOSER! BUT YOU DID'NT GET A HIGH SCORE!");
          if (!alert("You lose, no high score :c")) {
            window.location.reload();
          }
        }
      }
    },
    isWinner() {
      let game = this;
      if (game.isWinner === true) {
        let game = this;
        game.saveHighScore();
      }
    }
  }
};
</script>

<style scoped>
.gameBoard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  width: 95vw;
}

.row {
  margin: 0 auto;
  max-width: 10em;
  display: flex;
  justify-content: space-around;
  font-size: 3em;
}

.tile {
  width: 2em;
  height: 2em;
  margin: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Consolas, serif;
  border-radius: 10px;
  border-style: solid;
  border-color: lightcyan;
}

.arrowKeys {
  position: fixed;
  left: 0px;
  top: 0px;
  height: 50%;
  opacity: 0.7;
}

.statue {
  position: fixed;
  right: 0px;
  bottom: 0px;
  height: 50%;
  opacity: 0.6;
}

#zero {
  background-color: #f39bdd;
}
#two {
  background-color: #fdd6b5;
}
#four {
  background-color: #fdf3b8;
}
#eight {
  background-color: #a7e4ae;
}
#sixteen {
  background-color: #bfffe6;
}
#thirtyTwo {
  background-color: #8699d1;
}
#sixtyFour {
  background-color: #efe6eb;
}
#oneTwentyEight {
  background-color: #47d1d5;
}
#twoFiftySix {
  background-color: #e8d2ff;
}
#fiveTwelve {
  background-color: #d9e0fc;
}
#tenTwentyFour {
  background-color: #ffe0f1;
}
#twentyFortyEight {
  background-color: #efe6eb;
}
</style>
