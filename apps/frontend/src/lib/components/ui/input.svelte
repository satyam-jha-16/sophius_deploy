<script lang="ts">
  export let value: string;
  export let disabled = false;
  export let type = "text";
  export let placeholder = "";
</script>

<input
  {type}
  {placeholder}
  {disabled}
  {value}
  on:input
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>