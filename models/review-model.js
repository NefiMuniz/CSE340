const pool = require("../database/");

async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO review (review_text, inv_id, account_id)
      VALUES ($1, $2, $3) RETURNING *`;
    return (await pool.query(sql, [review_text, inv_id, account_id])).rows[0];
  } catch (error) {
    console.error("addReview error:", error);
  }
}

async function getReviewsByInventoryId(inv_id) {
  try {
    const sql = `
      SELECT r.review_id, r.review_text, r.review_date, a.account_firstname
      FROM review r
      JOIN account a ON r.account_id = a.account_id
      WHERE inv_id = $1 ORDER BY r.review_date DESC`;
    return (await pool.query(sql, [inv_id])).rows;
  } catch (error) {
    console.error("getReviewsByInventoryId error:", error);
  }
}

async function deleteReviewById(review_id) {
  const sql = "DELETE FROM review WHERE review_id = $1";
  return pool.query(sql, [review_id]);
}

module.exports = { addReview, getReviewsByInventoryId, deleteReviewById };
