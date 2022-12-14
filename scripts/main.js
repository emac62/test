import URL_LINK from "./urlLink.js";

// localStorage.clear()
if (localStorage.getItem("freshStart") === null) {
  // console.log('freshStart')
  localStorage.clear()
  localStorage.setItem("freshStart", true)
}
// change to current date for practice
const offsetFromDate = new Date(2022, 4, 4) // months: 0 - 11 days: 1 - 31
// console.log(QUOTES.length)

const msOffset = Date.now() - offsetFromDate
const dayOffset = (msOffset / 1000 / 60 / 60 / 24) | 0 //works!
// const dayOffset = (msOffset / 1000 / 60 / 60 / 24) | 0
// const every15 = (msOffset / 1000 / 60 / 60 / 0.125) | 0
// console.log(every15)
// console.log("dayOffset: " + dayOffset)

var currentGamePoints = 0
var runningPoints = localStorage.getItem("runningPoints")
if (runningPoints === null) {
  localStorage.setItem("runningPoints", 0)

}
var finishedGames = JSON.parse(localStorage.getItem("finishedGames"))
if (finishedGames === null) finishedGames = []

// for live
var currentQuote = dayOffset

///for practice
// let currentQuote = finishedGames.length ? finishedGames.length : 0
// let yesterdayQuote = (finishedGames.length > 0) ? finishedGames.length - 1 : null

// every 15
// var currentQuote = every15
// console.log("currentQuote: " + every15)
// var yesterdayQuote = every15 - 1


// console.log("yesterdayQuote:" + yesterdayQuote)
let today = []
let todayQuote = ""
let todayAuthor = ""
let todayContext = ""
let todayTheme = ""

let yesterday = []
let yesterdayQuote = ""
let yesterdayAuthor = ""
let yesterdayContext = ""


localStorage.setItem("currentQuote", currentQuote)
// console.log("currentQuote: " + currentQuote)

var lastQuoteLoaded = 0
if (localStorage.getItem("lastQuoteLoaded") === null) {
  localStorage.setItem("lastQuoteLoaded", currentQuote)
}
lastQuoteLoaded = parseInt(localStorage.getItem("lastQuoteLoaded"))


let isSolving = false
let userInput = false
let numberOfRows = 2
let lengthOfRows = []
let rowArray = []
let spaces = [];
let letterBoxes = []
let letterBoxesLen = 0
let endResult = ""
let runPts = document.getElementById("runningPts")
let firstEmpty = 0

var lastResult = localStorage.getItem("lastResult")
if (lastResult === null) localStorage.setItem("lastResult", "Unfinished")

var currentGuess = JSON.parse(localStorage.getItem("currentGuess"))
if (currentGuess === null) currentGuess = []
var nextLetter = 0
if (localStorage.getItem("nextLetter") === null) {
  localStorage.setItem("nextLetter", 0)
}
nextLetter = parseInt(localStorage.getItem("nextLetter"))


export var averageLetters = JSON.parse(localStorage.getItem("averageLetters"))
if (averageLetters === null) averageLetters = []
var gamePoints = JSON.parse(localStorage.getItem("gamePoints"))
if (gamePoints === null) gamePoints = []

let maxPoints = 0
if (gamePoints.length > 0) {
  maxPoints = gamePoints.reduce(function (a, b) {
    return Math.max(a, b);
  });
}

let showAnimations = localStorage.getItem("showAnimations")
if (showAnimations === null) showAnimations = "true"

var showAnimationBool = (showAnimations === 'true')

let gameMode = localStorage.getItem("gameMode")
if (gameMode === null) gameMode = "Regular"


var gamesWon = 0
if (localStorage.getItem("gamesWon") === null) {
  localStorage.setItem("gamesWon", 0)
}
gamesWon = parseInt(localStorage.getItem("gamesWon"))
var gamesLost = 0
if (localStorage.getItem("gamesLost") === null) {
  localStorage.setItem("gamesLost", 0)
}
gamesLost = parseInt(localStorage.getItem("gamesLost"))


var avLetterLength = 0
var letterAverage = 0

function getAverageLetterInt() {
  var avLettersSum = 0
  let averageLettersInt = []
  var letters = localStorage.getItem("averageLetters")
  if (letters != null) {
    letters = JSON.parse(letters)
    let letLen = letters.length
    for (var i = 0; i < letLen; i++) {
      averageLettersInt.push(letters[i])
    }
    averageLettersInt.forEach(number => {
      avLettersSum = avLettersSum + number
    });
    avLetterLength = averageLettersInt.length
    letterAverage = avLettersSum / avLetterLength
  }
}
getAverageLetterInt()

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '1.5s');
    node.classList.add(`${prefix}animated`, animationName);
    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }
    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function getvals() {
  try {
    const response = await fetch(URL_LINK)
    const responseData = await response.json()
    //console.log(responseData)
    return responseData

  } catch (error) {
    return console.warn(error)
  }

}

getvals().then(response => setQuote(response));

function setQuote(response) {

  today = response.data.filter(obj => obj.id == currentQuote)
  todayQuote = today[0]['quote']
  todayQuote = todayQuote.toUpperCase()
  todayAuthor = today[0]['author']
  todayContext = today[0]['context']
  todayTheme = today[0]['theme']
  // console.log(todayQuote)

  yesterday = response.data.filter(obj => obj.id == (currentQuote - 1))
  // console.log(yesterday)
  yesterdayQuote = yesterday[0]['quote']
  yesterdayQuote = yesterdayQuote.toUpperCase()
  yesterdayAuthor = yesterday[0]['author']
  yesterdayContext = yesterday[0]['context']

  let phrase = Array.from(todayQuote)
  let phraseToCompare = phrase
  let phraseLen = phrase.length


  function getRowLength() {
    for (var i = 0; i < phrase.length; i++) {
      if (phrase[i] === " ") {
        spaces.push(i)
      }
    }
    // console.log("phrase: " + phrase)
    const closestIndex = (num, spaces) => {
      if (phraseLen < 20) {
      }
      let curr = spaces[0], diff = Math.abs(num - curr);
      let index = 0;
      let spacesLength = spaces.length
      for (let i = 0; i < spacesLength; i++) {
        let newdiff = Math.abs(num - spaces[i]);
        if (newdiff < diff) {
          diff = newdiff;
          curr = spaces[i];
          index = i;
        };
      };
      return index;
    };

    lengthOfRows.push(spaces[closestIndex(8, spaces)])
    rowArray.push(lengthOfRows[0])

    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    let secondRow = lengthOfRows[1] - lengthOfRows[0]
    if (secondRow != 0) {
      rowArray.push(secondRow)
    }

    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[2] != lengthOfRows[1]) {
      let thirdRow = lengthOfRows[2] - lengthOfRows[1]
      rowArray.push(thirdRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[3] != lengthOfRows[2]) {
      let fourthRow = lengthOfRows[3] - lengthOfRows[2]
      rowArray.push(fourthRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[4] != lengthOfRows[3]) {
      let fifthRow = lengthOfRows[4] - lengthOfRows[3]
      rowArray.push(fifthRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[5] != lengthOfRows[4]) {
      let fifthRow = lengthOfRows[5] - lengthOfRows[4]
      rowArray.push(fifthRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[6] != lengthOfRows[5]) {
      let sixthRow = lengthOfRows[6] - lengthOfRows[5]
      rowArray.push(sixthRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[7] != lengthOfRows[6]) {
      let seventhRow = lengthOfRows[7] - lengthOfRows[6]
      rowArray.push(seventhRow)
    }
    lengthOfRows.push(spaces[closestIndex((rowArray.reduce((a, b) => a + b, 0) + 10), spaces)])
    if (lengthOfRows[8] != lengthOfRows[7]) {
      let eigthhRow = lengthOfRows[8] - lengthOfRows[7]
      rowArray.push(eigthhRow)
    }

    let sum = rowArray.reduce((a, b) => a + b, 0);
    let lastRow = phrase.length - sum
    rowArray.push(lastRow)

    numberOfRows = rowArray.length
  }

  let themeExitBtn = document.getElementById("themeExitBtn")
  function toggleThemeExitBtn() {
    if (isSolving) {
      themeExitBtn.textContent = "Exit Solve"
    } else {
      themeExitBtn.textContent = "Theme"
    }
  }
  themeExitBtn.addEventListener("click", function () {
    if (isSolving) {

    } else { toastPopup(todayTheme.toUpperCase()) }

  })

  let solveBtn = document.getElementById("solveBtn")

  function initBoard() {

    getRowLength()
    toggleThemeExitBtn()

    let board = document.getElementById("game-board");

    for (var i = 0; i < numberOfRows; i++) {
      let row = document.createElement("div")
      row.className = "letter-row"

      for (var j = 0; j < rowArray[i]; j++) {
        let box = document.createElement("button")
        box.className = "letter-box"
        row.appendChild(box)
      }
      board.appendChild(row)
    }
    letterBoxes = document.getElementsByClassName('letter-box')
    letterBoxesLen = letterBoxes.length

    for (var i = 0; i < letterBoxesLen; i++) {
      letterBoxes[i].id = i
      letterBoxes[i].disabled = true
      if (gameMode == "Easy") {
        if (phrase[i].match(/[.;:"'!, -?]/gi)) {
          letterBoxes[i].style.borderColor = "transparent"
          letterBoxes[i].style.color = "#F5F4F4"
          letterBoxes[i].textContent = phrase[i]
        }
      }

    }

    if (lastQuoteLoaded == currentQuote) {
      if (finishedGames.includes(currentQuote)) {//check completed currentQuote
        runningPoints = gamePoints[gamePoints.length - 1]
        runPts.textContent = runningPoints
        document.getElementById('guessCount').innerHTML = averageLetters[averageLetters.length - 1]
        endResult = localStorage.getItem("lastResult")
        document.getElementById('gameResult').innerHTML = endResult

        document.getElementById('currentGamePts').innerHTML = runningPoints
        themeExitBtn.disabled = false
        solveBtn.textContent = endResult
        solveBtn.disabled = true
        revealAnswer()
        getStats()
        setTimeout(function () { $('#endOfGameModal').modal('show') }, 3000)
      } else {
        currentGamePoints = parseInt(localStorage.getItem("runningPoints"))
        resetGame()
      }
    } else {
      localStorage.setItem("nextLetter", "0")
      nextLetter = parseInt(localStorage.getItem("nextLetter"))
      currentGuess.length = 0
      localStorage.setItem("currentGuess", JSON.stringify(currentGuess))
    }
  }

  function revealAnswer() {
    for (var i = 0; i < phraseLen; i++) {
      letterBoxes[i].textContent = phrase[i]
      letterBoxes[i].style.border = "none"
      letterBoxes[i].style.backgroundColor = "#739976"
      letterBoxes[i].style.color = "white"
      animateCSS(letterBoxes[i], 'bounce')

    }
  }


  initBoard()

  let blockQuote = document.getElementById('blockquote')
  blockQuote.innerHTML = todayQuote + "."
  let quoteAuthor = document.getElementById('author')
  quoteAuthor.textContent = "- " + todayAuthor
  let quoteContext = document.getElementById("context")
  quoteContext.innerHTML = todayContext + "."

  let yesterdayBlockquote = document.getElementById('yesterdayBlockquote')
  let yesterdayBQAuthor = document.getElementById('yesterdayBQAuthor')
  let yesterdayBQContext = document.getElementById('yesterdayBQContext')
  if (yesterdayQuote) {
    yesterdayBlockquote.textContent = yesterdayQuote.toUpperCase() + "."
    yesterdayBQAuthor.textContent = "- " + yesterdayAuthor
    yesterdayBQContext.textContent = yesterdayContext + "."
  } else {
    yesterdayBlockquote.textContent = "Hmm... something went wrong!"
    yesterdayBQAuthor.textContent = "- Ellen"
    yesterdayBQContext.textContent = null
  }




  let enterBtn = document.getElementById("ENTER")
  enterBtn.addEventListener("click", function () {
    pressEnter()
  })
  let delBtn = document.getElementById("DEL")
  delBtn.disabled = true
  delBtn.addEventListener("click", function () {
    if (!isSolving) {
      deleteLetter(currentGuess[currentGuess.length - 1])
    } else {
      if (guessBoxesUsed.length > 0) {
        let letter = document.getElementById(guessBoxesUsed[guessBoxesUsed.length - 1]).textContent
        deleteLetter(letter)
      }

    }
  })


  let spaceBar = document.getElementById("space")
  if (gameMode == "Hard") {
    spaceBar.classList.add("hidden")
  } else {
    spaceBar.classList.remove("hidden")
  }

  var buttons = document.querySelectorAll(".keyboard-button").length;

  for (var i = 0; i < buttons; i++) {
    let btn = document.querySelectorAll(".keyboard-button")[i]
    btn.addEventListener("click", function () {
      let pressedKey = btn.textContent
      if (pressedKey === "SHOW SPACES BETWEEN WORDS" || pressedKey === "SPACE") {
        pressedKey = "_";
      }
      if (pressedKey == "Guess the Quote") {
        guessThePhrase()
      }
      if (pressedKey == "Exit Solve") {
        returnToSelectLetters()
      }
      if (pressedKey == "Solve") {
        checkSaying()
      }
      let found = pressedKey.match(/[A-Z,_'.]/gi)
      if (!found || found.length > 1) {
        return
      } else if (isSolving === true && userInput === true) {
        enterUserInput(pressedKey)
      } else if (isSolving === true) {
        enterGuessLetters(pressedKey)
      } else {
        btn.style.backgroundColor = "#75ADAF"
        insertLetter(pressedKey)
      }
    });

  }

  let keyboardBtns = document.getElementsByClassName("keyboard-button")

  function insertLetter(pressedKey) {
    if (pressedKey === "_") {
      pressedKey = " "
    }

    if (currentGuess.includes(pressedKey)) {
      document.getElementById(pressedKey).style.backgroundColor = "#739976"
      toastPopup("You've already selected that letter.")
      delBtn.disabled = true
      return
    }

    if (nextLetter === 10) {
      document.getElementById(pressedKey).style.backgroundColor = "#F5F4F4"

      toastPopup("10/10 letters used. Try solving.")
      guessThePhrase()
    } else {
      if (isSolving === false) {
        delBtn.style.backgroundColor = "#F7E7CE"
        enterBtn.style.backgroundColor = "yellow"
        if (showAnimationBool === true) animateCSS(ENTER, "tada")
        for (const elem of keyboardBtns) {
          elem.disabled = true
        }
      }
      pressedKey = pressedKey
      console.log("pressedKey: " + pressedKey)
      currentGuess.push(pressedKey)
      localStorage.setItem("currentGuess", JSON.stringify(currentGuess))
      nextLetter += 1
      localStorage.setItem("nextLetter", JSON.stringify(nextLetter))
      localStorage.setItem("lastQuoteLoaded", JSON.stringify(currentQuote))
      delBtn.disabled = false

    }
  }

  function deleteLetter(pressedKey) {
    delBtn.style.backgroundColor = "#F5F4F4"
    if (isSolving === false) {
      enterBtn.style.backgroundColor = "#F5F4F4"
      let delLet = document.getElementById(pressedKey)

      if (pressedKey === " ") {
        document.getElementById("space").style.backgroundColor = "#F5F4F4"
        currentGuess.pop()
        nextLetter -= 1
        localStorage.setItem("nextLetter", JSON.stringify(nextLetter))
        localStorage.setItem("currentGuess", JSON.stringify(currentGuess))
      } else {
        if (delLet.textContent === pressedKey) {
          delLet.style.backgroundColor = "#F5F4F4"
          currentGuess.pop()
          nextLetter -= 1
          localStorage.setItem("nextLetter", JSON.stringify(nextLetter))
          localStorage.setItem("currentGuess", JSON.stringify(currentGuess))
        }
      }
      for (const elem of keyboardBtns) {
        elem.disabled = false
      }
      delBtn.disabled = true
    } else {
      if (guessBoxesUsed.length > 0) {
        let boxId = guessBoxesUsed[guessBoxesUsed.length - 1]
        let box = document.getElementById(boxId)
        box.textContent = ""
        box.classList.remove("letter-box-used")
        // box.classList.add("letter-box-unselected")

        document.querySelectorAll('.letter-box-selected').forEach(function (box) {
          box.classList.remove("letter-box-selected")
        });
        getFirstEmptyGuessBox()
        document.getElementById(guessBoxes[firstEmpty]).classList.add("letter-box-selected")
        guessBoxesUsed.pop(boxId)
        selectedBox.pop(boxId)
      }
    }
  }

  const pressEnter = async () => {
    if (isSolving === false) {
      enterBtn.style.backgroundColor = "#F5F4F4"
    }
    delBtn.style.backgroundColor = "#F5F4F4"
    delBtn.disabled = true

    for (var i = 0; i < phraseLen; i++) {
      let box = letterBoxes[i]
      let letter = currentGuess[nextLetter - 1]
      let letterPosition = phrase.indexOf(letter)
      if (phrase[i] === " " && letter === " ") {

        box.style.border = "none"
        box.classList.add("space-box")
        shadeKeyBoard("space", "#739976")
      }
      if (letterPosition === -1) {
        if (showAnimationBool) animateCSS(box, 'headShake')
        shadeKeyBoard(letter, "#182835")
      } else if (phrase[i] === letter && letter != " ") {
        animateCSS(box, 'flipInX')
        box.textContent = letter
        box.classList.add("letter-box-used")
        box.style.backgroundColor = "#739976"
        box.style.color = "#F5F4F4"
        box.style.border = "none"
        shadeKeyBoard(currentGuess[nextLetter - 1], '#739976')
        currentGamePoints += 10
        runPts.innerHTML = currentGamePoints
        localStorage.setItem("runningPoints", currentGamePoints)
      }
      await sleep(50)
    }
    for (const elem of keyboardBtns) {
      elem.disabled = false
    }
    updateCount()
    checkSaying()
  }


  function updateCount() {
    document.getElementById('guessCount').innerHTML = currentGuess.length
    let el = document.getElementById('count')
    if (showAnimationBool) animateCSS(el, "bounce")
  }

  function shadeKeyBoard(letter, color) {
    let el = document.getElementById(letter)
    el.style.backgroundColor = color
    if (color === "#182835") {
      if (showAnimationBool) animateCSS(el, "fadeOut")
    }

  }

  function removeItem(array, item) {
    return array.filter((i) => i !== item);
  }

  function toastPopup(toastMessage) {
    let notice = document.getElementById("toast")
    notice.className = "show"
    notice.innerHTML = toastMessage
    setTimeout(function () { notice.className = notice.className.replace("show", ""); }, 3000)
  }

  function checkSaying() {
    if (isSolving === true) {

      if (spaceBar.classList.contains("hidden")) {
        spaceBar.classList.remove("hidden")
      }
      toggleThemeExitBtn()
      // let numBoxes = letterBoxes.length
      let compareBoxes = []
      let text = ""
      for (var i = 0; i < letterBoxesLen; i++) {
        if (letterBoxes[i].textContent === "_" || !letterBoxes[i].hasChildNodes() || letterBoxes.textContent === " ") {
          text = " "
        } else {
          text = letterBoxes[i].textContent
        }
        compareBoxes.push(text)
      }
      var isSame = (phraseLen == compareBoxes.length) && phrase.every(function (element, index) {
        return element === compareBoxes[index];
      });
      console.log(isSame)
      if (isSame == false) {
        toastPopup("Sorry, that is not correct.")
        for (var i = 0; i < letterBoxesLen; i++) {
          if (compareBoxes[i] != phrase[i]) {
            letterBoxes[i].style.color = "red"
          }
        }
        setTimeout(revealAnswer, 6000)
        endOfGameSaveLS()
        gamesLost += 1
        endResult = "Missed"
        localStorage.setItem("lastResult", endResult)
        localStorage.setItem("gamesLost", gamesLost)
        getAverageLetterInt()
        getStats()
        setTimeout(function () { $('#endOfGameModal').modal('show') }, 8000)
        solveBtn.style.border = "none"
        solveBtn.textContent = "Missed"
        solveBtn.disabled = true
        themeExitBtn.disabled = true
      } else {
        for (var i = 0; i < letterBoxesLen; i++) {
          animateCSS(letterBoxes[i], 'flipInX')
          letterBoxes[i].style.border = "none"
          letterBoxes[i].style.backgroundColor = "#739976"
          letterBoxes[i].style.color = "white"
        }
        toastPopup("Correct!")
        setTimeout(revealAnswer, 3000)
        gamesWon += 1
        endResult = "Solved"
        localStorage.setItem("lastResult", endResult)
        localStorage.setItem("gamesWon", gamesWon)
        let spaceUsed = currentGuess.includes(" ")
        if (gameMode != "Easy" && spaceUsed === false) {
          currentGamePoints += 100
        }
        currentGamePoints += 500
        runPts.innerHTML = currentGamePoints
        localStorage.setItem("runningPoints", currentGamePoints)
        var bonus = (10 - nextLetter) * 50
        currentGamePoints = currentGamePoints + bonus
        runPts.innerHTML = currentGamePoints
        localStorage.setItem("runningPoints", currentGamePoints)
        endOfGameSaveLS()
        getAverageLetterInt()
        getStats()
        setTimeout(function () { $('#endOfGameModal').modal('show') }, 6000)
        solveBtn.style.border = "none"
        solveBtn.textContent = "Solved"
        solveBtn.disabled = true
        themeExitBtn.disabled = true
      }
    } else {
      phraseToCompare = removeItem(phraseToCompare, currentGuess[nextLetter - 1])
      if (phraseToCompare.length === 0) {
        toastPopup("Correct!")
        gamesWon += 1
        endResult = "Solved"
        localStorage.setItem("lastResult", endResult)
        localStorage.setItem("gamesWon", gamesWon)
        currentGamePoints += 500
        runPts.innerHTML = currentGamePoints
        localStorage.setItem("runningPoints", currentGamePoints)
        var bonus = (10 - nextLetter) * 50
        currentGamePoints = currentGamePoints + bonus
        runPts.innerHTML = currentGamePoints
        localStorage.setItem("runningPoints", currentGamePoints)
        themeExitBtn.disabled = true
        solveBtn.textContent = "Solved"
        solveBtn.disabled = true
        setTimeout(revealAnswer, 3000)
        endOfGameSaveLS()
        getAverageLetterInt()
        getStats()
        setTimeout(function () { $('#endOfGameModal').modal('show') }, 6000)

      }
    }
  }

  let guessBoxesUsed = []
  let guessBoxes = []
  let guessBoxesLen = 0

  function returnToSelectLetters() {
    isSolving = false;
    toggleThemeExitBtn()

    solveBtn.textContent = "Guess the Quote"
    spaceBar.textContent = "SHOW SPACES BETWEEN WORDS"

    delBtn.disabled = false
    enterBtn.disabled = false
    for (var i = 0; i < guessBoxesLen; i++) {
      let box = guessBoxes[i]
      let tile = parseInt(box)
      letterBoxes[tile].textContent = ""
      letterBoxes[tile].classList.remove("letter-box-selected")
      letterBoxes[tile].classList.remove("guessBox")
      letterBoxes[tile].classList.remove("letter-box-used")
      letterBoxes[tile].classList.add("letter-box-unselected")
      letterBoxes[tile].style.backgroundColor = 'transparent'
      // letterBoxes[tile].style.border = "1px solid #F5F4F4"
      removeEventListener("click", function () {
        getUserInput(box.id)
      })
    }
    guessBoxes = []
    guessBoxesLen = 0
    getFirstEmptyGuessBox()
  }


  function guessThePhrase() {
    isSolving = true
    toggleThemeExitBtn()
    if (currentGuess.length == 10) {
      themeExitBtn.classList.add("visible")
      // toastPopup("The Exit Solve button will return")
    }
    spaceBar.textContent = "SPACE"
    solveBtn.textContent = "SOLVE"
    delBtn.disabled = true
    enterBtn.disabled = true
    for (var i = 0; i < letterBoxesLen; i++) {
      let box = letterBoxes[i]
      if (!box.hasChildNodes() && !box.classList.contains("space-box")) {
        box.style.backgroundColor = "#75ADAF"
        guessBoxes.push(box.id)
        box.disabled = false
        box.classList.add("guessBox")
        box.addEventListener("click", function () {
          getUserInput(box.id)
        })
      }
    }
    guessBoxesLen = guessBoxes.length
    console.log("guessBoxes: " + guessBoxes)
    getFirstEmptyGuessBox()
    if (guessBoxesLen > 0) {
      document.getElementById(guessBoxes[firstEmpty]).classList.remove("letter-box-unselected")
      document.getElementById(guessBoxes[firstEmpty]).classList.add("letter-box-selected")
    }
  }

  let selectedBox = []

  var guess
  function getFirstEmptyGuessBox() {
    for (var i = 0; i < guessBoxesLen; i++) {
      let box = document.getElementById(guessBoxes[i])
      if (!box.hasChildNodes() && !box.classList.contains("space-box")) {
        firstEmpty = i
        break
      }
    }
  }

  function getUserInput(box) {
    userInput = true
    getFirstEmptyGuessBox()
    document.querySelectorAll('.letter-box-selected').forEach(function (box) {
      box.classList.remove("letter-box-selected")
    });
    document.getElementById(box).classList.remove("letter-box-used")
    selectedBox.push(box)
    document.getElementById(selectedBox[selectedBox.length - 1]).classList.add("letter-box-selected")
  }

  function enterUserInput(pressedKey) {
    delBtn.disabled = false
    let latestClick = selectedBox[selectedBox.length - 1]
    let el = document.getElementById(latestClick)
    el.textContent = pressedKey
    el.style.color = "#F5F4F4"
    el.classList.remove("letter-box-selected")
    el.classList.remove("letter-box-unselected")
    el.classList.add("letter-box-used")
    guessBoxesUsed.push(latestClick)
    userInput = false
    getFirstEmptyGuessBox()
    document.getElementById(guessBoxes[firstEmpty]).classList.add("letter-box-selected")
  }

  function enterGuessLetters(pressedKey) {
    delBtn.disabled = false
    if (guessBoxes.length > 0) {

      if (!userInput) {
        getFirstEmptyGuessBox()
        guess = document.getElementById(guessBoxes[firstEmpty])
      } else {
        guess = document.getElementById(selectedBox[selectedBox.length - 1])
      }
      if (pressedKey === " ") {
        guess.textContent = "_"
      } else {
        guess.textContent = pressedKey
      }
      guessBoxesUsed.push(guess.id)
      guess.classList.remove("letter-box-selected")
      guess.classList.add("letter-box-used")
      guess.style.color = "#F5F4F4"
      getFirstEmptyGuessBox()
      userInput = false
      document.getElementById(guessBoxes[firstEmpty]).classList.remove("letter-box-unselected")
      document.getElementById(guessBoxes[firstEmpty]).classList.add("letter-box-selected")
    }
    solveBtn.textContent = "Solve"
    if (guessBoxesLen === guessBoxesUsed.length) {
      solveBtn.style.border = "2px solid yellow"
    }
  }

  //Stats
  function getStats() {

    var gamesPlayed = gamesLost + gamesWon

    let wonStats = document.getElementsByClassName("won")
    for (var i = 0; i < wonStats.length; i++) {
      wonStats[i].textContent = gamesWon.toString()
    }
    let gamesPlayedStats = document.getElementsByClassName("played")
    for (var i = 0; i < gamesPlayedStats.length; i++) {
      gamesPlayedStats[i].textContent = gamesPlayed.toString()
    }
    var winPercentage = (gamesWon / gamesPlayed * 100).toFixed(1)
    let winPerStats = document.getElementsByClassName("winPercentage")
    for (var i = 0; i < winPerStats.length; i++) {
      winPerStats[i].textContent = winPercentage ? winPercentage.toString() : "0"
    }
    let avLettersStats = document.getElementsByClassName("averageLetters")

    if (avLetterLength != 0) {
      for (var i = 0; i < avLettersStats.length; i++) {

        avLettersStats[i].textContent = letterAverage.toFixed(1)
      }
    } else {
      for (var i = 0; i < avLettersStats.length; i++) {
        avLettersStats[i].textContent = "TBD"
      }
    }
    let gamePts = document.getElementsByClassName("currentPoints")

    if (currentGamePoints == 0 && finishedGames.includes(currentQuote)) {
      var allGamePoints = localStorage.getItem("gamePoints")
      if (allGamePoints != null) {
        allGamePoints = JSON.parse(allGamePoints)
        currentGamePoints = allGamePoints[allGamePoints.length - 1]
      }
    }
    for (var i = 0; i < gamePts.length; i++) {
      gamePts[i].textContent = currentGamePoints
    }

    let maxPts = document.getElementsByClassName("maxPoints")
    if (gamePoints.length > 0) {
      for (var i = 0; i < maxPts.length; i++) {
        maxPts[i].textContent = maxPoints > currentGamePoints ? maxPoints : currentGamePoints
      }
    }
    document.getElementById("currentQuote").textContent = currentQuote
    document.getElementById("lettersUsed").textContent = averageLetters[averageLetters.length - 1]
    document.getElementById("currentGamePts").textContent = currentGamePoints
    document.getElementById("gameResult").innerHTML = endResult
  }
  getStats()

  function endOfGameSaveLS() {
    finishedGames.push(currentQuote)
    localStorage.setItem("finishedGames", JSON.stringify(finishedGames))
    averageLetters.push(currentGuess.length)
    localStorage.setItem("averageLetters", JSON.stringify(averageLetters))
    gamePoints.push(currentGamePoints)
    localStorage.setItem("gamePoints", JSON.stringify(gamePoints))
    localStorage.setItem("nextLetter", "0")
    currentGuess.length = 0
    localStorage.setItem("currentGuess", JSON.stringify(currentGuess))
    localStorage.setItem("lastQuoteLoaded", JSON.stringify(currentQuote))
    solveBtn.disabled = true
    solveBtn.style.border = "none"
    localStorage.setItem("runningPoints", 0)
  }

  //Share
  let shareBtn = document.getElementById("shareResults")
  shareBtn.addEventListener("click", function () {

    var results = "dailyquote.ca " + "#" + currentQuote + " " + localStorage.getItem("lastResult") + " in " + averageLetters[averageLetters.length - 1] + " / " + currentGamePoints + " pts"
    navigator.clipboard.writeText(results)
    toastPopup("Results copied to Clipboard")
    shareBtn.textContent = "Copied"
  })

  function resetGame() {
    let currGuessLength = currentGuess.length
    if (currGuessLength > 0) {
      for (var i = 0; i < currGuessLength; i++) {
        for (var j = 0; j < phraseLen; j++) {
          let box = letterBoxes[j]
          let letter = currentGuess[i]
          let letterPosition = phrase.indexOf(letter)
          if (phrase[j] === " " && letter === " ") {
            box.style.border = "none"
            box.classList.add("space-box")
            shadeKeyBoard("space", "#739976")
          }
          if (letterPosition === -1) {
            shadeKeyBoard(letter, "#182835")
          } else if (phrase[j] === letter && letter != " ") {
            box.textContent = letter
            box.style.border = "none"
            box.style.backgroundColor = "#739976"
            box.style.color = "#F5F4F4"
            shadeKeyBoard(currentGuess[i], '#739976')
            runPts.innerHTML = localStorage.getItem("runningPoints")
          }
        }
        updateCount()
      }
    }
  }
}