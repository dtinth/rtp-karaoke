<script lang="ts">
  import ActiveLine from "./ActiveLine.svelte";
  import { sharedState } from "./doc";
  import LyricLine from "./LyricLine.svelte";
  import { mode } from "./params";

  let text = sharedState.get("text") || "";
  let editText = null;
  let lines = [];

  let active = sharedState.get("active");

  sharedState.observe(() => {
    text = sharedState.get("text") || "";
    active = sharedState.get("active");
  });

  function setProgress(line: string, index: number, progress: number) {
    sharedState.set("active", { line, index, progress });
  }

  function splitLine(t: string) {
    t = t.trim();
    if (t == "") return [];
    const desiredLength = 24;
    const count = Math.round(t.length / desiredLength);
    if (count <= 1) {
      return [t];
    }
    const words = t.split(/\s+/);
    const result = [];
    let line: string[] = [];
    let currentLength = 0;
    const eachLineLength = t.length / count;
    for (const [i, word] of words.entries()) {
      line.push(word);
      currentLength += word.length + 1;
      const add = (words[i + 1] || "").length * 0.5;
      if (currentLength + add >= eachLineLength * (1 + result.length)) {
        result.push(line.join(" "));
        line = [];
      }
    }
    if (line.length > 0) {
      result.push(line.join(" "));
    }
    return result;
  }

  $: lines = text.split("\n").flatMap(splitLine);
</script>

<main style="font-family:Chulabhorn Likit Display">
  {#if mode === "edit"}
    {#if editText != null}
      <textarea bind:value={editText} cols="100" rows="10" />
      <button
        on:click={() => (sharedState.set("text", editText), (editText = null))}
        >Save</button
      >
    {:else}
      <button on:click={() => (editText = text)}>Edit</button>
      <div class="mr-16 border-r text-white bg-black">
        {#each lines as line, index}
          <div>
            <LyricLine
              text={line}
              active={active && active.index === index && active.line === line}
              progress={active && active.index === index && active.line === line
                ? active.progress
                : undefined}
              on:progress={(e) => setProgress(line, index, e.detail)}
            />
          </div>
        {/each}
      </div>
      <button on:click={() => sharedState.set("active", null)}>Clear</button>
    {/if}
  {:else if active}
    <div class="absolute inset-x-0 bottom-0">
      <ActiveLine {active} />
    </div>
  {/if}
</main>

<style>
</style>
