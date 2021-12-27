function pos(pos) {
    document.getElementById('row2').innerHTML = ''
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&appid=' + '911062246487cff1d7ff93826a7e4078')
        .then((response) => { return response.json(); })
        .then((data) => {
            document.getElementById('icon').setAttribute('src', icons(data.current.weather[0].icon))
            console.log(data)
            console.log(data.daily[1])
            var now = new Date(data.current.dt * 1000);
            document.getElementById('temp').innerHTML = Math.round((data.current.temp - 273.15)) + 'º';
            document.getElementById('time').innerHTML = now.toLocaleTimeString().substring(0, now.toLocaleTimeString().length - 3)
            document.getElementById('windicon').style.transform = 'rotate(' + data.current.wind_deg + 'deg)';
            document.getElementById('windspeed').innerHTML = (Math.round(data.current.wind_speed * 10) / 10) + 'm/s'
            //rain(data)
            for (i = 1; i < Object.keys(data.hourly).length - 1; i++) {
                var d = new Date(data.hourly[i].dt * 1000);
                var hour = document.createElement('DIV')
                var hrtemp = document.createElement('DIV')
                var hricon = document.createElement('IMG')
                var hrhr = document.createElement('DIV')
                hour.setAttribute('id', 'hr' + i);
                hour.setAttribute('onclick', 'divData("row3", '+{
                    'wind': data.hourly[i].wind_speed,
                    'winddeg': data.hourly[i].wind_deg
                }+')')
                hrhr.className = 'time'
                hrhr.innerHTML = d.toLocaleTimeString().substring(0, d.toLocaleTimeString().length - 3)
                hour.appendChild(hrhr)
                hricon.setAttribute('src', icons(data.hourly[i].weather[0].icon))
                hricon.className = 'icon'
                hour.appendChild(hricon)
                hrtemp.innerHTML = toC(data.hourly[i].temp);
                hrtemp.className = 'content'
                hour.className = 'minibox'
                hour.appendChild(hrtemp)
                document.getElementById('row2').appendChild(hour)
                
            }
            for (n = 0; n < 7; n++) {
                var d = new Date(data.daily[n].dt * 1000);
                var day = document.createElement('DIV')
                var dytemp = document.createElement('DIV')
                var dyicon = document.createElement('IMG')
                var dyhr = document.createElement('DIV')
                console.log(d)
                var today = new Date();
                var dd = today.getDate()
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();

                today = dd + '/' + mm + '/' + yyyy;
                dyhr.innerHTML = today;
                dyhr.className = 'time'
                dyhr.innerHTML = (d.getDate()) + '.' + (d.getMonth() + 1)
                day.appendChild(dyhr)
                dyicon.setAttribute('src', icons(data.daily[n].weather[0].icon))
                dyicon.className = 'icon'
                day.appendChild(dyicon)
                dytemp.innerHTML = toC(data.daily[n].temp.day) + '|' + toC(data.daily[n].temp.night);
                dytemp.className = 'content'
                day.className = 'minibox'
                day.appendChild(dytemp)
                document.getElementById('row4').appendChild(day)
            }
        });
}
function icons(icon, code) {
    if (icon == '01d') {
        return 'weather-icons-master/svg/wi-day-sunny.svg';
    }
    if (icon == '02d') {
        return 'weather-icons-master/svg/wi-day-sunny-overcast.svg';
    }
    if (icon == '03d' || icon == '03n') {
        return 'weather-icons-master/svg/wi-cloud.svg';
    }
    if (icon == '04d' || icon == '04n') {
        return 'weather-icons-master/svg/wi-cloudy.svg';
    }
    if (icon == '09d' || icon == '09n') {
        return 'weather-icons-master/svg/wi-rain.svg';
    }
    if (icon == '10d') {
        return 'weather-icons-master/svg/wi-day-rain.svg';
    }
    if (icon == '11d' || icon == '11n') {
        return 'weather-icons-master/svg/wi-thunderstorm.svg';
    }
    if (icon == '13d' || icon == '13n') {
        return 'weather-icons-master/svg/wi-snow.svg';
    }
    if (icon == '50d' || icon == '50n') {
        return 'weather-icons-master/svg/wi-fog.svg';
    }
    if (icon == '01n') {
        return 'weather-icons-master/svg/wi-night-clear.svg';
    }
    if (icon == '02n') {
        return 'weather-icons-master/svg/wi-night-partly-cloudy.svg';
    }
    if (icon == '10n') {
        return 'weather-icons-master/svg/wi-night-rain.svg';
    }
    else {
        return 'weather-icons-master/svg/wi-refresh.svg'
    }
}
function divData(div, data) {
    console.log(data.json())
    document.getElementById('row3').style.display = 'block';
}
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();