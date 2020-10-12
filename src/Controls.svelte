<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const start = () => dispatch("start");
  const stop = () => dispatch("stop");
  const pause = () => dispatch("pause");

  //props
  export let subscription;
  export let lapsed;
  export let trainDuration;
  export let restDuration;
  export let setTrainDuration;
  export let setRestDuration;
</script>

<div>
  {#if subscription}
    <button on:click="{pause}">Pause</button>
  {:else if lapsed}
    <button on:click="{stop}">Reset</button>
    <button on:click="{start}">Continue</button>
  {:else}<button on:click="{start}">Start</button>{/if}
  <input type="range" value="{trainDuration}" on:change="{setTrainDuration}" />
</div>
