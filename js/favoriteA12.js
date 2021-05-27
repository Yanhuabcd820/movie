const urlBase = 'https://movie-list.alphacamp.io'
const urlIndex = urlBase + '/api/v1/movies/'
const urlPoster = urlBase + '/posters/'
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const dataPanel = document.querySelector('#data-panel')

const movieArr = JSON.parse(localStorage.getItem('movieCollection'))

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
                  <button class="btn btn-danger btn-add-favorite" data-id='${movie.id}'>X</button>
                </div>
              </div>
            </div>
          </div>
          `
    // console.log()
  })
  dataPanel.innerHTML = row_html
}

function findMovie(id) {
  const modalTitle = document.querySelector('.modal-title')
  const movieDate = document.querySelector('#movie-date')
  const movieDescription = document.querySelector('#movie-description')
  const moviePoster = document.querySelector('#movie-poster')

  axios.get(urlIndex + id)
    .then(function (response) {
      const data = response.data.results
      // console.log(data)
      modalTitle.textContent = data.title
      movieDate.textContent = data.release_date
      movieDescription.textContent = data.description
      moviePoster.innerHTML = `
      <img src="${urlPoster + data.image}" alt=""
                  class="image-movie"></div>
      `
    })
}
function deleteToCollection(id) {
  if (!movieArr) return
  const findMovieIndex = movieArr.findIndex((movie) => movie.id === id)

  if (findMovieIndex === -1) return
  movieArr.splice(findMovieIndex, 1)
  localStorage.setItem('movieCollection', JSON.stringify(movieArr))
  renToMovie(movieArr)
}

dataPanel.addEventListener('click', function showMovie(event) {
  if (event.target.matches('.btn-show-movie')) {
    findMovie(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    deleteToCollection(Number(event.target.dataset.id))
  }
})

renToMovie(movieArr)


