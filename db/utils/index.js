exports.formatTime = articles => articles.map((article) => {
  article.created_at = new Date(article.created_at).toISOString();
  return article;
});
