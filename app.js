//Storage Controller
const StorageCtrl = (function () {


    //Public Methods
    return {
        storeItem: function (item) {
            let items

            //Check to see if any items? 
            if (localStorage.getItem('items') === null) {
                items = []
                //Push new item
                items.push(item)

                //Set ls
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                //Get what is already in ls
                items = JSON.parse(localStorage.getItem('items'))

                //Push new item
                items.push(item)

                //Reset ls
                localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },

        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },

        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(items))
        },

        clearItemsFromStorage: function () {
            localStorage.removeItem('items')
        }

    }
})()



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
        // items: [
        //     //     {
        //     //     id: 0,
        //     //     name: 'Steak Dinner',
        //     //     calories: '1200'
        //     // }, {
        //     //     id: 1,
        //     //     name: 'Chicken ala King',
        //     //     calories: '1500'
        //     // }, {
        //     //     id: 2,
        //     //     name: 'Apple',
        //     //     calories: '100'
        //     // }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
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

        updateItem: function (name, calories) {
            //Calories to number
            calories = parseInt(calories);

            let found = null

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories
                    found = item
                }
            })
            return found
        },

        deleteItem: function (id) {
            //Get the id's 
            const ids = data.items.map(function (item) {
                return item.id
            })

            // Get index 
            const index = ids.indexOf(id)

            //Remove item 
            data.items.splice(index, 1)
        },

        clearAllItems: function () {
            data.items = []
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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

        updateListItem: function (item) {

            //this grabs the UI Node list 
            let listItems = document.querySelectorAll(UISelectors.listItems)

            //Turn the Node list into an array
            listItems = Array.from(listItems)

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id')

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                }
            })
        },

        deleteListItem: function (id) {
            const itemID = `#item-${id}`
            const item = document.querySelector(itemID)
            item.remove()
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

        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn node list into array

            listItems = Array.from(listItems)

            listItems.forEach(function (item) {
                item.remove()
            })
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
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    //Load Event Listeners
    const loadEventListeners = function () {
        //Importing the UI selectors Obj
        const UISelectors = UICtrl.getSelectors()

        //Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        //Disable submit on return key
        document.addEventListener('keypress', function (e) {
            //if return key was hit
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        //Edit Icon Click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        //Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

        //Clear item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
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


            //Store in localStorage
            StorageCtrl.storeItem(newItem)

            //Clear fields
            UICtrl.clearInput()
        }

        e.preventDefault()
    }

    //Click edit item
    const itemEditClick = function (e) {
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

    //Update item submit

    const itemUpdateSubmit = function (e) {
        //Get item input
        const input = UICtrl.getItemInput()

        //Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        //Update UI
        UICtrl.updateListItem(updatedItem)

        //Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories)

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault
    }

    //Delete button event

    const itemDeleteSubmit = function (e) {
        //Get Current Item

        const currentItem = ItemCtrl.getCurrentItem()

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id)

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id)

        //Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories)

        //Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState()

        e.preventDefault()
    }


    const clearAllItemsClick = function () {
        // Delete all items from data structure
        ItemCtrl.clearAllItems()

        //Get the total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories)

        //Remove from UI
        UICtrl.removeItems()

        //Clear from ls

        StorageCtrl.clearItemsFromStorage()
        //Hide the Ul

        UICtrl.hideList()
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

})(ItemCtrl, StorageCtrl, UICtrl)





// Init App
App.init()