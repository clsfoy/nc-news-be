// extract any functions you are using to manipulate your data, into this file

  
function createTopicReference(topicRows) {
    if (topicRows.length === 0) return {}
    const newObj = {}

    topicRows.forEach(topic => {
        newObj.topic = topic.slug

    })
    return newObj
}


module.exports = {createTopicReference}