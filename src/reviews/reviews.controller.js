const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service");

//Middleware

async function reviewIdExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await service.read(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  return next({
    status: 404,
    message: "Review cannot be found",
  });
}

//CRUD 

async function update(req, res) {
  const updatedReview = { ...res.locals.review, ...req.body.data };
  await service.update(updatedReview);
  const returnData = await service.getReviewWithCritic(
    res.locals.review.review_id
  );
  res.json({ data: returnData });
}

async function destroy(req, res) {
  await service.destroy(res.locals.review.review_id);
  res.sendStatus(204);
}

module.exports = {
    update: [asyncErrorBoundary(reviewIdExists), asyncErrorBoundary(update)],
    destroy: [asyncErrorBoundary(reviewIdExists), asyncErrorBoundary(destroy)],
};