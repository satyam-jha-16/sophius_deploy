<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import axios from "axios";
  //   import { Github } from "lucide-svelte";
  import "@fontsource/fira-code";
  import Button from "$lib/components/ui/button.svelte";
  import Input from "$lib/components/ui/input.svelte";

  let repoURL = "";
  let logs: string[] = [];
  let loading = false;
  let projectId: string | undefined;
  let deployPreviewURL: string | undefined;
  let logContainerRef: HTMLDivElement;
  let socket: any;

  $: isValidURL = validateURL(repoURL);

  function validateURL(url: string): [boolean, string | null] {
    if (!url || url.trim() === "") return [false, null];
    const regex = new RegExp(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
    );
    return [regex.test(url), "Enter valid Github Repository URL"];
  }

  async function handleClickDeploy() {
    loading = true;

    try {
      const { data } = await axios.post(`http://localhost:9000/project`, {
        gitURL: repoURL,
        slug: projectId,
      });

      if (data && data.data) {
        const { projectSlug, url } = data.data;
        projectId = projectSlug;
        deployPreviewURL = url;

        console.log(`Subscribing to logs:${projectSlug}`);
        socket.emit("subscribe", `logs:${projectSlug}`);
      }
    } catch (error) {
      console.error("Deployment error:", error);
    }
  }

  function scrollToBottom() {
    if (logContainerRef) {
      logContainerRef.scrollTop = logContainerRef.scrollHeight;
    }
  }

  function handleSocketIncomingMessage(message: string) {
    console.log(`[Incoming Socket Message]:`, typeof message, message);
    const { log } = JSON.parse(message);
    logs = [...logs, log];
    setTimeout(scrollToBottom, 0);
  }

  onMount(() => {
    socket = io("http://localhost:9000");
    socket.on("message", handleSocketIncomingMessage);

    return () => {
      socket.off("message", handleSocketIncomingMessage);
      socket.disconnect();
    };
  });
</script>

<main class="flex justify-center items-center h-[100vh]">
  <div class="w-[600px]">
    <span class="flex justify-start items-center gap-2">
      <!-- <Github class="text-5xl" /> -->
      <Input
        disabled={loading}
        value={repoURL}
        on:input={(e) => (repoURL = (e.target as HTMLInputElement).value)}
        type="url"
        placeholder="Github URL"
      />
    </span>
    <Button
      on:click={handleClickDeploy}
      disabled={!isValidURL[0] || loading}
      className="w-full mt-3"
    >
      {loading ? "In Progress" : "Deploy"}
    </Button>
    {#if deployPreviewURL}
      <div class="mt-2 bg-slate-900 py-4 px-2 rounded-lg">
        <p>
          Preview URL
          <a
            target="_blank"
            class="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg"
            href={deployPreviewURL}
          >
            {deployPreviewURL}
          </a>
        </p>
      </div>
    {/if}
    {#if logs.length > 0}
      <div
        bind:this={logContainerRef}
        class="font-fira-code text-sm text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto"
      >
        <pre class="flex flex-col gap-1">
          {#each logs as log}
            <code>> {log}</code>
          {/each}
        </pre>
      </div>
    {/if}
  </div>
</main>

<style>
  :global(.font-fira-code) {
    font-family: "Fira Code", monospace;
  }
</style>
