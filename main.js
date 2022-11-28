const url = 'https://docs.google.com/spreadsheets/d/1Xp3OfSFERhzwr8-HB8Yu_QcNAWKqGL3n_aAQkNYV_8k/edit?usp=sharing'

const url2 = 'https://spreadsheets.google.com/feeds/cells/1Xp3OfSFERhzwr8-HB8Yu_QcNAWKqGL3n_aAQkNYV_8k/1/public/full?alt=json'




const url3 = 'https://opensheet.elk.sh/1Xp3OfSFERhzwr8-HB8Yu_QcNAWKqGL3n_aAQkNYV_8k/1'
var currentQuote = ""
var currentAuthor = ""
var currentContext = ""
var currentTheme = ""

getData();

function getData() {
  fetch(url3, {
    // mode: 'no-cors',
    // header: {
    //   'Access-Control-Allow-Origin': 'http://127.0.0.1:5500/index.html',
    //   'Content-Type:': 'application/json'
    // }
  }).then((res) =>

    res.json()
  ).then((data) => {
    console.log(typeof data)
    let dailyQuote = data[208]
    currentQuote = dailyQuote["Quote"]
    console.log(currentQuote)
  })
}

