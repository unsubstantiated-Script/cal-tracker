//Storage Controller

//Item Controller
const ItemCtrl = (function () {

    //Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }



    //Data Structure / State
    const data = {
        items: [{
            id: 0,
            name: 'Steak Dinner',
            calories: '1200'
        }, {
            id: 1,
            name: 'Chicken ala King',
            calories: '1500'
        }, {
            id: 2,
            name: 'Apple',
            calories: '100'
        }],
        currentItem: null,
        totalCalories: 0
    }

    //Public Methods
    return {
        getItems: function () {
            return data.items
        },
        addItem: function (name, calories) {
            let ID
            //Create ID that inciments
            if (data.items.length > 0) {
                //This logic counts the items in the array and subtracts 1 because the array index is zero based. It then adds that one back on to the actual id #
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0;
            }
            //Calorie to number
            calories = parseInt(calories);


            // Create new item
            newItem = new Item(ID, name, calories)

            //Add to items array
            data.items.push(newItem)
            return newItem
        },

        logData: function () {
            return data
        }
    }
})()




//UI Controller
const UICtrl = (function () {

    //Object to hold the UI elements
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',

    }


    //Public Methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="fa fa-pencil"></i></a>
            </li>`
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },

        getSelectors: function () {
            return UISelectors
        }
    }
})()



//App Controller
const App = (function (ItemCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function () {
        //Importing the UI selectors Obj
        const UISelectors = UICtrl.getSelectors()

        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    }

    // Add item submit
    const itemAddSubmit = function (e) {

        //Get Form Input from UI Controller
        const input = UICtrl.getItemInput()

        //Check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            //Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories)
        }

        e.preventDefault()
    }


    //Public methods
    return {
        init: function () {
            console.log("Init App...")

            //Fetch items from data structure and storing them in a usable variable
            const items = ItemCtrl.getItems()


            //Populate list with items
            UICtrl.populateItemList(items);

            //Load event listeners
            loadEventListeners()
        }
    }

})(ItemCtrl, UICtrl)





// Init App
App.init()