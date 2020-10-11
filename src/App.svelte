<script>
  import { onDestroy } from "svelte";
  import { time } from "./stores";
  import { formatTime } from "./utils";
  import Controls from "./Controls.svelte";

  // lapse records the time in ms since the start button was pressed
  let lapse = 0;
  // previous records the time in ms that had run before the pause button was set
  let previous = 0;
  // unsuscribe is the function that unsuscribes from the time store
  let unsuscribe;

  // total time in training state
  let train = 0;
  // total time in rest state
  let rest = 0;

  // train or rest state
  let trainState = true

  let trainDuration = 120000;
  let restDuration = 10000;

  // number of rounds trained
  $: rounds = Math.floor(train / trainDuration);

  // the start function pairs the lapse var with the time store
  function start() {
    unsuscribe = time.subscribe((value) => {
      lapse = value + previous;
    });
  }

  // the terminate function unsuscribes from the store
  function terminate() {
    if (unsuscribe) {
      unsuscribe();
      unsuscribe = null;
    }
  }

  // reset all timers
  function stop() {
    lapse = 0;
    previous = 0;
    train = 0
    rest = 0
    terminate();
  }

  function pause() {
    previous = lapse;
    terminate();
  }

  // true if currently subscribed
  $: subscription = !!unsuscribe;

  // true if some time has ran (used for pause state)
  $: lapsed = !!lapse;

  onDestroy(() => terminate());
</script>

<main>
  <p>{formatTime(lapse)}</p>
  <Controls
    on:start="{start}"
    on:pause="{pause}"
    on:stop="{stop}"
    lapsed="{lapsed}"
    subscription="{subscription}"
  />
</main>
