const url = 'https://script.google.com/macros/s/AKfycbxalPGjmVJzn33FTkHW5l40HXWR4AvF1yXdXUYshf3DQ1mLl_BGaAHsMJROix-TrJi3bw/exec'

const apiKey = 'AIzaSyCuO016qB5uToWhGOeJhFQ_t-RAnjasAtA'

//getData();

function getData() {
  fetch(url).then((res) => {
    return res.json()
  }).then((data) => {
    console.log(data)
  })
}
