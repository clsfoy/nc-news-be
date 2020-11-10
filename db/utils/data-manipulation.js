function createArticleRef(articleRows) {
  if (!articleRows) return {};
  const newObj = {};
  articleRows.forEach((article) => {
    newObj[article.title] = article.article_id;
  });
  //console.log(newObj)
  return newObj;
}

function formatComments(commentData, articleRef) {
  //console.log(commentData)
  if (!(commentData && articleRef)) return [];
  //else {
  const newArr = commentData.map((comment) => {
    const newObj = {
      ...comment,
    };
    //newObj.comment.created_by = articleRef[article.article_id]
    newObj.author = comment.created_by;
    delete newObj.created_by;
    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    return newObj;
  });
  return newArr;
  //}
}

function dateFormatter(articleRows) {
  const dateFormatted = articleRows.map((article) => {
    const newObj = {
      ...article,
    };
    const newTime = new Date(newObj.created_at);

    newObj.created_at = newTime;
    return newObj;
  });

  return dateFormatted;
}

module.exports = { createArticleRef, formatComments, dateFormatter };
