/** 
 * Beginning of game canvas, blank canvas creation
 * Title Menu - Flight Control by Centroids
 * Opening SFO Runway Map and landmass
 * Movement from plane into the runways
 * A: 4000 ft^3; Two class (H) Aircraft : Four class (S) Aircraft. Times to land. 
 * B: 8000 ft^3: Four class (H) Aircraft 
 * C: 16000 ft^3: Eight class (H) Aircraft
 * D: all other airspace. Think a either or()
 
 * Rules:
Two runway pairs are presented to the Player, South to North is (Arrivals), and East to West is (Departures)
(Cannot mix parallel runways for Arrivals & Departures): 01L (for Arrivals) & 01R (for Departures) is not valid; 
01L & 01R are valid arrival runways and 28L & 28R both valid departures. We move then from taxiways to terminals.)

Opening airfield, maybe grid layout over top of simplified earth for markers.
Air space and limits for each zone, how many planes can occupy each zone based on their class type

Airplane Classes:
Delta -  8 Charlie - 4 Bravo - 2 Alpha - 1
Opening
	Flight.JS
	by Centroids
	(Start Game)


Splashdown:
________________________________________________
|__________________Flight.js___________________|
|Play:							                      Time:|
|Pause:							                    Score: |
|											                         |
|Arriving:							             Departing:|
|											                         |											
|______________________________________________|

**/
const blankCanvas = document.getElementById('blankcanvas'); 
const canvas = document.querySelector('canvas'); 
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

//return query and append to canvas as child
function hideStart(){
  var splashScreen = document.querySelector('#title')
  splashScreen.remove()
  canvas.style.display=('inline')
}

// Initial plane in sky
class introPlane{
  constructor(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius,
      0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
}

//blips for the time being, planes on screen class
// base plane (projectile) constructor launched from center
class Plane{
  constructor(x, y, radius, color, velocity){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius
      , 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill() 
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}
//base incoming plane (projectile), enemy variant
class incomingPlane{
  constructor(x, y, radius, color, velocity){
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius
      , 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill() 
  }
  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

const x = innerWidth / 2;
const y = innerHeight / 2;

//first player blip drawn
const startPlane = new introPlane(x, y, 15, 'transparent');
const planesInFlight = []
const incomingPlanes = []

function spawnincomingPlanes(){
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x 
    let y

    if (Math.random() < 0.5){
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random () * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }

    const flightAngle = Math.atan2(
      canvas.height / 2 - y,
      canvas.width / 2 - x 
    )
    const color = 'white'
    const velocity = {
      x: Math.cos(flightAngle),
      y: Math.sin(flightAngle)
    }  
    incomingPlanes.push(new incomingPlane(x, y, radius, color, 
      velocity))
  }, 2500)
}
spawnincomingPlanes()

//animate
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.clearRect(0,0, canvas.width, canvas.height)
  startPlane.draw()
  planesInFlight.forEach((plane, index) => {
    plane.update()

    //remove defender blips
    if (plane.x - plane.radius < 0 ||
      plane.x - plane.radius > canvas.width ||
      plane.y + plane.radius < 0 ||
      plane.y - plane.radius > canvas.height
    ) {
      setTimeout(() => {
        planesInFlight.splice(index, 1)
      }, 0)
    }
  })
  incomingPlanes.forEach((arrival, index) => {
    arrival.update()

    const dist = Math.hypot(startPlane.x - arrival.x, startPlane.y - arrival.y)

    //end game
    if (dist - arrival.radius - startPlane.radius < 1){
      cancelAnimationFrame(animationId)
    }
    planesInFlight.forEach((plane, planeIndex) => {
      const dist = Math.hypot(plane.x - arrival.x,
        plane.y - arrival.y)

      if (dist - arrival.radius - plane.radius < 1)
      {
        setTimeout(() =>{
          incomingPlanes.splice(index, 1)
          planesInFlight.splice(planeIndex, 1)
        }, 0)
      }
    })
  })
}

function restartGame(){

}
//click function
addEventListener('click', (event) => 
{ 
  const flightAngle = Math.atan2(
    event.clientY - canvas.height /2,
    event.clientX - canvas.width / 2
  )
  const velocity = {
    x: Math.cos(flightAngle),
    y: Math.sin(flightAngle)
  }
  planesInFlight.push(
    new Plane(
      canvas.width / 2,
      canvas.height / 2, 
      4, 
      'purple',
      velocity)
  )
})

animate()


/** const plane = new Plane(
  canvas.width / 2,
  canvas.height / 2,
  5,
  'black',
  {
    x: 1,
    y: 1
  }
)**/

//addEventListener('resize', windowResize);
/**
  Opening airfield, maybe grid layout over top of simplified earth for markers.
  Air space and limits for each zone, how many planes can occupy each zone based on their class type 
  Map:
    Zone SFO Aerial: Grid View, No expanded SFO view.
  Air Space:
    From the air: Alpha, Bravo, Charlie, Delta
  A: 4000 ft^3; Two class (H) Aircraft : Four class (S) Aircraft. Times to land. 
  B: 8000 ft^3: Four class (H) Aircraft 
  C: 16000 ft^3: Eight class (H) Aircraft
  D: all other airspace. Think a either or()

  Aircraft:
    Heavy: only up to 2 per landing with parallel sequencing
    Medium: up to 4 per landing with parallel sequencing, not always the best idea.
    Light:   
  Rules:
  Two runway pairs are presented to the Player, they choose which one is arrival, one departures.
  Runway configurations cannot be mixed.
  IE. (Cannot mix parallel runways for Arrivals & Departures): 01L (for Arrivals) & 01R (for Departures) is not valid; 
  01L & 01R are valid arrival runways meaning 28L & 28R are both valid departures. We move then from taxiways to terminals. 
*/