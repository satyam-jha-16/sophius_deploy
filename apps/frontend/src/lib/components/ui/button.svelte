<script lang="ts">
  export let disabled = false;
  export let className = '';
</script>

<button
  on:click
  {disabled}
  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed {className}"
>
  <slot />
</button>