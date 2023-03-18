<script> //script tag
	import { onMount } from 'svelte';  //imports svelte component into app
	import Search from './Search.svelte'; //Search Bar
	import Result from './Result.svelte'; //A product row in the table of results
	import NoResults from './NoResults.svelte'; //A message that will either show "Loading" or "No Results!"
	
	//URL to get API Requests from. Change this to reflect the URL you use for API requests
	const apiURL = "http://localhost:3002";


	let pageLimit = 1;
	
	let defaultResults = []; //Where we store query results
	let isSearching = false; //boolean to check search
	let apiRes = false; //boolean to check response from API
	let pageCountRes = false; //boolean to check if we got back a number when counting records
	let pageNum = 1; //variable to show page number
	
	
	//Variable for Search Input
	let searchTerm = "";

	//Converts the number of rows we get back from the sql query into page numbers
	function convertPageLimitToInt(pgCount){
		//20 items per page, also make sure the number is an int so we don't get decimals
		let intCount = parseInt(pgCount/20);
		if (pgCount % 20 > 0) //If there is a remainder then there is an extra page with less than 20 items, so add that to the count
			pageLimit = intCount + 1;
		else
			pageLimit = intCount;
		
	}
	
	//Function that gets called when first initialising the page
	onMount(async () => {
		apiRes = true;
		fetch(apiURL + "/firstrecords") //Call the API request for the first 20 records
		.then(response => response.json())
		.then(data => {
			
			getDefaultResults(data); //store it in defaultResults
			apiRes=false;
		}).catch(error => {
			console.log(error);
			return [];
		});

		fetch(apiURL + "/total") //Call the API request for number of records in the database
		.then(response => response.json())
		.then(data => {
			let count =	parseInt(data[0]["count"]);

			pageLimit = count/20;
			convertPageLimitToInt(count);
			
			console.log("PageLimit");
			console.log(pageLimit);

			
		})


	});


	//Function for getting results from the search bar
	const getSearchResults = (term) => {
		apiRes = true;
		pageNum = 1;
		defaultResults = [];
		if(term === "")
		{
			fetch(apiURL + "/firstrecords") //Call API Request for first 20 records when there's no search term
			.then(response => response.json())
			.then(data => {
				
				getDefaultResults(data);
				//getTypes();
				apiRes=false;
			}).catch(error => {
				console.log(error);
				return [];
			});

			pageCountRes = false;

			fetch(apiURL + "/total")
			.then(response => response.json())
			.then(data => {
				let count =	parseInt(data[0]["count"]);

				pageLimit = count/20;

				convertPageLimitToInt(count);

				console.log("PageLimit");
				console.log(pageLimit);

				pageCountRes = true;
			});

		}
		else{
			isSearching = true;
			fetch(apiURL + "/search/" + term + "/" + pageNum) //Call API Request for searching for a term, with offset included as a page number
			.then(response => response.json())
			.then(data => {
				getDefaultResults(data);
				apiRes = false;
				
			}).catch(error => {
				console.log(error);
				return [];
			});

			pageCountRes = false;

			fetch(apiURL + "/searchtotal/" + searchTerm) //Get number of records for that search term
			.then(response => response.json())
			.then(data => {
				let count =	parseInt(data[0]["count"]);

				pageLimit = count/20;
				
				convertPageLimitToInt(count);

				console.log("PageLimit");
				console.log(pageLimit);

				pageCountRes = true;
			});
		}

		
	}
	
	const getDefaultResults = (obj) => {
		console.log("default results");
		console.log(obj);
		defaultResults = obj;	
		
		if(defaultResults.length === 0) //In a scenario where there's no items, just set pageNum to 1
		{
			pageNum = 1;
		}
	}


	//Function for manipulating page Number
	const decrementNum = () =>{
		if(pageNum > 1)
		{
			pageNum--;
			nextPage(pageNum);
		}
	}

	//Function for manipulating page Number
	const incrementNum = () => {
		if(pageNum < pageLimit)
		{
			pageNum++;
			nextPage(pageNum);
		}
		
	}

	//Run queries when going to specific page
	const nextPage = (num) => {
		apiRes = true;
		defaultResults = [];
		//Whether it is a search or not, use num variable to offset the results we get from the db
		//searchTerm would be set outside this function thanks to getSearchResults, and in situations where it is not, the else condition would apply
		if(searchTerm.length > 0)
		{
			fetch(apiURL + "/search/" + searchTerm + "/" + num)
			.then(response => response.json())
			.then(data => {
				getDefaultResults(data);
				apiRes = false;
			}).catch(error => {
				console.log(error);
				return [];
			});

			
		}
		else
		{
			fetch(apiURL + "/page/" + num)
			.then(response => response.json())
			.then(data => {
				getDefaultResults(data);
				apiRes=false;
			}).catch(error => {
				console.log(error);
				return [];
			});
		}
	}

	//Clear the searchTerm variable, which would also run a query in getSearchResults
	const cancelSearch = () => {
		searchTerm = "";
		isSearching = false;
		getSearchResults(searchTerm);
	}

	
	
	
</script>

<section>
	<h1 style="font-size: 2em;">
		Inventory Search
	</h1>
</section>

<!-- Section for the search -->
<section class="query-section">
	<Search bind:searchTerm {getSearchResults}/>
</section>	

<main>
	<div style="margin-bottom:2rem;display:flex;justify-content:space-around;">
		<div>
			<button class="page-button" on:click={decrementNum}>Previous Page</button>
		</div>
		
		<div style="display:flex; align-items:center; gap:1.5rem;">
			{#if (searchTerm.length > 0 && isSearching)}
			<button class="search-button" on:click={cancelSearch}>
			{searchTerm} X
			</button>
			{/if}

			<div>
				<strong>{pageNum}/{parseInt(pageLimit)}</strong>
		   </div>
		</div>
		

		
		<div>
			<button class="page-button" on:click={incrementNum}>Next Page</button>
		</div>
	</div>
	
	<table id="search-results">
		<thead>
			<tr>
				<th>Item</th>
				<th>MFG</th>
				<th>DC</th>
				<th>Quantity On Hand</th>
				<th>Condition</th>
				<th>NSN</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
		
		<!-- Show no results if page count is 0. We check page count as a query for row count is faster than querying for data-->
		{#if (pageLimit === 0) && (pageCountRes)}		
			<tr>
				<NoResults waitForAPI={false}/>
			</tr>
			
		{:else if (apiRes)} 
		<!-- Show a loading message if there's expected results that haven't loaded in yet-->
			<tr>
				<NoResults waitForAPI={apiRes}/>
			</tr>
				
	
		<!--We will have the data from query stored in defaultResults, so this check is valid-->
		{:else if defaultResults.length > 0}
			{#each defaultResults as res}
			<!-- Display results -->
				<Result item = {res["Item"]} 
				mfg={res["MFG"]} 
				dc={res["D/C"]}
				quantity={res["Quantity On Hand"]}
				condition={res["CONDITION"]}
				nsn={res["NSN"]}
				description={res["Description"]}/>
			{/each}
		{/if}		
		</tbody>
	</table>

	<div style="margin-top:2rem;display:flex;justify-content:space-around;">
		<div>
			<button class="page-button" on:click={decrementNum}>Previous Page</button>
		</div>

		<div style="display:flex; align-items:center; gap:1.5rem;">
			{#if (searchTerm.length > 0 && isSearching)}
			<button class="search-button" on:click={cancelSearch}>
			{searchTerm} X
			</button>
			{/if}

			<div>
				<strong>{pageNum}/{parseInt(pageLimit)}</strong>
		   </div>
		</div>

		<div>
			<button class="page-button" on:click={incrementNum}>Next Page</button>
		</div>
	</div>
	

	

</main>	


<style>
	* {
		box-sizing: border-box;
	}
	
	.spacer{
		margin-top:1.5em;
		margin-bottom: 1.5em;
	}
	
	.query-section {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2% 0;
	}
	
	/* General Structure */
	.wineshelf {
		width: 100%;
		margin: 10px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center; 
	}
</style>