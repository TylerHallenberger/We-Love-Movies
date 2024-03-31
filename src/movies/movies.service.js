const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties.js");

const criticDetails = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("movies").select("*");
}

function listTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "m.movie_id")
    .where({ "m.movie_id": movieId })
    .andWhere({ "mt.is_showing": true });
}

async function listReviews(movieId) {
  const reviews = await knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": movieId });
  const reviewsWithCriticDetails = [];
  reviews.forEach((review) => {
    const addedCritic = criticDetails(review);
    reviewsWithCriticDetails.push(addedCritic);
  });
  return reviewsWithCriticDetails;
}

function isShowingInTheaters() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id")
    .orderBy("m.movie_id");
}

function read(movieId) {
  return knex("movies as m")
    .select("*")
    .where({ "m.movie_id": movieId })
    .first();
}

module.exports = {
  list,
  listTheaters,
  listReviews,
  isShowingInTheaters,
  read,
};