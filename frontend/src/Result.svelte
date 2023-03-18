<script>
	
	//These values are populated by the data we get from the db
	export let item;  
    export let mfg;
	export let dc;
    export let quantity;
    export let condition;
    export let nsn;
	export let description; 

</script>

<tr>

    <td>
        {item}
    </td>

    <td>
        {mfg}
    </td>

    <td>
        {dc}
    </td>

    <td>
        {quantity}
    </td>


    <td>
        {condition}
    </td>

    <td>
        {nsn}
    </td>

    <td>
        {description}
    </td>

</tr>
