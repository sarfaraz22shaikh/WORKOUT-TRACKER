'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map , mapevent;
let longitude , latitude;
class workout{
    date = new Date();
    id = (new Date().toISOString() + " ").slice(-10);
    constructor(coords , distance , duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
        // console.log(this.date.toISOString());
    }
}
class Running extends workout{
    constructor(coords , distance , duration , cadence){
        super(coords , distance , duration);
        this.cadence = cadence;
        this.calpace();
    }
    calpace(){
        //min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
};
class Cycling extends workout{
    constructor(coords , distance , duration , elevation){
    super(coords , distance , duration)
        this.elevation = elevation;
        this.calspeed();
    }
    calspeed(){
        // km/hr;
        this.speed = this.distance / ( this.duration / 60 );
        return this.speed;
    }
}
// -----------------------------------////////////////////////------------------------////////////////---------------------////////////////-------------
// application architechure
class App{
    #map;
    #mapevent;
    #workout = [];
    constructor(){
        this._getposition();
        form.addEventListener('submit' ,this._newWorkout.bind(this) );
        inputType.addEventListener('change' , function(){
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    });}
    _getposition(){
        if(navigator.geolocation);
        navigator.geolocation.getCurrentPosition(this._loadmap.bind(this), function(){
            alert("turn on your location");
        });
    };
    _loadmap(position){
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            this.#map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.#map);
        var marker = L.marker([latitude, longitude]).addTo(this.#map);
        this.#map.on('click' ,this._showform.bind(this));
    };
    _showform(mape){
            this.#mapevent = mape;
            form.classList.remove('hidden');
            inputDistance.focus();
            form.addEventListener('submit' ,this._newWorkout.bind(this) );
        };
    _toggleElevationfield(){s
        inputType.addEventListener('change' , function(){
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        });
    };
    _newWorkout(e){
            e.preventDefault();

        const ValidInputs = function(...input){
            input.every(inp => Number.isFinite(inp))
        };

        const allpositive = function(...input){
            input.every((inp) => inp > 0);
            }
            // get data from form
            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;
            let workout;

            // if workout running create running object
            if(type === 'running') {
                console.log("in running ");
                const cadence = +inputCadence.value
                // check data is valid
                if( ! ValidInputs(distance , duration , cadence) ) {
                    console.log("checking condition");
                    return alert(' Input have to be positive number');
            }
            console.log("printing workout");
            workout = new Running( [latitude , longitude], distance , duration , cadence)
            this.#workout.push(workout);
            
            } ;
            // if workout cycling create cycling object
            //    if(type === 'cycling'){
            //     // console.log("in cycling");
            //     const elevation = +inputElevation.value;
            //     if( ! ValidInputs(distance , duration , cadence) ||  allpositive(distance , duration ,)) {
            //         return alert(' Input have to be positive number');
            // }
            //     workout = new Cycling( [this.latitude , this.longitude], distance , duration , elevation);
            //     this.#workout.push(workout);
            //     }
             //  add new object to workout array
            // render workout on map as marker
            inputDistance.value = inputDuration.value = inputCadence.value = " ";
                //  console.log(this.#mapevent);
                L.marker([this.#mapevent.latlng.lat, this.#mapevent.latlng.lng]).addTo(this.#map).bindPopup(L.popup({
                    maxWidth : 250,
                    minWidth : 100,
                    autoClose : false,
                    closeOnClick : false,
                    ClassName : 'running-popup',
                })).setPopupContent('Workout')
                .openPopup();
    }
}
const app = new App();