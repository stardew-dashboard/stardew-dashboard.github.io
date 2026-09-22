$(function () {
    // Load all animal items and set up interactivity
    function loadItems() {
        fetch('./assets/scripts/stardew_valley-animals.json')
            .then(response => response.json())
            .then(data => data.forEach(item => {
                let itemName = (item.item).replace('_', ' ');
                let itemLabel = $('<p></p>').text(itemName);
                let itemImg = $('<img>')
                    .attr({
                        "src": `./assets/icons/animals/${item.item}.png`,
                        "alt": item.item
                    });

                let newItem = $('<div></div>').prepend(itemLabel, itemImg)
                    .attr({
                        "class": 'item',
                        "item-name": item.item,
                        "enclosure": item.building
                    });

                $('#buildings #' + item.building).append(newItem);

                // Set default
                if (item.item === "white chicken") {
                    $(newItem).trigger("click");
                }
            }));
    }

    // Update the animal details panel when an item is clicked
    function setAnimal(clicked) {
        const name = $(clicked).attr("item-name");

        $('.item').removeClass('active');
        $(clicked).addClass('active');

        fetch('./assets/scripts/stardew_valley-animals.json')
            .then(response => response.json())
            .then(data => {
                let animal = data.find(item => item.item === name);
                if (!animal) return;

                // Reset classes
                $('.not-applicable').removeClass('not-applicable');

                // Basic info
                $('#quick-look img').attr({
                    "src": './assets/icons/animals/' + animal.item + '.png',
                    "alt": animal.item
                });
                $('#quick-look .name').text(animal.item);
                $('#quick-look .building').text(animal.building);
                $('#quick-look .machine').text(animal.machine);
                $('#quick-look .type').text(animal.product);

                $('#standard .base-price').text(animal.base_price);
                $('#standard .silver-price').text(animal.base_silver);
                $('#standard .gold-price').text(animal.base_gold);
                $('#standard .iridium-price').text(animal.base_iridium);

                // Processed goods — machines
                $('#processed .product').text(animal.processed);
                $('#processed .base-price').text(animal.processed_price);
                $('#processed .silver-price').text(animal.processed_price_silver || 'N/A');
                $('#processed .gold-price').text(animal.processed_price_gold|| 'N/A');
                $('#processed .iridium-price').text(animal.processed_price_iridium|| 'N/A');

                // Product type 2
                $('#other .product').text(animal.product2 || 'Only produces ' + animal.product);
                $('#other .base-price').text(animal.product2_base || 'N/A');
                $('#other .silver-price').text(animal.product2_silver || 'N/A');
                $('#other .gold-price').text(animal.product2_gold || 'N/A');
                $('#other .iridium-price').text(animal.product2_iridium || 'N/A');

                if (!animal.product2) {
                    $('#quick-look #other').addClass('not-applicable');
                }

                // Gray out unavailable prices
                $('.prices span').each(function () {
                    if ($(this).text() === 'N/A') {
                        $(this).parent().addClass('not-applicable');
                    }
                });

                // update graphs
                const animalSelect = document.querySelector('#observablehq-viewof-selectAnimal-8d6d248f select');
                if (animalSelect) {
                    for (let option of animalSelect.options) {
                        if (option.text === animal.item) {
                            animalSelect.value = option.value;
                            animalSelect.dispatchEvent(new Event('input', { bubbles: true }));
                            break;
                        }
                    }
                }

                const currentBuilding = $(clicked).attr("enclosure");
                const buildingSelect = document.querySelector('#observablehq-viewof-selectBuilding-8d6d248f select');
                if (buildingSelect) {
                    for (let option of buildingSelect.options) {
                        if (option.text === currentBuilding) {
                            buildingSelect.value = option.value;
                            buildingSelect.dispatchEvent(new Event('input', { bubbles: true }));
                            break;
                        }
                    }
                }

                $('.plot-d6a7b5').addClass("hello");
            });
    }

    // Initialize page
    loadItems();

    // Event delegation for animal item clicks
    $('#buildings').on('click', '.item', function () {
        setAnimal(this);
    });
});
