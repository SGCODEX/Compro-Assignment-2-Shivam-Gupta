let mainBooks = [];
let allBooks = [];
const allgenres = new Set();
let selectedGenres = [];
let PN = 1;
let NR = 10;

document.addEventListener("DOMContentLoaded",main);

async function main(){
    console.log("Async/Await Js File being used....")
    let cachedBooks = localStorage.getItem("booksData");
    try {
        let books;
        if (cachedBooks) {
            console.log("Loaded from Local Storage");
            books = JSON.parse(cachedBooks);
        } else {
            console.log("Fetching from API...");
            let url = "https://raw.githubusercontent.com/chakshuujawa/json-hosting/refs/heads/main/books-v2.json";
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            books = data.map((book,index)=>({
                sno:index+1,
                ...book,
                lang:"English"
            }));
            localStorage.setItem("booksData", JSON.stringify(books));
        }
        if (!books || books.length === 0) {
            console.warn("No books available to display.");
            return;
        }
        allBooks = books;
        mainBooks = JSON.parse(JSON.stringify(allBooks));
    } catch(error) {
        console.error("Error loading book data:", error);
        alert("Failed to load books data.");
        return;
    }

    let minPrice = allBooks[0].price
    let maxPrice = allBooks[0].price
    let minYear = allBooks[0].publicationYear
    let maxYear = allBooks[0].publicationYear
    for (let book of allBooks){
        allgenres.add(book.genre);
    if (book.price < minPrice){minPrice = book.price};
    if (book.price > maxPrice){maxPrice = book.price};
    if (book.publicationYear < minYear){minYear = book.publicationYear};
    if (book.publicationYear > maxYear){maxYear = book.publicationYear};
    }
    document.getElementById("input-search-price-min").placeholder = `Price Min (eg - ${minPrice})`;
    document.getElementById("input-search-price-max").placeholder = `Price Max (eg - ${maxPrice})`;
    document.getElementById("input-search-year-from").placeholder = `Year From (eg - ${minYear})`;
    document.getElementById("input-search-year-to").placeholder = `Year To (eg - ${maxYear})`;

    document.getElementById("input-search-price-min").min = minPrice;
    document.getElementById("input-search-price-max").max = maxPrice;
    document.getElementById("input-search-year-from").min = minYear;
    document.getElementById("input-search-year-to").max = maxYear;

    console.log(allgenres)
    let datalist = document.getElementById("genre-options");
    allgenres.forEach(genre => {
        let option = document.createElement("option");
        option.value = genre;
        datalist.append(option);
        });

    pagination(allBooks)

    let bt = document.getElementById("btn-search");
    let bt1 = document.getElementById("btn-clear");
    let s1 = document.getElementById("btn-sort-pa");
    let s2 = document.getElementById("btn-sort-pd");
    let s3 = document.getElementById("btn-sort-ya");
    let s4 = document.getElementById("btn-sort-yd");
    let s5 = document.getElementById("btn-sort-de");
    let norows = document.getElementById("rows");
    let p_footer = document.getElementById("pagination");
    let tb = document.getElementById('table-all-books-body');
    let genreInput = document.getElementById("input-search-genre");
    let genreContainer = document.getElementById("genre-container");
    let themeBtn = document.getElementById("theme-toggle");

    genreInput.addEventListener("change", () => {

        let genre = genreInput.value.trim();

        if (!selectedGenres.includes(genre) && genre !== "") {

            selectedGenres.push(genre);

            let tag = document.createElement("span");
            tag.textContent = genre + " ✕";
            tag.style.marginRight = "6px";
            tag.style.background = "#007bff";
            tag.style.color = "white";
            tag.style.padding = "2px 6px";
            tag.style.cursor = "pointer";

            tag.addEventListener("click", () => {
                selectedGenres = selectedGenres.filter(g => g !== genre);
                tag.remove();
            });

            genreContainer.insertBefore(tag, genreInput);
        }

        genreInput.value = "";
    });
    // bt.onclick = search;
    bt.addEventListener("click",search);
    bt1.addEventListener("click",clear);
    s1.addEventListener("click",() => sort_func("price",0));
    s2.addEventListener("click",() => sort_func("price",1));
    s3.addEventListener("click",() => sort_func("publicationYear",0));
    s4.addEventListener("click",() => sort_func("publicationYear",1));
    s5.addEventListener("click",() => sort_func("sno",0));
    norows.addEventListener("change",() => pagination(allBooks))

    p_footer.addEventListener("click",(event) => {
        if (event.target.tagName === 'A') {
            console.log('You clicked: ' + event.target.textContent);
            event.preventDefault();
            let text = event.target.textContent;
            let totalPages = Math.ceil(allBooks.length / NR);
            if (text === "Previous") {
                PN--;
            }
            else if (text === "Next") {
                PN++;
            }
            else{
                PN = Number(event.target.textContent);
            }
            if (PN < 1) PN = 1;
            if (PN > totalPages) PN = totalPages;
            document.querySelectorAll("#pagination .page-item").forEach(el => el.classList.remove("active"));
            let pages = document.querySelectorAll("#pagination .page-item");
            pages.forEach(li => {
                if (li.textContent.trim() == PN) {
                    li.classList.add("active");
                }
            });
            //event.target.parentElement.classList.add("active");
            //PN = event.target.textContent;
            display(allBooks,((PN-1)*NR),PN*NR);
        }
    });
    tb.addEventListener("click",(event) => {
        let row = event.target.closest("tr");
        // row.log(closest)
        let cells = row.children;
        // console.log(cells)
        document.getElementById("sno").textContent = cells[0].textContent;
        document.getElementById("book-name").textContent = cells[1].textContent;
        document.getElementById("bookid").textContent = cells[2].textContent;
        document.getElementById("bookgenre").textContent = cells[3].textContent;
        document.getElementById("bookprice").textContent = cells[4].textContent;
        document.getElementById("bookauthor").textContent = cells[5].textContent;
        document.getElementById("book-year").textContent = cells[6].textContent;
        document.getElementById("book-lang").textContent = cells[7].textContent;

        let filteredArr = mainBooks;
        filteredArr = filteredArr.filter(element => element.genre.toLowerCase().includes(cells[3].textContent.toLowerCase()));
        filteredArr = filteredArr.filter(element => element.price >= (Number(cells[4].textContent)-(0.1*Number(cells[4].textContent))))
        filteredArr = filteredArr.filter(element => element.price <= (Number(cells[4].textContent)+(0.1*Number(cells[4].textContent))))
        renderBooks(filteredArr,'table-similar-books-body')
    })
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if(document.body.classList.contains("dark-mode")){
            themeBtn.textContent = "☀ Light Mode";
        }
        else{
            themeBtn.textContent = "🌙 Dark Mode";
        }
    });
};

function display(data,start,end){
    console.log("Displaying index range:",start,end,"on",PN)
    displayBooks = data;
    finalBooks = displayBooks.slice(start,end);
    renderBooks(finalBooks,'table-all-books-body')
};

function renderBooks(bookdata,id){
    //console.log("Starting rendering")
    let tb = document.getElementById(id);
    tb.innerHTML = "";
    for (let book of bookdata){
        let tablerow = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        let td8 = document.createElement('td');
        let td9 = document.createElement('td');

        let sno = book.sno;
        let bookname = book.bookName;
        let bookId = book.bookId;
        let genre = book.genre;
        let price = book.price;
        let author = book.author;
        let publicationYear = book.publicationYear;
        let lang = book.lang;
        let examine = document.createElement('img');
        // examine.src = `${book.coverImage}`;
        //examine.src = "https://img.freepik.com/free-vector/stack-colorful-books_1308-171744.jpg";
        //examine.src = "https://static.vecteezy.com/system/resources/previews/023/985/139/non_2x/school-materials-clip-art-cartoon-books-free-png.png";
        examine.src = "https://www.transparentpng.com/thumb/book/hfU1gl-book-transparent-background.png";
        examine.loading = "lazy";
        examine.width = "50";
        examine.height = "50";
        
        td1.append(sno);
        td2.append(bookname);
        td3.textContent = bookId;
        td4.append(genre);
        td5.append(price);
        td6.append(author);
        td7.append(publicationYear);
        td8.append(lang);
        td9.append(examine);

        tablerow.append(td1,td2,td3,td4,td5,td6,td7,td8,td9);
        tb.append(tablerow)
    };
};

function sort_func(property,flag){
    console.log("Clicked:",property,flag)
    sorted_arr = allBooks;
    if (flag == 0){
        sorted_arr.sort((a,b) => a[property]-b[property])
    }
    else{
        sorted_arr.sort((a,b) => b[property]-a[property])        
    }

    display(sorted_arr,((PN-1)*NR),PN*NR)
};

function pagination(books){
    let norows = document.getElementById("rows");
    PN = 1;
    NR = norows.value;
    let p_footer = document.getElementById("pagination");
    p_footer.innerHTML = "";
    pages = Math.ceil(books.length/norows.value)
    console.log(pages)

    let p_start = document.createElement("li");
    p_start.className = "page-item";

    let p_start_a = document.createElement("a");
    p_start_a.className = "page-link";
    p_start_a.href = "#";

    let val = "Previous";

    p_start_a.append(val)
    p_start.append(p_start_a)
    p_footer.append(p_start)

    for (let i = 1; i <= pages; i++){
        let p_element = document.createElement("li");
        p_element.className = "page-item";
        if(i == 1){
            p_element.classList.add("active");
        }

        let p_element_a = document.createElement("a");
        p_element_a.className = "page-link";
        p_element_a.href = "#";

        let val = i;

        p_element_a.append(val)
        p_element.append(p_element_a)
        p_footer.append(p_element)
    }

    let p_end = document.createElement("li");
    p_end.className = "page-item";

    let p_end_a = document.createElement("a");
    p_end_a.className = "page-link";
    p_end_a.href = "#";

    let val_end = "Next";

    p_end_a.append(val_end)
    p_end.append(p_end_a)
    p_footer.append(p_end)

    display(books,((PN-1)*NR),PN*NR)
};

function search(){
    //console.log("Clicked")
    let search_name = document.getElementById("input-search-name");
    let search_id = document.getElementById("input-search-id");
    // let search_genre = document.getElementById("input-search-genre");
    let search_price_min = document.getElementById("input-search-price-min");
    let search_price_max = document.getElementById("input-search-price-max");
    let search_author = document.getElementById("input-search-author");
    let search_year_from = document.getElementById("input-search-year-from");
    let search_year_to = document.getElementById("input-search-year-to");
    let search_lang = document.getElementById("input-search-language");

    let search_name_value = search_name.value.trim();
    let search_id_value = search_id.value.trim();
    // let search_genre_value = search_genre.value.trim();
    let search_price_min_value = search_price_min.value.trim();
    let search_price_max_value = search_price_max.value.trim();
    let search_author_value = search_author.value.trim();
    // let search_year_value = search_year.value.trim();
    let search_year_from_value = search_year_from.value.trim();
    let search_year_to_value = search_year_to.value.trim();
    let search_lang_value = search_lang.value.trim();

    //console.log(search_id_value,search_genre_value,search_price_min_value,search_price_max_value,search_author_value,search_year_value)

    // let val = [search_id_value,search_genre_value,search_price_min_value,search_price_max_value,search_author_value,search_year_value]
    let filteredArr = mainBooks;
    // for (let i of val){
    //     console.log(i)
    // }
    if (search_name_value != ""){
        filteredArr = filteredArr.filter(element => element.bookName.toLowerCase().includes(search_name_value.toLowerCase()))
    }
    if (search_id_value != ""){
        filteredArr = filteredArr.filter(element => element.bookId.toLowerCase().includes(search_id_value.toLowerCase()))
    }
    // if (search_genre_value != ""){
    //     filteredArr = filteredArr.filter(element => element.genre.toLowerCase().includes(search_genre_value.toLowerCase()))
    // }
    if (selectedGenres.length > 0){
        filteredArr = filteredArr.filter(book => selectedGenres.includes(book.genre))
    }
    if (search_price_min_value != ""){
        filteredArr = filteredArr.filter(element => element.price >= Number(search_price_min_value))
    }
    if (search_price_max_value != ""){
        filteredArr = filteredArr.filter(element => element.price <= Number(search_price_max_value))
    }
    if (search_author_value != ""){
        filteredArr = filteredArr.filter(element => element.author.toLowerCase().includes(search_author_value.toLowerCase()))
    }
    // if (search_year_value != ""){
    //     filteredArr = filteredArr.filter(element => element.publicationYear.toString().includes(search_year_value.toString()))
    // }
    if (search_year_from_value != ""){
        filteredArr = filteredArr.filter(element => element.publicationYear >= Number(search_year_from_value))
    }
    if (search_year_to_value != ""){
        filteredArr = filteredArr.filter(element => element.publicationYear <= Number(search_year_to_value))
    }
    if (search_lang_value != ""){
        filteredArr = filteredArr.filter(element => element.lang.toLowerCase().includes(search_lang_value.toLowerCase()))
    }
    if (filteredArr != mainBooks){
        renderBooks(filteredArr,'table-similar-books-body')
    }
    else{
        renderBooks([],'table-similar-books-body')
    }
    
    //renderBooks(filteredArr,'table-all-books-body')

};

function clear(){
    let spans = document.querySelectorAll("#list-examined-book span");

    for (let s of spans){
        s.textContent = "";
    }

    let f = document.getElementById("search-form");
    for (let i of f){
        i.value="";
    }
    
    // Reset selected genres array
    selectedGenres = [];

    // Remove genre tags but keep input box
    let genreContainer = document.getElementById("genre-container");
    let genreInput = document.getElementById("input-search-genre");

    genreContainer.innerHTML = "";
    genreContainer.appendChild(genreInput);

    search();
};