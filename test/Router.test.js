import { Router } from '../src/RouterHash.js'
import { test, assert } from './core.mjs'

const router = new Router();

test.it('lib/:n/src > #lib/test/src?path=/root/file.css', ()=> {
  router.route('lib/:n/src', ({ params, query }) => {
    assert.ok((params.n = "test"))
    assert.ok((query.path = "/root/file.css"))
  })
  router.navigate('lib/test/src', { path: '/root/file.css' })
})

test.it('user/:id/post/:postId > #user/123/post/456', ()=> {
  router.route('user/:id/post/:postId', ({ params }) => {
    assert.ok((params.id = 123))
    assert.ok((params.postId = 456))
  })
  router.navigate('user/123/post/456')
})

test.it('files/:any/:any > #files/documents/readme.txt', ()=> {
  router.route('files/:any/:any', ({ params }) => {
    assert.ok((params._0 = "documents"))
    assert.ok((params._1 = "readme.txt"))
  })
  router.navigate('files/documents/readme.txt');
})

test.it('api/:version/:any > #api/v1/users', ()=> {
  router.route('files/:any/:any', ({ params }) => {
    assert.ok((params.version = "v1"))
    assert.ok((params._0 = "users"))
  })
  router.navigate('api/v1/users');
})

test.run()
