//var ICPU  = require('avr8js');
//import * as simulator from '../../node_modules/@wokwi/elements/dist/wokwi-elements.bundle.js';
var testSimulate = require('../../node_modules/@wokwi/elements/dist/wokwi-elements.bundle.js');
//import {LEDElement} from '../../node_modules/@wokwi/elements/dist/wokwi-elements.bundle.js';
//console.log(ICPU);

var { PinState } = require('avr8js');
//var { buildHex } = require('avr8js');
//var { AVRRunner } = require('avr8js');
//var { formatTime } = require('avr8js');
var { ICPU } = require('avr8js');

function displayProp(obj){    
    var names="";       
    for(var name in obj){       
       names+=name+": "+obj[name]+", ";  
    }  
    console.log(names);  
}  

//var testSimulate1 = new testSimulate();
console.log(testSimulate);
// Set up LEDs
const led13 = document.querySelector('wokwi-led[color=green]');
const led12 = document.querySelector('wokwi-led[color=red]');
const led11 = document.querySelector('wokwi-led[color=blue]');

// Set up toolbar
let runner =  null;

const runButton = document.querySelector('#run-button');
runButton.addEventListener('click', compileAndRun);
const stopButton = document.querySelector('#stop-button');
stopButton.addEventListener('click', stopCode);
//const revertButton = document.querySelector('#revert-button');
//revertButton.addEventListener('click', setBlinkSnippet);
const statusLabel = document.querySelector('#status-label');
const compilerOutputText = document.querySelector('#compiler-output-text');
const serialOutputText = document.querySelector('#serial-output-text');

function executeProgram(hex) {
  runner = new AVRRunner(hex);
  const MHZ = 16000000;

  let lastState = PinState.Input;
  let lastStateCycles = 0;
  let lastUpdateCycles = 0;
  let ledHighCycles = 0;

  // Hook to PORTB register
  runner.portB.addListener((value) => {
    led12.value = runner.portB.pinState(4) === PinState.High;
    led13.value = runner.portB.pinState(5) === PinState.High;

    const pin11State = runner.portB.pinState(3);
    if (lastState !== pin11State) {
      const delta = runner.cpu.cycles - lastStateCycles;
      if (lastState === PinState.High) {
        ledHighCycles += delta;
      }
      lastState = pin11State;
      lastStateCycles = runner.cpu.cycles;
    }
  });
  runner.usart.onByteTransmit = (value) => {
    serialOutputText.textContent += String.fromCharCode(value);
  };
  const cpuPerf = new CPUPerformance(runner.cpu, MHZ);

  runner.execute((cpu) => {
    const time = formatTime(cpu.cycles / MHZ);
    const speed = (cpuPerf.update() * 100).toFixed(0);
    statusLabel.textContent = `仿真时间: ${time} (${speed}%)`;
    const cyclesSinceUpdate = cpu.cycles - lastUpdateCycles;
    const pin11State = runner.portB.pinState(3);
    if (pin11State === PinState.High) {
      ledHighCycles += cpu.cycles - lastStateCycles;
    }
    led11.value = ledHighCycles > 0;
    led11.brightness = ledHighCycles / cyclesSinceUpdate;
    lastUpdateCycles = cpu.cycles;
    lastStateCycles = cpu.cycles;
    ledHighCycles = 0;
  });
}

async function compileAndRun() {
  led12.value = false;
  led13.value = false;

  storeUserSnippet();

  runButton.setAttribute('disabled', '1');
  //revertButton.setAttribute('disabled', '1');

  serialOutputText.textContent = '';
  //try {
    statusLabel.textContent = 'Compiling...';
    const result = buildHex();
    //compilerOutputText.textContent = result.stderr || result.stdout;
    if (result.hex) {
      //compilerOutputText.textContent += '\nProgram running...';
      stopButton.removeAttribute('disabled');
      executeProgram(result.hex);
    } else {
      runButton.removeAttribute('disabled');
    }
  //} catch (err) {
    //runButton.removeAttribute('disabled');
    //revertButton.removeAttribute('disabled');
    //console.log('Failed: ' + err);
  //} finally {
    //statusLabel.textContent = '';
  //}
}

function storeUserSnippet() {
  //EditorHistoryUtil.clearSnippet();
  //EditorHistoryUtil.storeSnippet(editor.getValue());
}

function stopCode() {
  stopButton.setAttribute('disabled', '1');
  runButton.removeAttribute('disabled');
  //revertButton.removeAttribute('disabled');
  if (runner) {
    runner.stop();
    runner = null;
  }
}

function setBlinkSnippet() {
  editor.setValue(BLINK_CODE);
  EditorHistoryUtil.storeSnippet(editor.getValue());
}

var {
  avrInstruction,
  AVRTimer,
  CPU,
  timer0Config,
  timer1Config,
  timer2Config,
  AVRIOPort,
  AVRUSART,
  portBConfig,
  portCConfig,
  portDConfig,
  usart0Config
} = require("avr8js");

// ATmega328p params
const FLASH = 0x8000;

function load_Hex(source, target) {
  for (const line of source.split('\n')) {
    if (line[0] === ':' && line.substr(7, 2) === '00') {
      const bytes = parseInt(line.substr(1, 2), 16);
      const addr = parseInt(line.substr(3, 4), 16);
      for (let i = 0; i < bytes; i++) {
        target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
      }
    }
  }
}

function zeroPad(value, length) {
  let sval = value.toString();
  while (sval.length < length) {
    sval = '0' + sval;
  }
  return sval;
}

function formatTime(seconds) {
  const ms = Math.floor(seconds * 1000) % 1000;
  const secs = Math.floor(seconds % 60);
  const mins = Math.floor(seconds / 60);
  return `${zeroPad(mins, 2)}:${zeroPad(secs, 2)}.${zeroPad(ms, 3)}`;
}

class AVRRunner {

  constructor(hex) {
  	this.program = new Uint16Array(FLASH);
  	this.speed = 16e6; // 16 MHZ
  	this.workUnitCycles = 500000;
  	this.taskScheduler = new MicroTaskScheduler();
    load_Hex(hex, new Uint8Array(this.program.buffer));
    this.cpu = new CPU(this.program);
    this.timer0 = new AVRTimer(this.cpu, timer0Config);
    this.timer1 = new AVRTimer(this.cpu, timer1Config);
    this.timer2 = new AVRTimer(this.cpu, timer2Config);
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.portC = new AVRIOPort(this.cpu, portCConfig);
    this.portD = new AVRIOPort(this.cpu, portDConfig);
    this.usart = new AVRUSART(this.cpu, usart0Config, this.speed);
    this.taskScheduler.start();
  }

  // CPU main loop
  execute(callback) {
    const cyclesToRun = this.cpu.cycles + this.workUnitCycles;
    while (this.cpu.cycles < cyclesToRun) {
      avrInstruction(this.cpu);
      this.cpu.tick();
    }

    callback(this.cpu);
    this.taskScheduler.postTask(() => this.execute(callback));
  }

  stop() {
    this.taskScheduler.stop();
  }
}

class MicroTaskScheduler {
  
	constructor() {
		this.messageName = 'zero-timeout-message';
  		this.executionQueue = [];
  		this.stopped = true;
	}
  start() {
    if (this.stopped) {
      this.stopped = false;
      window.addEventListener('message', this.handleMessage, true);
    }
  }

  stop() {
    this.stopped = true;
    window.removeEventListener('message', this.handleMessage, true);
  }

  postTask(fn) {
    if (!this.stopped) {
      this.executionQueue.push(fn);
      window.postMessage(this.messageName, '*');
    }
  }

  handleMessage = (event) => {
    if (event.data === this.messageName) {
      event.stopPropagation();
      const executeJob = this.executionQueue.shift();
      if (executeJob !== undefined) {
        executeJob();
      }
    }
  };
}

class CPUPerformance {

  constructor(cpu, MHZ) {
  	  this.prevTime = 0;
	  this.prevCycles = 0;
	  this.samples = new Float32Array(64);
	  this.sampleIndex = 0;
	  this.cpu = cpu;
	  this.MHZ = MHZ;
  }

  reset() {
    this.prevTime = 0;
    this.prevCycles = 0;
    this.sampleIndex = 0;
  }

  update() {
    if (this.prevTime) {
      const delta = performance.now() - this.prevTime;
      const deltaCycles = this.cpu.cycles - this.prevCycles;
      const deltaCpuMillis = 1000 * (deltaCycles / this.MHZ);
      const factor = deltaCpuMillis / delta;
      if (!this.sampleIndex) {
        this.samples.fill(factor);
      }
      this.samples[this.sampleIndex++ % this.samples.length] = factor;
    }
    this.prevCycles = this.cpu.cycles;
    this.prevTime = performance.now();
    const avg = this.samples.reduce((x, y) => x + y) / this.samples.length;
    return avg;
  }
}

function buildHex() {
  var simulateData = file_save.readFileSync(mixly_20_path+"\\mixlyBuild\\testArduino.ino.hex",'utf-8');
  return {
    "hex": simulateData,
    "eep": ""
  }
}