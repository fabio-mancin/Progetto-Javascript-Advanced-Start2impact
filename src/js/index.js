import '../css/style.css'
const time = document.getElementById('time')
const searchInput = document.querySelector("#search-input")
const btn = document.getElementById('btn')
const grid = document.querySelector('.grid')
const city = document.getElementById('city')
const aqiComment = document.getElementById('aqi-comment')
const aqiQuality = document.getElementById('aqi-quality')
const aqiNumber = document.getElementById('aqi-number')
const col50 = document.querySelector('.col-50')
const aqiCurrentPosition = document.querySelector('#aqi-current-position')
const backgroundImage = require('../img/background.png')

/*  -----------------------------------------------------------------------------------------------
  ApiKeys & lodash.get
--------------------------------------------------------------------------------------------------- */

const firstApiKey = process.env.FIRST_API_KEY
const secondApiKey = process.env.SECOND_API_KEY
const get = require('lodash.get')


/*  -----------------------------------------------------------------------------------------------
  Background
--------------------------------------------------------------------------------------------------- */

document.body.style.backgroundImage = `url(${backgroundImage})`

/*  -----------------------------------------------------------------------------------------------
  CurrentTime
--------------------------------------------------------------------------------------------------- */

function currentTime() {
  time.textContent = new Date().toLocaleString('it-IT', {
    timeStyle: 'short'
  })
}
setInterval(currentTime, 1000)


/*  -----------------------------------------------------------------------------------------------
  CurrentWeather
--------------------------------------------------------------------------------------------------- */

navigator.geolocation.getCurrentPosition(position => {
  fetch(`https://${firstApiKey}/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
    .then(res => {
      if (!res.ok) {
        throw Error()
      }
      return res.json()
    })
    .then(data => {
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      document.querySelector('.weather').innerHTML = `

        <img src=${iconUrl} />
        <p class="weather-temp">${Math.round(data.main.temp)}°</p>
        <p class="weather-city">${data.name}</p>
        <p id="catchError"></p>
      `


    })
    .catch(error =>
      document.getElementById('catchError').textContent = 'Dati meteo non disponibili')
})


/*  -----------------------------------------------------------------------------------------------
  CurrentAirQuality
--------------------------------------------------------------------------------------------------- */


navigator.geolocation.getCurrentPosition(pos => {
  fetch(`https://${firstApiKey}/openweathermap/data/2.5/air_pollution?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
    .then(res => res.json())
    .then(data => {

      const dataList = get(data, 'list[0].main.aqi')

      if (dataList === 1) {
        aqiCurrentPosition.textContent += 'Buona'
      } else if (dataList === 2) {
        aqiCurrentPosition.textContent += 'Discreta'

      } else if (dataList === 3) {
        aqiCurrentPosition.textContent += 'Moderata'
      } else if (dataList === 4) {
        aqiCurrentPosition.textContent += "Scarsa"
      } else if (dataList === 5) {
        aqiCurrentPosition.textContent += 'Molto scarsa'
      }
    })
})



/*  -----------------------------------------------------------------------------------------------
  Button
--------------------------------------------------------------------------------------------------- */

btn.addEventListener('click', airQuality)
searchInput.addEventListener('keyup', function () {
  if (event.keyCode === 13) {
    return airQuality()
  }
})


/*  -----------------------------------------------------------------------------------------------
  ManualSearchAirQuality
--------------------------------------------------------------------------------------------------- */

async function airQuality() {

  fetch(`https://api.waqi.info/feed/${searchInput.value}/?token=${secondApiKey}`)
    .then(res => res.json())
    .then(data => {

      const dataAqi = get(data, 'data.aqi')
      const dataCity = get(data, 'data.city')
      col50.classList.add('background-color')

      if (dataAqi >= 0 && dataAqi <= 50) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = `Ottima qualità dell'aria`
        aqiComment.textContent = `Adesso stai pensando di trasferirti qui, vero? 😉`


      } else if (dataAqi >= 51 && dataAqi <= 100) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = "Qualità dell'aria moderata"
        aqiComment.textContent = "Consigliata 😎"


      } else if (dataAqi >= 101 && dataAqi <= 150) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = "Aria malsana"
        aqiComment.textContent = 'Io non mi ci avvicinerei 😷'

      } else if (dataAqi >= 151 && dataAqi <= 200) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = "Aria nociva"
        aqiComment.textContent = 'Stai alla larga ✋'


      } else if (dataAqi >= 201 && dataAqi <= 300) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = "Aria terribile"
        aqiComment.textContent = 'Scappa subito 😱'


      } else if (dataAqi >= 301) {
        aqiNumber.textContent = dataAqi
        aqiQuality.textContent = 'Pericolosa ☠️'
        aqiComment.textContent = 'Per fortuna esiste Street View di Google Maps per poterla visitare'

      } else if (!dataCity) {
        throw Error()
      } else if (!dataAqi) {
        throw Err()
      }


    })
    .catch(error => {
      aqiComment.textContent = 'Non troviamo la città richiesta'
      //  city.innerHTML = 'Non troviamo la città richiesta 😧';
      aqiNumber.textContent = '😧'
      aqiQuality.textContent = null


    })
    .catch(err => {
      aqiComment.textContent = `Indice Qualità dell'Aria = Non Disponibile`;

    })


}