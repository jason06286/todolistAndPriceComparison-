const searchInputDom = document.querySelector('#search')
const searchBtnDom = document.querySelector('#searchBtn')

const tbodyDom = document.querySelector('#tableList')
const categoryBtn = document.querySelector('#categoryBtn')
const sortSelectDoms = document.querySelectorAll('.sortSelect')
const sortTableBtns = document.querySelectorAll('.sortTableBtn')

const loadingDom = document.querySelector('#loading')

getData()

let data = []
let filterData = []
let category = ''
let sortCondition = ''
let order = true



async function getData() {
    const url = 'https://data.coa.gov.tw/Service/OpenData/FromM/FarmTransData.aspx'
    loadingDom.classList.remove('hidden')
    try {
        const res = await axios.get(url)
        data = res.data
        loadingDom.classList.add('hidden')
        filterCategory()
    } catch (error) {
        console.error(error);
    }
}

searchInputDom.addEventListener('keyup', (e) => {
    if (e.key !== 'Enter') return
    judgeSelectDom()
    judgeCategoryBtnClass()
    filterCropName()
})

searchBtnDom.addEventListener('click', (e) => {
    judgeSelectDom()
    judgeCategoryBtnClass()
    filterCropName()
})

categoryBtn.addEventListener('click', (e) => {
    judgeSelectDom()
    judgeCategoryBtnClass(e)
})

sortSelectDoms.forEach(item => {
    item.addEventListener('change', (e) => {
        window.innerWidth >= 768 ? sortCondition = sortSelectDoms[0].value : sortCondition = sortSelectDoms[1].value
        sortData()
    })
})

sortTableBtns.forEach(item => {
    item.addEventListener('click', (e) => {
        order = !order
        if (sortCondition !== item.dataset.sort) {
            sortCondition = item.dataset.sort
            order = true
        }
        sortData()
    })
})


function judgeSelectDom() {
    if (window.innerWidth >= 768) {
        sortSelectDoms[0].value = ''
        sortCondition = sortSelectDoms[0].value
    } else {
        sortSelectDoms[1].value = ''
        sortCondition = sortSelectDoms[1].value
    }
}

function judgeCategoryBtnClass(e = '') {
    Array.from(categoryBtn.children).forEach(item => {
        if (item === e.target) {
            item.classList.add('bg-yellow-300')
            category = e.target.dataset.type
            searchInputDom.value = ''
            filterCategory()
        } else {
            item.classList.remove('bg-yellow-300')
        }
    })
}

function filterCategory() {
    category === '' ? filterData = data : filterData = data.filter(item => item['種類代碼'] === category)
    sortData()
}

function filterCropName() {
    if (searchInputDom.value === '') return
    filterData = data.filter(item => {
        if (item['作物名稱'] === null) return false
        return item['作物名稱'].indexOf(searchInputDom.value) !== -1 ? true : false
    })
    sortData()
}

function sortData() {
    if (sortCondition !== '') {
        order ? filterData = filterData.sort((a, b) => a[sortCondition] - b[sortCondition]) : filterData = filterData.sort((a, b) => b[sortCondition] - a[sortCondition])
    }
    render()
}

function render() {
    let str = ''
    filterData.length === 0 ?
        str = `  <tr class="text-center border-b-2">
        <td colspan="7" class="px-4 py-3 ">查詢不到當日的交易資訊QQ</td>
    </tr>
        `
        : category === '' && searchInputDom.value === '' ?
            str = `  <tr class="text-center border-b-2" id="start">
        <td colspan="7" class="px-4 py-3 ">請輸入並搜尋想比價的作物名稱^＿^</td>
    </tr>
        `
            : filterData.forEach(item => {
                str += `  <tr class="text-center border-b-2">
            <td class="px-2 sm:px-4  py-3 font-semibold">${item['作物名稱']}</td>
            <td class="px-2 sm:px-4 py-3 font-semibold">${item['市場名稱']}</td>
            <td class="px-2 sm:px-4 py-3 font-light">${item['上價']}</td>
            <td class="px-2 sm:px-4 py-3 font-light">${item['中價']}</td>
            <td class="px-2 sm:px-4 py-3 font-light">${item['下價']}</td>
            <td class="px-2 sm:px-4 py-3 font-light">${item['平均價']}</td>
            <td class="px-2 sm:px-4 py-3 font-light">${item['交易量']}</td>
        </tr>`
            })
    tbodyDom.innerHTML = str
}

