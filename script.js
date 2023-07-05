const dom = {
  selectbox: document.getElementById('selectbox'),
  selectboxList: document.querySelector('.selectbox__list'),
  rooms: document.getElementById('rooms'),
  settings: document.getElementById('settings') ,
  settingsTabs: document.getElementById('settings-tabs'),
  settingsPanels: document.getElementById('settings-panel'),
  temperatureLine: document.getElementById('temperature-line'),
  temperatureRound: document.getElementById('temperature-round'),
  temperature: document.getElementById('temperature'),
  temperatureBtn: document.getElementById('temperature-btn'),
  temperatureSaveBtn: document.getElementById('save-temperature'),
  temperaturePowerBtn: document.getElementById('power'),
  sliders: {
    lights: document.getElementById('lights-slider'),
    humidity: document.getElementById('humidity-slider'),
  },
  switch: {
    lights: document.getElementById('lights-power'),
    humidity: document.getElementById('humidity-power'),
  }
}

const rooms = {
  all: 'Усі кімнати' ,
  livingroom:'Вітальня' ,
  bedroom: 'Спальня' ,
  kitchen: 'Кухня' ,
  bathroom: 'Ванна' ,
  studio: 'Кабінет' ,
  washingroom: 'Вбиральня' ,
}

let activeRoom = 'all';
let activeTab = 'temperature';

const settings = {
  temperature: 'Температура' ,
  lights: 'Світло' ,
  humidity: 'Вологість' ,
}


// випадаюче меню-список
dom.selectbox.querySelector('.selectbox__selected').onclick = (Event) => {
      dom.selectbox.classList.toggle('open')
    }

document.body.onclick = (Event) => {
    const { target } = Event
    if (
      !target.matches('.selectbox')
      && !target.parentElement.matches('.selectbox')
      && !target.parentElement.parentElement.matches('.selectbox')
    ) {
      dom.selectbox.classList.remove('open');
    }
}

dom.selectboxList.onclick = (Event) => {
  const { target } = Event
  if (target.matches('.selectbox__item')) {
    const { room } = target.dataset
    const selectedItem = dom.selectboxList.querySelector('.selected')
    selectedItem.classList.remove('selected')
    target.classList.add('selected')
    dom.selectbox.classList.remove('open')
    selectRoom(room)
  }
}



// вибір кімнати
function selectRoom(room) {
  const selectedRoom = dom.rooms.querySelector('.selected');
  if (selectedRoom) {
    selectedRoom.classList.remove('selected');
  }
  if (room !== 'all') {
    const newSelectedRoom = dom.rooms.querySelector(`[data-room=${room}]`);
    const {
      temperature,
      lights,
      humidity,
      lightsoff,
      humidityoff
    } = roomsData[room]
    activeRoom = room;
    newSelectedRoom.classList.add('selected')
    renderScreen(false)
    dom.temperature.innerText = temperature
    renderTemperature(temperature);
    setTemperaturePower();
    changeSettingsType(activeTab);
    changeSlider(lights, dom.sliders.lights);
    changeSlider(humidity, dom.sliders.humidity);
    changeSwitch('lights', lightsoff);
    changeSwitch('humidity', humidityoff);
  } else {
    renderScreen(true)
  }
  const selectedSelectboxRoom = dom.selectbox.querySelector('.selectbox__item.selected')
  selectedSelectboxRoom.classList.remove('selected')
  const newSelectedItem = dom.selectbox.querySelector(`[data-room=${room}]`)
  newSelectedItem.classList.add('selected')
  const selectboxSelected = dom.selectbox.querySelector('.selectbox__selected span')
  selectboxSelected.innerText = rooms[room]
}


//клік по контейнеру кімнати 
dom.rooms.querySelectorAll('.room').forEach(room => {
  room.onclick = (Event) => {
    const value = room.dataset.room
    selectRoom(value)
  }
})


// відображення потрібного екрану
function renderScreen(isRooms) {
  setTimeout(() => {
    if (isRooms) {
      dom.rooms.style.display = 'grid'
      dom.settings.style.display = 'none'
    } else {
      dom.settings.style.display = 'block'
      dom.rooms.style.display = 'none'
    }
  }, 300)
}



// ПАНЕЛЬ ОПЦІЙ КОЖНОЇ КІМНАТИ=================================================
const roomsData = {
  livingroom: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
  bedroom: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
  kitchen: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
  bathroom: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
  studio: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
  washingroom: {
    temperature: 21,
    temperatureoff: false,
    lights: 100,
    lightsoff:false,
    humidity: 80,
    humidityoff: false,
  },
}


// функції зміни температури
function renderTemperature(temperature) {
  const min = 16;
  const max = 40;
  const range = max - min;
  const percent = range / 100;
const lineMin = 54;
const lineMax = 276;
const lineRange = lineMax - lineMin;
const linePercent = lineRange / 100;
      const roundMin = -240;
      const roundMax = 48;
      const roundRange = roundMax - roundMin;
      const roundPercent = roundRange / 100;
    if (temperature >= min && temperature <= max) {
      const finishPercent = Math.round((temperature - min) / percent);
      const lineFinishPercent = lineMin + linePercent * finishPercent;
      const roundFinishPercent = roundMin + roundPercent * finishPercent;
dom.temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
dom.temperatureRound.style.transform = `rotate(${roundFinishPercent}deg`;
dom.temperature.innerText = temperature;
    }
}


// ---===управління температурою задопомогою мишки ----
function changeThemperature() {
  let mouseover = false;
  let mousedown = false;
  let position = 0;
  let range = 0;
  let change = 0; 

  dom.temperatureBtn.onmouseover = () => mouseover = true;
  dom.temperatureBtn.onmouseout = () => mouseover = false;
  dom.temperatureBtn.onmouseup = () => mousedown = false;
  dom.temperatureBtn.onmousedown = (Event) => {
    mousedown = true;
    position = Event.offsetY;
    range = 0;
  }
  dom.temperatureBtn.onmouseup = () => mouseover = false;
  dom.temperatureBtn.onmousemove = (Event) => {
    if(mouseover && mousedown) {
     range = Event.offsetY - position
     const newChange = Math.round(range / -5);
     if (newChange != change) {
     let temperature = +dom.temperature.innerText 
     if (newChange < change) {
      temperature = temperature - 1
     } else {
      temperature = temperature +1
     }
     change = newChange;
     renderTemperature(temperature)
    }
  }
 }
}
changeThemperature()

// --- установка/збереження температури кнопка----
dom.temperatureSaveBtn.onclick = () =>  {
  const temperature = +dom.temperature.innerText;
   roomsData[activeRoom].temperature = temperature
   alert('Температуру встановлено')
}

// кнопка теаператури --
dom.temperaturePowerBtn.onclick = () => {
  const power = dom.temperaturePowerBtn
  power.classList.toggle('off');
  if (power.matches('.off')) {
  roomsData[activeRoom].temperatureoff = true
  } else {
    roomsData[activeRoom].temperatureoff = false
  }
}
// кнопка включення температури 
function setTemperaturePower() {
  if (roomsData[activeRoom].temperatureoff) {
  dom.temperaturePowerBtn.classList.add('off');
   } else {
    dom.temperaturePowerBtn.classList.remove('off');
   }
}

// вибір вкладок опцій всередині кімнати------
dom.settingsTabs.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
      const optionType = tab.dataset.type
      activeTab = optionType
      changeSettingsType(optionType)
    }
})

// переключення вкладок---------------------
function changeSettingsType(type) {
  const tabSelected = dom.settingsTabs.querySelector('.tab.selected')
  const tab = dom.settingsTabs.querySelector(`[data-type=${type}]`);
  const panelSelected = dom.settingsPanels.querySelector('.selected');
  const panel = dom.settingsPanels.querySelector(`[data-type=${type}]`);
  tabSelected.classList.remove('selected');
  panelSelected.classList.remove('selected');
  tab.classList.add('selected');
  panel.classList.add('selected');
}

// СЛАЙДЕР ВОЛОГОСТІ ТА ЯСКРАВОСТІ ====================================
function changeSlider(percent, slider) {
      if (percent >= 0 && percent <= 100) {
        const { type } = slider.parentElement.parentElement.dataset
     slider.querySelector('span').innerText = percent;
     slider.style.height = `${percent}%`;
     roomsData[activeRoom] [type] = percent
 }
}


// Відслідковування зміни слайдера вологість/яскравість-----------
function watchSlider(slider) {
  let mouseover = false;
  let mousedown = false;
  let position = 0;
  let range = 0;
  let change = 0; 
  const parent = slider.parentElement;

parent.onmouseover = () => mouseover = true;
parent.onmouseout = () => mouseover = false;
parent.onmouseup = () => mousedown = false;
parent.onmousedown = (Event) => {
    mousedown = true;
    position = Event.offsetY;
    range = 0;
  }
  parent.onmouseup = () => mouseover = false;
  parent.onmousemove = (Event) => {
    if(mouseover && mousedown) {
     range = Event.offsetY - position
     const newChange = Math.round(range / -0.1);
     if (newChange != change) {
     let percent = +slider.querySelector('span').innerText 
     if (newChange < change) {
      percent = percent - 1
     } else {
      percent = percent +1
     }
     change = newChange;
     changeSlider(percent,slider)
    }
  }
 }
}

watchSlider(dom.sliders.lights);
watchSlider(dom.sliders.humidity);


// кнопка вкл/викл яскравість,вологість ===========================
function changeSwitch(activeTab, isOff) {
  if (isOff) {
    dom.switch[activeTab].classList.add('off');
  } else {
    dom.switch[activeTab].classList.remove('off');
  }
  roomsData[activeRoom]['${activeTab}Off'] = isOff;
}

// переключення кнопки (відслідковування кліку)
dom.switch.humidity.onclick = () => {
  const isOff = !dom.switch.humidity.matches('.off');
  changeSwitch(activeTab, isOff)
}

dom.switch.lights.onclick = () => {
  const isOff = !dom.switch.lights.matches('.off');
  changeSwitch(activeTab, isOff)
}