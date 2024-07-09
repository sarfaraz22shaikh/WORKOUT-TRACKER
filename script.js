'use strict';

// prettier-ignore

// let map , mapevent;

//___________Refactoring the Code __________//

// The classes for the

class Workout {
  date = new Date();
  id = (Date.now() + ' ').slice(-10);

  constructor(coords, distance, duration) {
    // this .date = ---
    // this .id = ---
    this.coords = coords;
    this.distance = distance; // in k,
    this.duration = duration; // in min
    //this.__setDescription();
  }

  __setdescription() {

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    this.descritption = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()} `;
  }

  // click(){
  //   this.clicks++;
  // }

}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this.__setdescription();
  }

  calcPace() {
    // min/hr
    this.pace = this.distance / this.duration;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcspeed();
    this.__setdescription();
  }

  calcspeed() {
    // km/h
    this.speed = this.distance / this.duration / 60;
    return this.speed;
  }
}

// const run1 = new  Running([39 , -12 ,] , 5.2 , 24,178);
// const cycling = new Cycling([39 , -12] , 27,95,523);
// console.log(run1 , cycling);

// application architecture
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//using the classes and methods

class App {
  #map;
  #mapevent;
  #workouts = [];
  #mapZoomlevel;
  constructor() {
    //To get the user's position from the local storage.
    this.__getpostion();
    //Get data from the local storage.
    this.__getLocalStorage();
    //Attach Event Handlers
    form.addEventListener('submit', this.__newWorkout.bind(this));
    inputType.addEventListener('change', this.__toggleElveation);
    containerWorkouts.addEventListener('click', this.__moveToPopup);
    
  }

  __getpostion() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.__loadMap.bind(this),

        function () {
          alert(' WE are unable to find your location.');
          console.log('alert !!! we are not able to find your location.');
        }
      );
  }

  __loadMap(position) {
    // alert('your position is ' + position );
    console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    console.log(this);
    this.#map = L.map('map').setView(coords, 13);

    console.log(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //to Point out the click on the map
    this.#map.on('click', this.__showForm.bind(this));

   // this.#workouts = data;
    this.#workouts.forEach(work =>{
     // this.__renderWorkout(work);
      this.__renderWorkoutMarker(work);
    });
  
  }

  __showForm(mape) {
    this.#mapevent = mape;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  __hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
      '';

    form.classList.add('hidden');
    form.classList.add('hidden');
    setTimeout(() => form.style.display = 'grid', 1000);
  }

  __toggleElveation() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  __newWorkout(e) {
    const validIputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    e.preventDefault();
    const allpositive = (...inputs) => inputs.every(inp => inp > 0);

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapevent.latlng;
    let workout = [];
    // check if data  is valid

    // if activity running , create running object

    if (type == 'running') {
      const cadence = +inputCadence.value;
      //check if data is valid for example
      if (
        // Number.isFinite(distance) ||
        // Number.isFinite(duration) ||
        // Number.isFinite(cadence)
        !validIputs(distance, duration, cadence) ||
        !allpositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive number!!!'); // this is type of old way we can do a little bit different .
      workout = new Running([lat, lng], distance, duration, cadence);
      this.#workouts.push(workout);
    }

    // if activity cycling , create running object

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //check if data is valid for example
      if (
        // Number.isFinite(distance) ||
        // Number.isFinite(duration) ||
        // Number.isFinite(cadence)
        !validIputs(distance, duration, elevation) ||
        !allpositive(distance, duration, elevation)
      )
        return alert('Inputs have to be positive number!!!'); // this is type of old way we can do a little bit different .

      workout = new Cycling([lat, lng], distance, duration, elevation);
      this.#workouts.push(workout);
    }

    //Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render  workout marker on the map

    this.__renderWorkoutMarker(workout);
    this.__renderWorkout(workout);

    console.log(this.#mapevent);

    // Hide form + clear input fields

    this.__hideForm();


    // clear input fields
    // inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = ' ';

    // //Display marker
    //form.style.display = 'none';

    // store the previous data in the local storage.
    this.__setLocalStorage();

  }

  __renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          CloseOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.descritption}`)
      .openPopup();
  }

  __renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${workout.id
      }">
    <h2 class="workout__title">${workout.descritption}</h2>
    <div class="workout__details">
      <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

    if (workout.type === 'running') {
      html += `  <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace.toFixed(1)}</span>
      <span class="workout__unit">min/km</span>
    </div>
       <div class="workout__details">
         <span class="workout__icon">🦶🏼</span>
         <span class="workout__value">${workout.cadence}</span>
         <span class="workout__unit">spm</span>
        </div>
     </li>`;
    }

    if (workout.type === 'cycling') {
      html += `<div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed(1)}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
   </li> `;

    }

    form.insertAdjacentHTML('afterend', html)



  }

  ___moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    if (!workoutEl) {
      const workout = this.#workouts.find(
        work => work.id === workoutEl.dataset.id
      );
      console.log(workout);
      this.#map.setView(workout.coords, this.#mapZoomlevel, {
        animate: true,
        pan: {
          duration: 1,
        },
      });
    }

    // public interface 
   // workout.click();
  }

  __setLocalStorage(){
    localStorage.setItem('workout' , JSON.stringify(this.#workouts));
  }


  __getLocalStorage(){
    const data =  JSON.parse(localStorage.getItem('workout'));
    console.log(data);
      if (!data) return ; 
    this.#workouts = data;
    this.#workouts.forEach(work =>{
      this.__renderWorkout(work);
      //this.__renderWorkoutMarker(work);
    });
  }


  reset(){
    localStorage.removeItem('workouts');
    location.reload();
  }

  
}



// using the class methods and objects .
const app = new App();
//app.__getpostion();  [the class is aleady having a function in it through which we can create and call the Group.]

//checking for the geolocation
