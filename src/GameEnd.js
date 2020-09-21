import React from "react";
import "./GameEnd.css";

class GameEnd extends React.Component {
  render() {
    return (
      <>
        <div className="game-end-container">
          <div
            style={
              this.props.didWin === true
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <p>
              Wow, we have run out of words to describe you as well as for the
              quiz, literally. You have aced this with flying colors. You are
              truy a champion and deserve this.
              <span role="img" aria-label="medal-emoji">
                {" "}
                🥇{" "}
              </span>
            </p>
          </div>
          <div
            style={
              this.props.didWin === false
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <p style={{ margin: "18px", color: "#644566", fontWeight: "bold" }}>
              <span>
                {this.props.gameMode === "Easy"
                  ? "Sorry, but have you have used up all your lives. "
                  : this.props.timeLeft === 0
                  ? "Sorry, but the time ran out. "
                  : "Sorry, but have you have used up all your lives. "}
              </span>
              However if you want to continue challenging yourself, get started
              again.
            </p>
            <button className="btn" onClick={this.props.startGame}>
              Play Again
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default GameEnd;