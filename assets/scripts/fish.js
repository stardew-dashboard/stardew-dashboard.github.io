$(function(){
    // Load JSON database and create DOM element for each
    function loadItems() {
        fetch('./assets/scripts/stardew_valley-fish.json')
            .then(response => response.json())
            .then(data => data.forEach(item => {
                //alphabetical order of fish
                data.sort((a, b) => a.item.localeCompare(b.item));

                let itemName = (item.item).replace('_',' ');
                let itemLabel = $('<p></p>').text(itemName);
                let itemImg = $('<img>')
                    .attr({
                        "src": `./assets/icons/fish/${item.item}.png`,
                        "alt": item.item
                    });

                let newItem = $('<div></div>').prepend(itemLabel, itemImg)
                    .attr({
                        "class": 'item',
                        "item-name": item.item,
                        "season" : item.season
                    });

                $('#seasons #' + item.season).append(newItem);

                // Set default
                if (item.item === "sturgeon") {
                    $(newItem).trigger("click");
                }
            }));
    }

    // Change page according to selected fish item clicked
    function setFish(clicked) {
        const name = $(clicked).attr("item-name");

        $('.item').removeClass('active');
        $(clicked).addClass('active');

        fetch('./assets/scripts/stardew_valley-fish.json')
            .then(response => response.json())
            .then(data => {
                let fish = data.find(item => item.item === name);
                if (!fish) return;
            
                // Reset classes
                $('.not-applicable').removeClass('not-applicable');

                // Basic info
                $('#quick-look img').attr({
                    "src": './assets/icons/fish/' + fish.item + '.png',
                    "alt": fish.item
                });
                $('#quick-look .name').text(fish.item);
                $('#quick-look .type').text(fish.type);
                $('#quick-look .location').text(fish.location || '');

                $('#quick-look #standard .base-price').text(fish.base_price);
                $('#quick-look #standard .silver-price').text(fish.base_price_silver || 'N/A');
                $('#quick-look #standard .gold-price').text(fish.base_price_gold || 'N/A');
                $('#quick-look #standard .iridium-price').text(fish.base_price_iridium || 'N/A');


                // Load text for fish smoker products
                $('#quick-look #smoker .product').text('Smoked ' + fish.item);
                $('#quick-look #smoker .base-price').text(fish.smoked_base_price || 'N/A');
                $('#quick-look #smoker .silver-price').text(fish.smoked_base_price_silver|| 'N/A');
                $('#quick-look #smoker .gold-price').text(fish.smoked_base_price_gold || 'N/A');
                $('#quick-look #smoker .iridium-price').text(fish.smoked_base_price_iridium || 'N/A');

                // Load text for preserves jar products (roe)
                let roetext = '';
                if(fish.roe){
                    roetext = "Roe";
                    $('#quick-look #preserves').removeClass('not-applicable');
                }
                else {
                    roetext = "Does not make roe";
                    $('#quick-look #preserves').addClass('not-applicable');
                }
            
                $('#quick-look #preserves .product').text(roetext);
                $('#quick-look #preserves .roe-price').text(fish.roe || 'N/A');
                $('#quick-look #preserves .aged-roe').text(fish.aged_roe || 'N/A');
            
                // Gray out others
                $('.prices span').each( function(){
                    if( $(this).text() == 'N/A'){
                        $(this).parent().addClass('not-applicable');
                    }
                });
                    
         
                // Update plots
                const fishSelect = document.querySelector('#observablehq-viewof-selectFish-89f562c7 select');
                if (fishSelect) {
                    for (let option of fishSelect.options) {
                        if (option.text === fish.item) {
                            fishSelect.value = option.value;
                            fishSelect.dispatchEvent(new Event('input', { bubbles: true }));
                            break;
                        }
                    }
                }
            
                const currentSeason = $(clicked).attr("season");
                let order = 0;

                const seasonSelect = document.querySelector('#observablehq-viewof-selectSeason-89f562c7 select');
                if (seasonSelect) {
                    for (let option of seasonSelect.options) {
                        if (option.text === currentSeason) {
                            seasonSelect.value = option.value;
                            seasonSelect.dispatchEvent(new Event('input', { bubbles: true }));
                            break;
                        }
                    }
                } 
            
                $('.plot-d6a7b5').addClass("hello");    

        });
    }

    // Initial load
    loadItems();

    // On item click
    $('#seasons').on('click', '.item', function () {
        setFish(this);
    });
});
