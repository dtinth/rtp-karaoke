<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let text;
  export let active = false;
  export let progress = 0;

  let down;
  let textElement;

  const dispatch = createEventDispatcher();

  function update(x: number) {
    const rect = textElement.getBoundingClientRect();
    const progress = (x - rect.left) / rect.width;
    console.log(progress);
    dispatch("progress", progress);
  }
  function mousedown(e: MouseEvent) {
    down = true;
    e.preventDefault();
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }
  function mousemove(e: MouseEvent) {
    if (down) {
      update(e.clientX);
      e.preventDefault();
    }
  }
  function mouseup(e: MouseEvent) {
    down = false;
    e.preventDefault();
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
  }
  function touchmove(e: TouchEvent) {
    if (e.touches.length === 1) {
      update(e.touches[0].clientX);
    }
    e.preventDefault();
  }
  function check() {
    const rect = textElement.getBoundingClientRect();
    const y = innerHeight - 128;
    if (rect.bottom > y) {
      scrollBy(0, rect.bottom - y);
    }
  }
</script>

<div
  class="overflow-hidden text-center py-2"
  on:mousedown={mousedown}
  on:touchstart={(e) => (check(), e.preventDefault())}
  on:touchmove={touchmove}
  on:touchend={(e) => e.preventDefault()}
  class:bg-gray-800={active}
>
  <div class="whitespace-nowrap inline-block relative" bind:this={textElement}>
    {#if active}
      <div
        class="absolute top-0 left-0 bottom-0 bg-blue-800"
        style="width:{progress * 100}%"
      />
    {/if}
    <div class="relative">
      {text}
    </div>
  </div>
</div>
