<script>
	export let searchTerm;
	export let getSearchResults;
</script>


<div>
	<input type="text" 
				 id="search-box" 
				 placeholder="Enter Search Term" 
				 autocomplete="off"
				 bind:value={searchTerm}
				 on:input />
	<button class="search-button" on:click={getSearchResults(searchTerm)}>Search</button>
</div> 


<style>
	#search-input-cont {
		width: 40%;
		display: flex;
		align-items: center;
		margin: 0 0 0 10px;
	}

	#search-field {
		width: 100%;
		font-size: 1.3rem;
		border: 1px solid gray;
		border-radius: 5px;
		padding: 8px;
		margin: 0 10px 0;
	}

</style>