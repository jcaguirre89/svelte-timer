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
    trainPaused: "trainPaused",
    restPaused: "restPaused",
  };
  let currentState = states.idle;
  $: isTrain = ["train", "trainPaused"].includes(currentState);
  $: isRest = ["rest", "restPaused"].includes(currentState);
  let previousState = null;
  let trainDuration = 5000;
  let restDuration = 3000;
  $: trainRemaining = trainDuration;
  $: restRemaining = restDuration;
  $: timeRemaining = isRest ? restRemaining : trainRemaining;
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

<style lang="postcss">
  main {
    @apply h-screen w-screen bg-gray-500 flex flex-col items-center;
  }

  button {
    @apply rounded-full uppercase text-white bg-gray-800 flex items-center justify-center;
  }

  input {
    @apply w-40;
  }

  label {
    @apply text-white;
  }

  .isRest {
    @apply bg-red-500;
  }

  .isTrain {
    @apply bg-green-500;
  }
</style>

<main class:isRest class:isTrain class="md:justify-center">
  <div class="mt-32 md:mt-0">
    <p class="text-6xl text-white mb-b">{formatTime(timeRemaining)}</p>
    <p class="text-white uppercase tracking-wide text-2xl mb-12">
      Rounds:
      {rounds}
    </p>
    <div class="flex">
      {#if currentState == states.idle}
        <button on:click="{train}"><PlayIcon /></button>
      {:else}
        {#if currentState.endsWith('Paused')}
          <button on:click="{resume}"><PlayIcon /></button>
        {:else}
          <button on:click="{pause}"><PauseIcon /></button>
        {/if}
        <button class="ml-2" on:click="{reset}"><StopIcon /></button>
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
    </div>
  </div>
</main>
