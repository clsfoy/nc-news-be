
const { createTopicReference } = require('./data-manipulation')

describe('Testing article reference', () => {
    test('returns an empty object when passed an empty array', () => {
        expect(createTopicReference([])).toEqual({})
    })
    test('returns new object with topic referencing slug', () => {
        
        const input = {
            description: 'The man, the Mitch, the legend',
            slug: 'mitch',
        }
        const expected = {
            topic: 'mitch'
        }
        expect(createTopicReference(input)).toEqual(expected)
    })
})