<script>
  import { createEventDispatcher } from 'svelte'

  export let text = ''
  export let type = 'primary'
  export let size = 'medium'
  export let width
  export let icon
  export let href

  const dispatch = createEventDispatcher()

  function onClick(event) {
    dispatch('click', event)
  }
</script>

<style lang="postcss">
  .button {
    @apply rounded-sm transition transform duration-200 ease-out;
  }

  .button:focus {
    @apply outline-none shadow-outline;
  }

  /* Types */
  .primary {
    @apply button bg-blue-400;
  }

  .primary:hover {
    @apply bg-blue-500;
  }

  .outline {
    @apply button bg-transparent border border-gray-400;
  }

  .outline:hover {
    @apply bg-gray-200;
  }

  /* Sizes */
  .medium {
    @apply py-2 px-4;
  }

  /* Width */
  .full {
    @apply w-full;
  }
</style>

{#if href}
  <link {href} />
{:else}
  <button
    class="button"
    class:primary={type === 'primary'}
    class:outline={type === 'outline'}
    class:medium={size === 'medium'}
    class:small={size === 'small'}
    class:full={width === 'full'}
    on:click={onClick}>
    {#if icon}
      <span>{icon}</span>
    {/if}
    <span>{text}</span>
  </button>
{/if}
