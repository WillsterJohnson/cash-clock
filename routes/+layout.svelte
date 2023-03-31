<script lang="ts">
  const agentHas = (keyword: string) =>
    navigator.userAgent.toLowerCase().search(keyword.toLowerCase()) > -1;
  const isFireFox = agentHas("Firefox") || agentHas("FxiOS") || agentHas("Focus");
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="{window.location.protocol}//{window.location.host}/colors{isFireFox ? '' : '-hsl'}.css"
  />
</svelte:head>
<slot />

<style lang="scss">
</style>
