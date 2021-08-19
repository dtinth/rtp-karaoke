<script lang="ts">
  export let active;
  let measurer;
  let clip = "unset";
  $: {
    if (measurer) {
      const rect = measurer.getBoundingClientRect();
      const p = active.progress;
      const x = p <= 0 ? 0 : rect.left + p * rect.width;
      clip = `rect(auto, ${x}px, auto, auto)`;
    }
  }
</script>

<div
  class="text-center leading-loose font-bold whitespace-nowrap"
  style="font-size:7vw;"
>
  <div class="relative opacity-0">
    <span bind:this={measurer}>{active.line}</span>
  </div>
  <div class="absolute inset-0 t-outline">
    {active.line}
  </div>
  <div class="absolute inset-0 text-white">
    {active.line}
  </div>
  <div class="absolute inset-0" style="clip:{clip}">
    <div class="absolute inset-0 t-active-outline">
      {active.line}
    </div>
    <div class="absolute inset-0 text-blue-800">
      {active.line}
    </div>
  </div>
</div>

<style>
  .t-outline {
    -webkit-text-stroke: 0.12em black;
    text-shadow: 0.05em 0.05em 0.2em black;
  }
  .t-active-outline {
    -webkit-text-stroke: 0.08em white;
  }
</style>
