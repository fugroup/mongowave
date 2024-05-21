var connection = require('../index.js')
let db

describe('Upsert', () => {
  beforeAll(async () => (db = await connection()))
  beforeEach(async () => await db.drop())

  it('should create a document', async () => {
    var upsert = await db('project').upsert({ name: 'hi' }, { name: 'bye' })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toEqual('bye')
    var first = await db('project').get()
    expect(first.name).toEqual('bye')
  })

  it('should update a document', async () => {
    await db('project').create({ name: 'hello' })
    var upsert = await db('project').upsert({ name: 'hello' }, { name: 'bye' })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toEqual('bye')
    var first = await db('project').get()
    expect(first.name).toEqual('bye')
  })

  it('should update first document only', async () => {
    await db('project').create([{ name: 'hello' }, { name: 'goodbye' }])
    var upsert = await db('project').upsert({ name: 'hello' }, { name: 'bye' })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toEqual('bye')
    var find = await db('project').find()
    expect(find[0].name).toEqual('bye')
    expect(find[1].name).toEqual('goodbye')
  })

  it('should set and unset', async () => {
    await db('project').create({ name: 'hello' })
    var upsert = await db('project').upsert({ name: 'hello' }, { name: 'bye' })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toEqual('bye')
    var first = await db('project').get()
    expect(first.name).toEqual('bye')

    upsert = await db('project').upsert({ name: 'bye' }, { name: null })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toBeUndefined()
    first = await db('project').get()
    expect(first.name).toBeUndefined()
  })

  it('should use db field update operators', async () => {
    await db('project').create({ name: 'hello' })
    var upsert = await db('project').upsert(
      { name: 'hello' },
      { $inc: { counter: 1 } }
    )
    expect(upsert).not.toBe(null)
    expect(upsert.counter).toEqual(1)
    var first = await db('project').get()
    expect(first.counter).toEqual(1)
  })

  it('should not mutate values', async () => {
    var { id } = await db('project').create({ name: 'hello' })
    expect(id).toBeDefined()
    var values = { hello: 1 }
    await db('project').upsert({ id }, values)
    expect(values).toEqual({ hello: 1 })
  })

  it('should upsert', async () => {
    var upsert = await db('project').upsert({ id: '1' }, { name: 'hello' })

    expect(upsert).not.toBe(null)
    expect(upsert.name).toBe('hello')

    var doc = await db('project').get({ id: upsert.id })

    expect(doc.name).toBe('hello')

    var upsert2 = await db('project').upsert({ id: upsert.id }, { name: 'bye' })
    expect(upsert2).not.toBe(null)
    expect(upsert2.name).toBe('bye')
    var doc2 = await db('project').get({ id: upsert.id })
    expect(doc2.name).toBe('bye')
  })

  // alternative query
  it('no id string match, should return new document', async () => {
    await db('project').create({ id: '1' })
    var upsert = await db('project').upsert('0', { name: 'upsert' })
    expect(upsert).not.toBe(null)
    expect(upsert.name).toBe('upsert')

    var find = await db('project').find({ name: 'upsert' })
    expect(find.length).toBe(1)
  })

  it('id string match, should return updated document', async () => {
    await db('project').create({ id: '1' })
    var upsert = await db('project').upsert('1', { name: 'upsert' })
    expect(upsert).not.toBe(null)
    expect(upsert.id).toBe('1')
    expect(upsert.name).toBe('upsert')

    var find = await db('project').find()
    expect(find.length).toBe(1)
    expect(find[0].id).toBe(upsert.id)
    expect(find[0].name).toBe('upsert')
  })
})
