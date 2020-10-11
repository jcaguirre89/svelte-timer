<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const start = () => dispatch("start");
  const stop = () => dispatch("stop");
  const pause = () => dispatch("pause");

  //props
  export let subscription;
  export let lapsed;
</script>

<div>
  {#if subscription}
    <button on:click="{pause}">Pause</button>
  {:else if lapsed}
    <button on:click="{stop}">Reset</button>
    <button on:click="{start}">Continue</button>
  {:else}<button on:click="{start}">Start</button>{/if}
</div>
