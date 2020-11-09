// extract any functions you are using to manipulate your data, into this file

const articles = require("../data/test-data/articles");


// function createTopicReference(topicRows) {
//     if (topicRows.length === 0) return {}
//     const newObj = {}

//     topicRows.forEach(topic => {
//         newObj.topic = topic.slug

//     })
//     return newObj
// }

function createArticleRef(articleRows) {
    if (!(articleRows)) return {};
    const newObj = {};
    articleRows.forEach(article => {
        newObj[article.title] = article.article_id
    });
    //console.log(newObj)
    return newObj;
}

function formateComments(commentData, articleRef) {
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
        newObj.article_id = articleRef[comment.belongs_to]
        delete newObj.belongs_to
        return newObj

    })
    return newArr;
    //}
}

function dateFormatter(articleRows) {
    const newArr = []
    articleRows.forEach(article => {
        const unix = article.created_at;
        const date = new Date(unix).toLocaleString()

        article.created_at = date
        newArr.push(article)
    })
    return newArr

}

module.exports = { createArticleRef, formateComments, dateFormatter }