// pseudo code simulating the behavior of the event loop

// node myFile.js

// the event loop does not immediately get executed .

// reads all the file content and execute it .
myFile.runContents();
// New timers, tasks, operations, are recorded from myFile running .

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = []; // code that is being executed inside the thread pool.

function shouldContinue() {
  // - three checks to detemine whether or not
  // the event loop should continue for another iteration .
  // Check one : Any pending setTimeout, setInterval, setImmediate ?
  // Check two : Any pending OS tasks ? (Like server listening on port) .
  // Check three : Any pending long running operations ? (Like fs module) .
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

// every single time the event loop executes we refer to
// that execution as 'tick'
while (shouldContinue()) {
  // 1) Node looks at pending timers and sees if any functions
  // are ready to be called. setTimeout , setInterval .
  // 2) Node looks at pendingOSTasks and pendingOperations
  // and calls relevant callbacks .
  // 3) Pause execution. Continue when ...
  // - a new pendingOSTask is done .
  // - a new pendingOperation is done .
  // - a new time is about to complete
  // 4) Look at pendingTimers. call any setImmediate
  // 5) Handle any 'close' events
}

// exit back to terminal
