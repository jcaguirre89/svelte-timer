<script>
  import { formatTime } from "./utils";
  import { onDestroy } from "svelte";
  import PlayIcon from "./PlayIcon.svelte";
  import PauseIcon from "./PauseIcon.svelte";
  import StopIcon from "./StopIcon.svelte";

  let states = {
    train: "train",
    idle: "idle",
    rest: "rest",
    longRest: "longRest",
    trainPaused: "trainPaused",
    restPaused: "restPaused",
    longRestPaused: "longRestPaused",
  };
  let currentState = states.idle;
  $: isTrain = ["train", "trainPaused"].includes(currentState);
  $: isRest = ["rest", "restPaused"].includes(currentState);
  $: isLongRest = ["longRest", "longRestPaused"].includes(currentState);
  let previousState = null;
  let trainDuration = 120000;
  let restDuration = 30000;
  let longRestDuration = 60000;
  $: trainRemaining = trainDuration;
  $: restRemaining = restDuration;
  $: longRestRemaining = longRestDuration;
  $: timeRemaining = isRest
    ? restRemaining
    : isLongRest
    ? longRestRemaining
    : trainRemaining;
  let rounds = 0;
  let longRestCycle = 5;
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
    if (currentState == states.rest) {
      setState(states.restPaused);
    } else if (currentState == states.train) {
      setState(states.trainPaused);
    } else if (currentState == states.longRest) {
      setState(states.longRestPaused);
    } else {
      throw Error(`Can't pause in this state ${currentState}`);
    }
  }

  function resume() {
    paused = !paused;
    if (currentState == states.restPaused) {
      rest();
    } else if (currentState == states.trainPaused) {
      train();
    } else if (currentState == states.longRestPaused) {
      longRest();
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
    if (rounds % longRestCycle) {
      rest();
    } else {
      longRest();
    }
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

  function longRest() {
    setState(states.longRest);
    if (previousState != states.longRestPaused) {
      switchState();
    }
    interval = setInterval(() => {
      if (longRestRemaining === 0) {
        train();
      }
      longRestRemaining -= 10;
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

<style lang="postcss">
  main {
    @apply h-screen w-screen bg-gray-700 flex flex-col items-center;
  }

  button {
    @apply rounded-full uppercase text-white bg-gray-800 flex items-center justify-center;
  }

  input {
    @apply w-full;
  }

  label {
    @apply text-white text-xl;
  }

  .isRest {
    @apply bg-red-500;
  }

  .isTrain {
    @apply bg-green-500;
  }

  .isLongRest {
    @apply bg-yellow-600;
  }
</style>

<main class:isRest class:isTrain class:isLongRest class="md:justify-center">
  <div class="mt-24 md:mt-0">
    <p class="text-6xl text-white mb-b">{formatTime(timeRemaining)}</p>
    {#if rounds >= 1}
      <p class="text-white text-2xl mb-12">
        {rounds}
        round{rounds > 1 ? 's' : ''}
      </p>
    {:else}
      <p class="text-white text-2xl mb-12">0 rounds</p>
    {/if}
    <div class="flex">
      {#if currentState == states.idle}
        <button on:click="{train}" aria-label="Start Timer"><PlayIcon
          /></button>
      {:else}
        {#if currentState.endsWith('Paused')}
          <button on:click="{resume}" aria-label="Resume Timer"><PlayIcon
            /></button>
        {:else}
          <button on:click="{pause}" aria-label="Pause Timer"><PauseIcon
            /></button>
        {/if}
        <button
          class="ml-2"
          on:click="{reset}"
          aria-label="Reset Timer"
        ><StopIcon /></button>
      {/if}
    </div>
    <div class="flex flex-col mt-12">
      <label for="trainDuration">
        Train Time:
        {formatTime(trainDuration)}
      </label>
      <input
        id="trainDuration"
        type="range"
        bind:value="{trainDuration}"
        min="0"
        max="300000"
        step="1000"
      />
      <label class="mt-2" for="restDuration">
        Rest Time:
        {formatTime(restDuration)}
      </label>
      <input
        id="restDuration"
        type="range"
        bind:value="{restDuration}"
        min="0"
        max="60000"
        step="1000"
      />
      <label class="mt-2" for="longRestDuration">
        Long Rest Time:
        {formatTime(longRestDuration)}
      </label>
      <input
        id="longRestDuration"
        type="range"
        bind:value="{longRestDuration}"
        min="0"
        max="180000"
        step="1000"
      />
      <label class="mt-2" for="longRestCycle">
        Long Rest every {longRestCycle} rounds
      </label>
      <input
        id="longRestCycle"
        type="range"
        bind:value="{longRestCycle}"
        min="0"
        max="10"
        step="1"
      />
    </div>
  </div>
</main>
