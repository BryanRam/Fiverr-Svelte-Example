<script>
	export let waitForAPI; //Export this var so it can be manipulated in App.svelte. With this we determine what message is shown to the user
</script>

<section>	
	<div class="no-results-msg">
		{#if waitForAPI}
			<p><strong>Loading...</strong></p>
		{:else}
		
			<p><strong>No results.</strong> Try again!</p>
		{/if}
	</div>
</section>

<style>
	section {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.no-results-msg {
		width: 70%;
		padding: 20px;
		font-size: 2rem;
		text-align: center;
		background-color: hsl(19, 66%, 74%);
		border-left: 6px solid #BA5626;
	}
</style>