const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service");

//Middleware

async function movieIdExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await service.read(movieId);
  if(foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  } 
    return next({
      status: 404,
      message: "Movie cannot be found"
    })
}

//CRUDL 

async function read(req, res) {
  const { movie } = res.locals
  res.json({ data: movie })
}

async function list(req, res) {
  if (req.query.is_showing) {
    const data = await service.isShowingInTheaters()
    res.json({ data })
  } else {
    const data = await service.list()
    res.json({ data })
  }
}

async function listTheaters(req, res) {
  const { movie } = res.locals
  const data = await service.listTheaters(movie.movie_id)
  res.json({ data })
}

async function listReviews(req, res) {
  const { movie } = res.locals
  const data = await service.listReviews(movie.movie_id)
  res.json({ data })
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieIdExists), read],
    listTheaters: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(listTheaters)],
    listReviews: [asyncErrorBoundary(movieIdExists), asyncErrorBoundary(listReviews)],
};