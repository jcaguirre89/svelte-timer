<script>
  import { formatTime } from "./utils";
  import { onDestroy } from "svelte";

  let states = {
    train: "train",
    idle: "idle",
    rest: "rest",
    trainPaused: "trainPaused",
    restPaused: "restPaused",
  };
  let currentState = states.idle;
  let previousState = null;
  let trainDuration = 5000;
  let restDuration = 3000;
  $: trainRemaining = trainDuration;
  $: restRemaining = restDuration;
  $: timeRemaining = !currentState.startsWith("rest")
    ? trainRemaining
    : restRemaining;
  let rounds = 0;
  let paused = false;
  let interval;

  function setState(newState) {
    previousState = currentState;
    currentState = newState;
    clearInterval(interval);
  }

  function switchState() {
    trainRemaining = trainDuration;
    restRemaining = restDuration;
  }

  function pause() {
    paused = !paused;
    if (currentState == "rest") {
      setState(states.restPaused);
    } else if (currentState == "train") {
      setState(states.trainPaused);
    } else {
      throw Error(`Can't pause in this state ${currentState}`);
    }
  }

  function resume() {
    paused = !paused;
    if (currentState == "restPaused") {
      rest();
    } else if (currentState == "trainPaused") {
      train();
    } else {
      throw Error(`Can't resume in this state ${currentState}`);
    }
  }

  function train() {
    setState(states.train);
    if (previousState != states.trainPaused) {
      switchState();
    }
    interval = setInterval(() => {
      if (trainRemaining === 0) {
        completeRound();
      }
      trainRemaining -= 10;
    }, 10);
  }

  function completeRound() {
    rounds += 1;
    rest();
  }

  function rest() {
    setState(states.rest);
    if (previousState != states.restPaused) {
      switchState();
    }
    interval = setInterval(() => {
      if (restRemaining === 0) {
        train();
      }
      restRemaining -= 10;
    }, 10);
  }

  function reset() {
    setState(states.idle);
    switchState();
    rounds = 0;
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<style>
  .rest {
    @apply bg-red-500;
  }
</style>

<main
  class="h-screen w-screen bg-green-500"
  class:rest="{currentState.startsWith('rest')}"
>
  <p>{formatTime(timeRemaining)}</p>
  <p>{currentState}</p>
  <p>{rounds}</p>
  {#if currentState == states.idle}
    <button on:click="{train}">Start</button>
  {:else}
    {#if currentState.endsWith('Paused')}
      <button on:click="{resume}">Resume</button>
    {:else}<button on:click="{pause}">Pause</button>{/if}
    <button on:click="{reset}">Stop</button>
  {/if}
  <label>
    Train Duration
    <input
    type="range"
    bind:value="{trainDuration}"
    min="0"
    max="300000"
    step="1000"
    />
  </label>
  <label>
    Rest Duration
    <input
    type="range"
    bind:value="{restDuration}"
    min="0"
    max="60000"
    step="1000"
    />
  </label>
</main>
