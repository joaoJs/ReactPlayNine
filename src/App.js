import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Load the full build.
var _ = require('lodash');



var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
  arr.pop();
  return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
  var combinationSum = 0;
  for (var j=0 ; j < listSize ; j++) {
  if (i & (1 << j)) { combinationSum += arr[j]; }
  }
  if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {

  return (
    <div className="col-5">
      {_.range(props.numberOfStarsProp).map(i =>
        <i key={i} className="fa fa-star"></i>
        )}
    </div>
  )
}

const Button = (props) => {
  let button;
  switch (props.answerIsCorrectProp) {
    case true:
      button =
        <button className="btn btn-success" onClick={props.acceptAnswerProp}>
          <i className="fa fa-check"></i>
        </button>;
        break;
    case false:
      button=
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>;
        break;
    default:
      button =
        <button
          className="btn"
          onClick={props.checkAnswerProp}
          disabled={props.selectedNumbersProp.length === 0}
        >
        =
        </button>;
        break;
  }

  return (
    <div className="col-2">
      {button}
      <br /> <br/>
      <button className="btn btn-warning btn-sm" onClick={props.redrawProp}
              disabled={props.redrawsProp === 0}>
        <i className="fa fa-refresh"></i> {props.redrawsProp}
      </button>
    </div>
  )
}

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNumbersProp.map((number, i) =>
        <span key={i}
              onClick={() => props.rollBackProp(number)}>{number}</span>
      )}
    </div>
  )
}

const Numbers = (props) => {

  const getClassName = (number) => {
    if (props.selectedNumbersProp.indexOf(number) >= 0) {
      return 'selected';
    }
    if (props.usedNumbersProp.indexOf(number) >= 0) {
      return 'used';
    }
  }

  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i} className={getClassName(number)}
                onClick={() => props.selectNumberProp(number)}
          >{number}</span>
        )}
      </div>
    </div>
  );
}
Numbers.list = _.range(1,10);

const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatusProp}</h2>
      <button className="btn btn-secondary" onClick={props.resetGameProp}>
        Play Again
      </button>
    </div>
  )
}


class Game extends React.Component {
  // static getRandomNumber = () => Math.floor(Math.random() * 10);
  state = {
    selectedNumbers : [],
    numberOfStars : Math.floor(Math.random() * 10),
    usedNumbers : [],
    answerIsCorrect: null,
    redraws : 5,
    doneStatus : null
  }
  resetGame = () => {
    this.setState({
      selectedNumbers : [],
      numberOfStars : Math.floor(Math.random() * 10),
      usedNumbers : [],
      answerIsCorrect: null,
      redraws : 5,
      doneStatus : null
    })
  }

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
      return;
    }
    this.setState(prevState => ( {
      answerIsCorrect : null,
      selectedNumbers : prevState.selectedNumbers.concat(clickedNumber)
    }))
  }

  rollBack = (clickedNumber) => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }));
  }

  checkAnswer = () => {
     this.setState(prevState => ({
          answerIsCorrect: prevState.numberOfStars ===        prevState.selectedNumbers.reduce((a,b) => a + b , 0)
    }));
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers : prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers : [],
      answerIsCorrect : null,
      numberOfStars : Math.floor(Math.random() * 10),
    }), this.updateDoneStatus);
  }

  redraw = () => {
    if (this.state.redraws === 0) {return;}
    this.setState(prevState => ({
      numberOfStars : Math.floor(Math.random() * 10),
      answerIsCorrect : null,
      selectedNumbers : [],
      redraws: prevState.redraws - 1,
    }), this.updateDoneStatus);
  }

  possibleSolutions = ({numberOfStars, usedNumbers}) => {
    const possibleNumbers = _.range(1,10).filter(number => usedNumbers.indexOf(number) === -1);

    return possibleCombinationSum(possibleNumbers, numberOfStars);
  }

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: 'You Won!' }
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: 'GameOver!'}
      }
    });
  }

  render() {
    const { selectedNumbers,
            numberOfStars,
            answerIsCorrect,
            usedNumbers,
            redraws,
            doneStatus } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars numberOfStarsProp={numberOfStars}/>
          <Button selectedNumbersProp={selectedNumbers}
                  checkAnswerProp={this.checkAnswer}
                  answerIsCorrectProp={answerIsCorrect}
                  acceptAnswerProp={this.acceptAnswer}
                  redrawProp={this.redraw}
                  redrawsProp={redraws}
          />
          <Answer selectedNumbersProp={selectedNumbers}
                  rollBackProp={this.rollBack}
          />
        </div>
        <br />
        {doneStatus ?
          <DoneFrame doneStatusProp={doneStatus}
                     resetGameProp={this.resetGame}/> :
          <Numbers selectedNumbersProp={selectedNumbers}
                 selectNumberProp={this.selectNumber}
                 usedNumbersProp={usedNumbers}
        />
        }
      </div>
    )
  }
}




export default Game;
