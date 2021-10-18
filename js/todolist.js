const input = document.querySelector("input[type='text']")
const addBtn = document.querySelector('#addBtn')

const tabBtn = document.querySelector('#tabBtn')
const toDoList = document.querySelector('#toDoList')

const unDoneText = document.querySelector('#unDoneText')
const removeAllBtn = document.querySelector('#removeAllBtn')

let listArray = []
let filterListArray = []
let condition = '全部'

addBtn.addEventListener('click', addTodo)

input.addEventListener('keyup', (e) => {
    e.key === 'Enter' ? addTodo() : false
})

tabBtn.addEventListener('click', (e) => {
    Array.from(tabBtn.children).forEach(item => {
        if (e.target === item) {
            e.target.classList.add('border-gray-800')
            e.target.classList.add('text-gray-800')
        } else {
            item.classList.remove('border-gray-800')
            item.classList.remove('text-gray-800')
        }
    })
    condition = e.target.textContent.trim()
    getListArray()
})

removeAllBtn.addEventListener('click', (e) => {
    listArray = listArray.filter(item => !item.isdone)
    window.localStorage.setItem('todo', JSON.stringify(listArray))
    getListArray()
})


getListArray()

function getListArray() {
    listArray = JSON.parse(window.localStorage.getItem('todo')) || []

    condition === '全部' ? filterListArray = listArray :
        condition === '待完成' ? filterListArray = listArray.filter(item => !item.isdone) :
            condition === '已完成' ? filterListArray = listArray.filter(item => item.isdone) : false

    listArray.length !== 0 ? toDoList.classList.remove('hidden') : toDoList.classList.add('hidden')

    render()

    const unDones = listArray.filter(item => !item.isdone).length
    unDoneText.textContent = `${unDones} 個待完成項目`
}

function addTodo() {
    if (input.value === '') {
        alert('請輸入代辦事項!!')
        return
    }

    const id = new Date().getTime()

    listArray.push({
        id,
        todo: input.value.trim(),
        isdone: false
    })

    window.localStorage.setItem('todo', JSON.stringify(listArray))
    input.value = ''
    getListArray()
}

function render() {
    const list = document.querySelector('#list')
    let str = ''
    filterListArray.forEach(item => {
        str += ` <label class="py-2 flex items-center w-full cursor-pointer relative ">
        <input type="checkbox"
            data-id="${item.id}"
            class="w-6 h-6 border-2  relative transition-all duration-300 flag-1 checked:scale-0 ">
        <svg xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-yellow-600 absolute top-5 -left-1 transition-all duration-300 scale-0 flag-1-checked:scale-100"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="border-b py-4 w-full ml-4 flag-1-checked:line-through flag-1-checked:text-gray-400">
            ${item.todo}</p>
        <button type="button"
            class="text-gray-400 transition-all duration-300 scale-0 flag-1-hover:scale-100 hover:text-gray-300 h-8 w-8 removeBtn">
            <svg xmlns="http://www.w3.org/2000/svg"   data-id="${item.id}" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" data-id="${item.id}" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </label>`
    })
    list.innerHTML = str

    const checkboxs = document.querySelectorAll("input[type='checkbox']")
    const removeBtns = document.querySelectorAll('.removeBtn')
    check(checkboxs)
    remove(removeBtns)

}

function check(checkboxs) {
    checkboxs.forEach((item, index) => {
        item.checked = filterListArray[index].isdone
        item.addEventListener('click', (e) => {
            listArray.forEach((item, index) => {
                if (item.id === +e.target.dataset.id) {
                    listArray[index].isdone = e.target.checked
                    window.localStorage.setItem('todo', JSON.stringify(listArray))
                    getListArray()
                }
            })
        })
    })
}

function remove(removeBtns) {
    removeBtns.forEach(item => {
        item.addEventListener('click', (e) => {
            listArray.forEach((item, index) => {
                if (item.id === +e.target.dataset.id) {
                    listArray.splice(index, 1)
                    window.localStorage.setItem('todo', JSON.stringify(listArray))
                    getListArray()
                }
            })
        })
    })
}
