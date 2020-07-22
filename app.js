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
        items: [
            //     {
            //     id: 0,
            //     name: 'Steak Dinner',
            //     calories: '1200'
            // }, {
            //     id: 1,
            //     name: 'Chicken ala King',
            //     calories: '1500'
            // }, {
            //     id: 2,
            //     name: 'Apple',
            //     calories: '100'
            // }
        ],
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
            //Create ID that increments
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

        getItemById: function (id) {
            let found = null;
            //Loop through the items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item
                }
            })
            return found
        },

        setCurrentItem: function (item) {
            data.currentItem = item
        },

        getCurrentItem: function () {
            return data.currentItem
        },


        getTotalCalories: function () {
            let total = 0

            //Loop through items to add cals
            data.items.forEach(function (item) {
                total += item.calories
            })

            //Set total cal in data structure
            data.totalCalories = total

            //Return total 
            return data.totalCalories
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
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'

    }


    //Public Methods
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class=" edit-item fa fa-pencil"></i></a>
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


        addListItem: function (item) {
            //Show the List

            document.querySelector(UISelectors.itemList).style.display = 'block'

            //Create li Element 
            const li = document.createElement('li')

            //Add the class
            li.className = 'collection-item'

            //Add ID
            li.id = `item-${item.id}`

            //Add HTML
            li.innerHTML = ` <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`

            //Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },

        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },

        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState();
        },

        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories

        },

        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },

        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
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

        //Edit Icon Click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)
    }

    // Add item submit
    const itemAddSubmit = function (e) {

        //Get Form Input from UI Controller
        const input = UICtrl.getItemInput()

        //Check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            //Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories)

            //Add new item to the UI List
            UICtrl.addListItem(newItem)

            //Get the total calories
            const totalCalories = ItemCtrl.getTotalCalories()

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories)

            //Clear fields
            UICtrl.clearInput()
        }

        e.preventDefault()
    }

    //Update item submit

    const itemUpdateSubmit = function (e) {
        if (e.target.classList.contains('edit-item')) {
            //Get list item id
            const listId = e.target.parentNode.parentNode.id

            //Break into an array 
            const listIdArray = listId.split('-');

            //Get the actual ID 
            const id = parseInt(listIdArray[1])

            //Get item 
            const itemToEdit = ItemCtrl.getItemById(id)

            //Set current item

            ItemCtrl.setCurrentItem(itemToEdit)

            //Add item to form

            UICtrl.addItemToForm()
        }
        e.preventDefault()
    }


    //Public methods
    return {
        init: function () {


            //Clear edit state/ set initial state

            UICtrl.clearEditState()

            console.log("Init App...")

            //Fetch items from data structure and storing them in a usable variable
            const items = ItemCtrl.getItems()

            //Check if any items? 
            if (items.length === 0) {
                UICtrl.hideList()
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);
            }

            //Get the total calories
            const totalCalories = ItemCtrl.getTotalCalories()

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories)

            //Load event listeners
            loadEventListeners()
        }
    }

})(ItemCtrl, UICtrl)





// Init App
App.init()