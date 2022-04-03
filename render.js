function checkTime(i) {if (i < 10) {i = "0" + i;}return i;}
function toogleMap(layer, status, map){
    map.setLayoutProperty(layer, 'visibility', status);
}
function pos(pos) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3ViYXByb2ciLCJhIjoiY2tvaGRuNmcwMTUwdzJzb2Ezc2M4bzI3MiJ9.ZK0lAgyNVVkOAdsBSuqGAQ';

    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kubaprog/ckyokd37z2sg214o4rzsuv8jz',
    zoom: 9,
    center: [pos.coords.longitude, pos.coords.latitude]
    });
    var maker = new mapboxgl.Marker()
    .setLngLat([pos.coords.longitude, pos.coords.latitude])
    .addTo(map);
    map.on('load', function () {
        map.addLayer({
            "id": "clouds",
            "type": "raster",
            "source": {
                "type": "raster",
                "tiles": ["https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=692ca78196d8a5d923f16a3216092f76"],
                "tileSize": 256
            },
            "minzoom": 0,
        });
        map.addLayer({
            "id": "precipitation",
            "type": "raster",
            "source": {
                "type": "raster",
                "tiles": ["https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=692ca78196d8a5d923f16a3216092f76"],
                "tileSize": 256
            },
            "minzoom": 0,
        });
        map.addLayer({
            "id": "wind",
            "type": "raster",
            "source": {
                "type": "raster",
                "tiles": ["https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=692ca78196d8a5d923f16a3216092f76"],
                "tileSize": 256
            },
            "minzoom": 0,
        });
        map.addLayer({
            "id": "temp",
            "type": "raster",
            "source": {
                "type": "raster",
                "tiles": ["https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=692ca78196d8a5d923f16a3216092f76"],
                "tileSize": 256
            },
            "minzoom": 0,
        });
        document.getElementById('c').onclick = function() {toogleMap('clouds', 'visible', map);
        toogleMap('precipitation', 'none', map);
        toogleMap('wind', 'none', map);
        toogleMap('temp', 'none', map);
        }
        document.getElementById('r').onclick = function() {toogleMap('clouds', 'none', map);
        toogleMap('precipitation', 'visible', map);
        toogleMap('wind', 'none', map);
        toogleMap('temp', 'none', map);
        }
        document.getElementById('w').onclick = function() {toogleMap('clouds', 'none', map);
        toogleMap('precipitation', 'none', map);
        toogleMap('wind', 'visible', map);
        toogleMap('temp', 'none', map);
        }
        document.getElementById('t').onclick = function() {toogleMap('clouds', 'none', map);
        toogleMap('precipitation', 'none', map);
        toogleMap('wind', 'none', map);
        toogleMap('temp', 'visible', map);
        }
        document.getElementById('n').onclick = function() {toogleMap('clouds', 'visible', map);
        toogleMap('precipitation', 'visible', map);
        toogleMap('wind', 'none', map);
        toogleMap('temp', 'none', map);
        }
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, 'bottom-left');
    });
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude + '&appid=' + '911062246487cff1d7ff93826a7e4078')
        .then((response) => { return response.json(); })
        .then((data) => {
            document.getElementById('row2').innerHTML = ' '
            document.getElementById('topcon').style.backgroundImage = `url(${bg(data.current.weather[0].icon)})`
            console.log(data)
            var now = new Date(data.current.dt * 1000);
            document.getElementById('temp').innerHTML = Math.round((data.current.temp - 273.15)) + 'º';
            document.getElementById('windicon').style.transform = 'rotate(' + data.current.wind_deg + 'deg)';
            document.getElementById('windspeed').innerHTML = (Math.round(data.current.wind_speed * 10) / 10) + 'm/s'
            //rain(data)
            for (i = 0; i < Object.keys(data.hourly).length; i++) {
                var d = new Date(data.hourly[i].dt * 1000);
                var hour = document.createElement('DIV')
                var hrtemp = document.createElement('DIV')
                var hricon = document.createElement('IMG')
                var hrhr = document.createElement('DIV')
                hour.setAttribute('id', 'hr' + i);
                hrhr.className = 'time'
                hrhr.innerHTML = d.toLocaleTimeString().substring(0, d.toLocaleTimeString().length - 3)
                hour.appendChild(hrhr)
                hricon.setAttribute('src', icons(data.hourly[i].weather[0].icon))
                hricon.className = 'icon'
                hour.appendChild(hricon)
                hrtemp.innerHTML = toC(data.hourly[i].temp);
                hrtemp.className = 'content'
                hour.className = 'minibox hour'
                hour.setAttribute('data', JSON.stringify(data.hourly[i]))
                hour.appendChild(hrtemp)
                document.getElementById('row2').appendChild(hour)
                hour.onclick = function (e) {
                    var hrdt = JSON.parse(e.currentTarget.getAttribute('data'))
                    var timehr = new Date(hrdt.dt * 1000)
                    if(!hrdt.rain && hrdt.snow){
                        document.getElementById('hrpop').innerHTML = `<span class="iw"></span> ${Math.round(hrdt.pop * 100)} % - ${hrdt.snow['1h']} mm`
                    }
                    if(hrdt.rain && !hrdt.snow){
                        document.getElementById('hrpop').innerHTML = `<span class="iw"></span> ${Math.round(hrdt.pop * 100)} % - ${hrdt.rain['1h']} mm`
                    }
                    if(!hrdt.rain && !hrdt.snow){
                        document.getElementById('hrpop').innerHTML = ` ${hrdt.pop * 100} % - brak opadów`
                    }
                    //document.getElementById('hrpop').innerHTML = ` ${hrdt.pop * 100} % - ${hrdt.rain['1h']} mm`
                    document.getElementById('hrpres').innerHTML = ` ${hrdt.pressure} hPa`
                    document.getElementById('hrhr').innerHTML = ` ${checkTime(timehr.getHours())}:${checkTime(timehr.getMinutes())}`
                    document.getElementById('hrfl').innerHTML = ` ${toC(hrdt.feels_like)}`
                    document.getElementById('hrhum').innerHTML = ` ${hrdt.humidity}%`
                    document.getElementById('hrwindicon').style.transform = 'rotate(' + hrdt.wind_deg + 'deg)';
                    document.getElementById('hrwindspeed').innerHTML = (Math.round(hrdt.wind_speed * 10) / 10) + 'm/s'
                    console.log(hrdt)
                }
            }
            document.getElementById('hr0').click();
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

                day.setAttribute('data', JSON.stringify(data.daily[n]));
                today = dd + '/' + mm + '/' + yyyy;
                dyhr.innerHTML = today;
                dyhr.className = 'time'
                dyhr.innerHTML = (d.getDate()) + '.' + (d.getMonth() + 1)
                day.appendChild(dyhr)
                day.id = n+'dy'
                dyicon.setAttribute('src', icons(data.daily[n].weather[0].icon))
                dyicon.className = 'icon'
                day.appendChild(dyicon)
                dytemp.innerHTML = toC(data.daily[n].temp.day) + '|' + toC(data.daily[n].temp.night);
                dytemp.className = 'content'
                day.className = 'minibox day'
                day.appendChild(dytemp)
                document.getElementById('row4').appendChild(day)
                day.onclick = function (e) {
                    var dydt = JSON.parse(e.currentTarget.getAttribute('data'))
                    var timedy = new Date(dydt.dt * 1000)
                    var sunset = new Date(dydt.sunset * 1000)
                    var sunrise = new Date(dydt.sunrise * 1000)
                    if(!dydt.rain && dydt.snow){
                        document.getElementById('dypop').innerHTML = `<span class="iw"></span> ${Math.round(dydt.pop * 100)} % - ${dydt.snow} mm`
                    }
                    if(dydt.rain && !dydt.snow){
                        document.getElementById('dypop').innerHTML = `<span class="iw"></span> ${Math.round(dydt.pop * 100)} % - ${dydt.rain} mm`
                    }
                    if(!dydt.rain && !dydt.snow){
                        document.getElementById('dypop').innerHTML = ` ${dydt.pop * 100} % - brak opadów`
                    }
                    //document.getElementById('hrpop').innerHTML = ` ${hrdt.pop * 100} % - ${hrdt.rain['1h']} mm`
                    document.getElementById('dypres').innerHTML = ` ${dydt.pressure} hPa`
                    document.getElementById('dyhr').innerHTML = ` ${timedy.getDate()}.${timedy.getMonth() + 1}`
                    document.getElementById('dyss').innerHTML = ` ${checkTime(sunset.getHours())}:${checkTime(sunset.getMinutes())}`
                    document.getElementById('dysr').innerHTML = ` ${checkTime(sunrise.getHours())}:${checkTime(sunrise.getMinutes())}`
                    document.getElementById('dyhum').innerHTML = ` ${dydt.humidity}%`
                    document.getElementById('dywindicon').style.transform = 'rotate(' + dydt.wind_deg + 'deg)';
                    document.getElementById('dywindspeed').innerHTML = (Math.round(dydt.wind_speed * 10) / 10) + 'm/s'
                    document.getElementById('1dytemp').innerText = toC(dydt.temp.morn)
                    document.getElementById('1dyfl').innerText = toC(dydt.feels_like.morn)
                    document.getElementById('2dytemp').innerText = toC(dydt.temp.day)
                    document.getElementById('2dyfl').innerText = toC(dydt.feels_like.day)
                    document.getElementById('3dytemp').innerText = toC(dydt.temp.eve)
                    document.getElementById('3dyfl').innerText = toC(dydt.feels_like.eve)
                    document.getElementById('4dytemp').innerText = toC(dydt.temp.night)
                    document.getElementById('4dyfl').innerText = toC(dydt.feels_like.night)
                    console.log(dydt)
                }
            }
            document.getElementById('0dy').click();
            console.log(JSON.parse(document.getElementsByClassName('hour')[0].getAttribute('data')))
        })
        .then(data => {
            apidata = data;
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
function bg(icon, code) {
    if (icon == '01d') {
        return 'wphoto/few_clouds.png';
    }
    if (icon == '02d') {
        return 'wphoto/scattered_clouds.png';
    }
    if (icon == '03d' || icon == '03n') {
        return 'wphoto/clouds.png';
    }
    if (icon == '04d' || icon == '04n') {
        return 'wphoto/broken_clouds.png';
    }
    if (icon == '09d' || icon == '09n') {
        return 'wphoto/rain.png';
    }
    if (icon == '10d') {
        return 'wphoto/rain.png';
    }
    if (icon == '11d' || icon == '11n') {
        return 'wphoto/thunderstorm.png';
    }
    if (icon == '13d' || icon == '13n') {
        return 'wphoto/snowing.png';
    }
    if (icon == '50d' || icon == '50n') {
        return 'wphoto/mist.png';
    }
    if (icon == '01n') {
        return 'wphoto/few_night.png';
    }
    if (icon == '02n') {
        return 'wphoto/night_clouds.png';
    }
    if (icon == '10n') {
        return 'wphoto/rain.png';
    }
    else {
        return 'wphoto/nodata.png'
    }
}
