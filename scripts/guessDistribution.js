import { averageLetters } from "./main.js";

var guessDistribution = document.getElementById("guessDistribution");

var ctx = guessDistribution.getContext("2d");

function countOccurrences(arr, x) {
  let count = 0;
  let n = arr.length;
  for (let i = 0; i < n; i++)
    if (arr[i] == x)
      count++;
  return count;
}

var guessDist = [
  countOccurrences(averageLetters, 1),
  countOccurrences(averageLetters, 2),
  countOccurrences(averageLetters, 3),
  countOccurrences(averageLetters, 4),
  countOccurrences(averageLetters, 5),
  countOccurrences(averageLetters, 6),
  countOccurrences(averageLetters, 7),
  countOccurrences(averageLetters, 8),
  countOccurrences(averageLetters, 9),
  countOccurrences(averageLetters, 10)
]

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [{
      label: 'Letters Used',
      data: guessDist,
      backgroundColor: '#739976',
      datalabels: {
        color: '#182835'
      }
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          display: false
        },
        display: false,
      }
    }
  }
});
