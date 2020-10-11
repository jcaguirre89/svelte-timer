<script>
  import { onDestroy } from "svelte";
  import { trainTime, restTime } from "./stores";
  import { formatTime } from "./utils";
  import Controls from "./Controls.svelte";
  import Timer from './Timer.svelte'
 </script>

 <Timer trainDuration={5000} restDuration={3000}/>
