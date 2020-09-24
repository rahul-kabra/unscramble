import React from "react";
import "./GameBoard.css";

import * as Constants from "./Constants";
import GameEnd from "./GameEnd";

class GameBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainLevel: 0,
      subLevel: 0,
      wrongCount: 0,
      word: "",
      scrambledWord: "",
      clue: "",
      gameState: "initial",
      wordCategory: "",
      score: 0,
      seconds: 0,
      gameMode: "",
    };

    this.userInput = "";
    this.randomNumber = 0;
    this.decrementer = 0;
    this.levelUp = false;
    this.level = 0;
    this.didWin = false;
    this.timer = this.timer.bind(this);

    this.startGame = this.startGame.bind(this);
    this.selectMode = this.selectMode.bind(this);
    this.fetchWord = this.fetchWord.bind(this);
    this.checkWord = this.checkWord.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (this.userInput !== "" && this.state.word !== "") {
        this.checkWord();
      }
    }
  }

  startGame() {
    this.userInput.value = "";
    this.userInput = "";
    this.randomNumber = 0;
    this.decrementer = 0;
    this.levelUp = false;
    this.level = 0;
    this.didWin = false;

    this.setState({
      mainLevel: 0,
      subLevel: 0,
      wrongCount: 0,
      word: "",
      scrambledWord: "",
      clue: "",
      gameState: "running",
      wordCategory: "",
      score: 0,
      seconds: 0,
      gameMode: "",
    });
  }

  selectMode(e) {
    let mode = "";
    if (e.target.textContent === "Easy") {
      mode = "Easy";
    } else if (e.target.textContent === "Hard") {
      mode = "Hard";
    }

    this.level = 1;
    this.setState({
      mainLevel: 1,
      subLevel: 1,
      wrongCount: 0,
      gameState: "running",
      wordCategory: Constants.LEVEL_1,
      score: 0,
      seconds: 1500,
      gameMode: mode,
    });

    setTimeout(() => {
      this.fetchWord();
    }, 1000);
  }

  fetchWord() {
    let num = Math.floor(Math.random() * this.state.wordCategory.length);
    this.randomNumber = num;
    let { actual, scrambled, clue } = this.state.wordCategory[num];
    this.setState({
      word: actual,
      scrambledWord: scrambled,
      clue: "Clue: " + clue,
    });
    if (this.state.gameMode === "Hard") {
      this.timerID = setInterval(this.timer, 100);
    } else {
      clearInterval(this.timerID);
    }
  }

  checkWord() {
    let userInput = this.userInput.value.toLowerCase();
    if (this.state.word === userInput) {
      this.userInput.value = "";
      this.misses = 0;
      this.state.wordCategory.splice(this.randomNumber, 1);
      if (this.state.subLevel % 25 === 0) {
        this.levelUp = true;
        this.level += 1;
      } else {
        this.levelUp = false;
      }
      this.setState((prevState) => {
        return {
          score: prevState.score + 1,
          wrongCount: 0,
          mainLevel:
            this.levelUp === true
              ? prevState.mainLevel + 1
              : prevState.mainLevel,
          wordCategory:
            this.levelUp === true
              ? Constants.getWords(this.level)
              : prevState.wordCategory,
          subLevel: this.levelUp === true ? 1 : prevState.subLevel + 1,
          seconds: 1500,
        };
      });
      setTimeout(() => {
        if (this.state.score === Constants.MaxScore) {
          this.didWin = true;
          this.stopGame();
        } else {
          this.fetchWord();
        }
      }, 100);
    } else {
      this.setState((prevState) => {
        return {
          score: prevState.score,
          wrongCount:
            prevState.wrongCount === Constants.WrongCount
              ? prevState.wrongCount
              : prevState.wrongCount + 1,
        };
      });
      setTimeout(() => {
        if (this.state.wrongCount === Constants.WrongCount) {
          this.didWin = false;
          this.stopGame();
        }
      }, 1000);
    }
  }

  stopGame() {
    clearInterval(this.timerID);
    this.setState((prevState) => {
      return {
        gameState: "end",
        score: prevState.score,
        mainLevel: 0,
        subLevel: 0,
        wrongCount: 0,
        seconds: prevState.seconds,
      };
    });
  }

  timer() {
    if (this.state.gameMode === "Hard") {
      if (this.state.gameState === "running") {
        this.decrementer = 1;
      }

      this.setState((prevState) => {
        return {
          seconds:
            prevState.seconds === 0 ? 0 : prevState.seconds - this.decrementer,
        };
      });

      if (this.state.seconds === 0) {
        this.stopGame();
      }
    }
  }

  render() {
    return (
      <>
        <div id="description">
          <p>
            This is a fun game that tests your knowledge in deciphering the
            correct word from its scrambled form. A collection of 250 words
            spread over 10 levels awaits you. Choose your level - easy, if your
            are just starting out and don't want a timer to distract you{" "}
            <span style={{ fontWeight: "bold" }}>OR</span> hard, if you want to
            be adventurous and compete within the limits of a fixed timer. Start
            this word quest and Unscramble!
          </p>
        </div>

        <div
          style={
            (this.state.gameState === "running" ||
              this.state.gameState !== "") &&
            this.state.gameState !== "end"
              ? { display: "block", maxWidth: "900px", margin: "40px auto" }
              : this.state.gameState === "end"
              ? { display: "block", opacity: 0.3 }
              : { display: "none" }
          }
        >
          <div id="level-header-container">
            <h3
              style={{
                textAlign: "center",
                color: "#644566",
                background:
                  "linear-gradient(to bottom, #dbeceb 0, #dbeceb 60%, #fedc2a 60%, #fedc2a 80%, #dbeceb 60%, #dbeceb 100%)",
                margin: "0 5px",
              }}
            >
              Select a level.
            </h3>
            <span role="img" aria-label="slateboard-emoji">
              📋
            </span>
          </div>
          <div id="level-container">
            <div
              id="easy"
              className="level"
              style={
                this.state.gameMode !== "" && this.state.gameMode === "Easy"
                  ? { background: "#af5790" }
                  : null
              }
              onClick={(e) => {
                this.selectMode(e);
              }}
            >
              <label>Easy</label>
            </div>
            <div
              id="hard"
              className="level"
              style={
                this.state.gameMode !== "" && this.state.gameMode === "Hard"
                  ? { background: "#af5790" }
                  : null
              }
              onClick={(e) => {
                this.selectMode(e);
              }}
            >
              <label>Hard</label>
            </div>
          </div>

          <div id="game-control-container">
            <span role="img" aria-label="pen-emoji">
              ✒️ Level:
              {` ${this.state.mainLevel} - ${this.state.subLevel}`}
            </span>
            <span role="img" aria-label="dartboard-emoji">
              🎯 Score:{` ${this.state.score}`}
            </span>
            <span role="img" aria-label="cross-emoji">
              ❌ Wrong:{` ${this.state.wrongCount}/5`}
            </span>
            <span role="img" aria-label="sandclock-emoji">
              ⌛️ Seconds:{` ${this.state.seconds}`}
            </span>
          </div>
          <div id="scrambled-word-container">
            <p id="scrambled-word">{this.state.scrambledWord}</p>
            <p style={{ color: "#90490a" }}>{`${this.state.clue}`}</p>
          </div>
          <div id="input-container" className="input-field">
            <div className="floating-label">
              <input
                id="input-data"
                className="floating-input"
                type="text"
                placeholder=" "
                ref={(ref) => (this.userInput = ref)}
              />
              <span className="highlight"></span>
              <label htmlFor="input-data">Enter answers here...</label>
            </div>
            <button id="answer" className="btn" onClick={this.checkWord}>
              <span>Submit</span>
            </button>
          </div>
        </div>

        <div
          style={
            this.state.gameState === "end" &&
            this.state.gameState !== "" &&
            this.state.gameState !== "running"
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <GameEnd
            didWin={this.didWin}
            gameMode={this.state.gameMode}
            timeLeft={this.state.seconds}
            startGame={this.startGame}
          />
        </div>
      </>
    );
  }
}

export default GameBoard;