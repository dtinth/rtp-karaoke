<script lang="ts">
  import ActiveLine from "./ActiveLine.svelte";
  import { sharedState } from "./doc";
  import LyricLine from "./LyricLine.svelte";
  import { mode, roomId } from "./params";

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
    if (t == "") return [""];
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

  const generateDefaultRoomId = () => {
    return "rtpk-" + (Date.now() + Math.random());
  };

  const getViewUrl = () => {
    const url = new URL(location.href);
    url.searchParams.set("mode", "view");
    return url.toString();
  };

  const normalize = (lines: string[]) => {
    if (lines.length === 1 && lines[0] === "") {
      return [];
    }
    return lines;
  };

  $: lines = normalize(text.split("\n").flatMap(splitLine));
</script>

<main style="font-family:Chulabhorn Likit Display">
  {#if !roomId}
    <form action="" class="p-4">
      <h1>Set a unique room ID</h1>
      <input
        name="room_id"
        value={generateDefaultRoomId()}
        class="rounded border border-gray-200"
        size="32"
      />
      <input
        type="submit"
        class="rounded border border-gray-200 bg-gray-200 px-4"
        value="Enter room"
      />
    </form>
  {:else if mode === "edit"}
    {#if editText != null}
      <div class="fixed top-0 right-0 w-16">
        <button
          class="block w-full py-4"
          on:click={() => (
            sharedState.set("text", editText), (editText = null)
          )}
        >
          💾
        </button>
        <button class="block w-full py-4" on:click={() => (editText = null)}>
          🗑
        </button>
      </div>
      <div class="mr-16 p-4">
        <h2>Edit lyrics</h2>
        <textarea
          class="rounded border border-gray-200"
          bind:value={editText}
          cols="100"
          rows="16"
        />
      </div>
    {:else}
      <div class="fixed top-0 right-0 w-16">
        <button class="block w-full py-4" on:click={() => (editText = text)}>
          ✏️
        </button>
        <button
          class="block w-full py-4"
          on:click={() => sharedState.set("active", null)}
        >
          ❌
        </button>
      </div>
      <div class="mr-16 border-r text-white bg-black">
        <div class="p-4 bg-gray-800">
          OBS URL:
          {getViewUrl()}
        </div>
        {#each lines as line, index}
          <div>
            {#if line == ""}
              &nbsp;
            {:else}
              <LyricLine
                text={line}
                active={active &&
                  active.index === index &&
                  active.line === line}
                progress={active &&
                active.index === index &&
                active.line === line
                  ? active.progress
                  : undefined}
                on:progress={(e) => setProgress(line, index, e.detail)}
              />
            {/if}
          </div>
        {/each}
        {#if lines.length === 0}
          <div class="p-4 text-center text-gray-400">
            <h2 class="text-3xl">No lyrics.</h2>
            <p>Click the edit button to add lyrics.</p>
          </div>
        {/if}
      </div>
    {/if}
  {:else if active}
    <div class="absolute inset-x-0 bottom-0">
      <ActiveLine {active} />
    </div>
  {/if}
</main>

<style>
</style>
