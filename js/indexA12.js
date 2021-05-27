const urlBase = 'https://movie-list.alphacamp.io'
const urlIndex = urlBase + '/api/v1/movies/'
const urlPoster = urlBase + '/posters/'
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const dataPanel = document.querySelector('#data-panel')
const movieArr = []

const per_page_count = 12
const paginator = document.querySelector('#paginator')
let filterMovies = []


function renToMovieA(content) {
  let row_html = ''

  content.forEach((movie) => {

    row_html += `
    <div class="col-12 d-flex justify-content-between align-items-center mt-1 pt-3 pb-2 border-bottom">
        <div class="">
            <div class="card-body">
              <h5 class="card-title">${movie.title}</h5>
            </div>
        </div>
        <div class="">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal"
            data-target="#movie-modal" data-id='${movie.id}'>More</button>
          <button class="btn btn-info btn-add-favorite" data-id='${movie.id}'>+</button>
        </div>
        
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = row_html
}


function renToMovie(content) {
  let row_html = ''

  content.forEach((movie) => {

    row_html += `
        <div class="col-sm-3">
            <div class="mb-2 mt-5">
              <div class="card" style="width: 16rem;">
                <img class="card-img-top"
                  src="${urlPoster + movie.image}"
                  alt="Movie Poster">
                <div class="card-body">
                  <h5 class="card-title">${movie.title}</h5>
                </div>
                <div class="card-footer">
                  <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                    data-target="#movie-modal" data-id='${movie.id}'>More</button>
                  <button class="btn btn-info btn-add-favorite" data-id='${movie.id}'>+</button>
                </div>
              </div>
            </div>
          </div>
          `
  })
  dataPanel.innerHTML = row_html
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movieArr
  const pageStart = (page - 1) * per_page_count
  return data.slice(pageStart, pageStart + per_page_count)
}


function showPaginator(amount) {
  const pageNum = Math.ceil(amount / per_page_count)
  let pageHtml = ''
  for (let i = 1; i <= pageNum; i++) {
    pageHtml += `
    <li class="page-item"><a class="page-link" data-id='${i}' href="#">${i}</a></li>
    `
  }
  paginator.innerHTML = pageHtml
}
paginator.addEventListener('click', function showPageItem(event) {
  if (event.target.tagName !== 'A') return
  const pageId = Number(event.target.dataset.id)
  formatStyle(pageId)
})

function findMovie(id) {
  const modalTitle = document.querySelector('.modal-title')
  const movieDate = document.querySelector('#movie-date')
  const movieDescription = document.querySelector('#movie-description')
  const moviePoster = document.querySelector('#movie-poster')

  axios.get(urlIndex + id)
    .then(function (response) {
      const data = response.data.results
      modalTitle.textContent = data.title
      movieDate.textContent = data.release_date
      movieDescription.textContent = data.description
      moviePoster.innerHTML = `
      <img src="${urlPoster + data.image}" alt=""
                  class="image-movie"></div>
      `

    })
}


function addToCollection(id) {
  const movieList = JSON.parse(localStorage.getItem('movieCollection')) || []
  const findMovie = movieArr.find((movie) => movie.id === id)

  if (movieList.some((movie) => movie.id === id)) {
    return alert('此片單已經加過了！')  //用了return 就不會再往下走, 所以JSON的陣列就不會記錄到重複的資料

  }
  movieList.push(findMovie)
  localStorage.setItem('movieCollection', JSON.stringify(movieList))

}

dataPanel.addEventListener('click', function showMovie(event) {

  if (event.target.matches('.btn-show-movie')) {
    findMovie(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToCollection(Number(event.target.dataset.id))

  }
})


searchForm.addEventListener('submit', function showSearchForm(event) {
  event.preventDefault() //請瀏覽器終止元件的預設行為
  console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    alert('please enter a valid value')
  }
  filterMovies = movieArr.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  showPaginator(filterMovies.length)
  formatStyle(1)
})

let mode = 'mode-grid'

function formatStyle(id) {
  const styleBtn = document.querySelectorAll('.style-btn')

  whichFormatStyle(id)

  styleBtn.forEach((format) => format.addEventListener('click', function formatGo(event) {

    if (event.target.dataset.style === 'mode-list') {
      mode = 'mode-list'
      whichFormatStyle(id)
    } else if (event.target.dataset.style === 'mode-grid') {
      mode = 'mode-grid'
      whichFormatStyle(id)
    }
  }))
}


function whichFormatStyle(id) {
  if (mode === 'mode-list') {
    renToMovieA(getMoviesByPage(id))
  } else if (mode === 'mode-grid') {
    renToMovie(getMoviesByPage(id))
  }

}


axios.get(urlIndex)
  .then(function (response) {
    // handle success
    // console.log(response);
    for (const list of response.data.results) {
      movieArr.push(list)
    }
    formatStyle(1)
    showPaginator(movieArr.length)

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });


