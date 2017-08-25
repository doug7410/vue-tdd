import Vue from 'vue'
import Todo from '@/components/Todo'

describe('Todo.vue', () => {
  let div

  beforeEach(() => {
    // create a dom element for the component to mount to
    div = document.createElement('div')
    document.body.appendChild(div)
  })

  afterEach(() => {
    // clean up the document nodes after each test
    Array.prototype.forEach.call(document.querySelectorAll('body *:not([type="text/javascript"])'), node => {
      node.parentNode.removeChild(node)
    })
  })

  it('should render the correct heading', () => {
    new Vue(Todo).$mount(div)
    expect($('h1').text()).to.equal('Todo List')
  })

  it('should have an array to store todos in', () => {
    const vm  = new Vue(Todo).$mount(div) // here we're saving the vue instance to a constant 'vm'

    // $data is an instance property that get's this components data property
    // more info here https://vuejs.org/v2/api/#vm-data
    expect(vm.$data.todos).to.be.an('array')
  })


  it('should create a todo when calling the createTodo method and the input key is Enter', () => {
    const vm = new Vue(Todo).$mount(div)
    vm.createTodo('Walk the dog', 'Enter')

    expect(vm.$data.todos[0]).to.deep.equal({ title: 'Walk the dog', done: false})
  })

  it('should not create a todo when calling the createTodo method and the input key is not Enter', () => {
    const vm = new Vue(Todo).$mount(div)
    vm.createTodo('Walk the do', 'g')

    expect(vm.$data.todos).to.be.empty
  })

  it('should dispatch the createTodo method on keyup with the todo and key when typing in the todo input', () => {
    const vm = new Vue(Todo).$mount(div)
    const createTodo = sinon.stub(vm, 'createTodo')
    const input = $('input[name=new-todo]')

    input.val('Walk the dog')
    const inputText = document.createEvent('HTMLEvents')
    inputText.initEvent('input', true, true)
    input.get(0).dispatchEvent(inputText)

    const keyup = document.createEvent('HTMLEvents')
    keyup.key = 'Enter'
    keyup.initEvent('keyup', true, true)
    input.get(0).dispatchEvent(keyup)

    expect(createTodo).to.have.been.calledOnce.and.calledWith('Walk the dog', 'Enter')
  })

  it('should clear the input after calling createTodo', (done) => {
    const vm = new Vue(Todo).$mount(div)
    const input = $('input[name=new-todo]')

    input.val('Wash the car')
    const inputText = document.createEvent('HTMLEvents')
    inputText.initEvent('input', true, true)
    input.get(0).dispatchEvent(inputText)

    expect(input.val()).to.equal('Wash the car')

    const keyup = document.createEvent('HTMLEvents')
    keyup.key = 'Enter'
    keyup.initEvent('keyup', true, true)
    input.get(0).dispatchEvent(keyup)

    vm.$nextTick(() => {
      expect(input.val()).to.equal('')
      done()
    })
  }).timeout(100)

  it('should show a list of todos', () => {
    const data = { todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    new Vue(Todo).$mount(div)

    expect($('ul')).to.contain('Write some code')
    expect($('ul')).to.contain('Learn TDD')
  })

  it('should have a method for toggling todo done or not done state', () => {
    const data = { todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    const vm = new Vue(Todo).$mount(div)
    vm.toggleTodoDone(1)

    expect(vm.$data.todos[1].done).to.equal(true)
  })

  it('should have a checkbox for each todo that calls toggleTodoDone for that todo', () => {
    const data = { todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    const vm = new Vue(Todo).$mount(div)
    const toggleTodoDone = sinon.spy(vm, 'toggleTodoDone')

    $('#toggle-todo-1').click()
    expect(toggleTodoDone).to.have.been.calledOnce.and.calledWith(1)
  })

  it('should set the checked attribute for the todo checkboxes', () => {
    const data = { todos: [{ title: 'Write some code', done: true}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    new Vue(Todo).$mount(div)

    expect(document.getElementById('toggle-todo-0').checked).to.be.true
    expect(document.getElementById('toggle-todo-1').checked).to.be.false
  })

  it('should have a method for deleting a todo', () => {
    const data = { todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    const vm = new Vue(Todo).$mount(div)

    $('#delete-todo-0').click()
    expect(vm.$data.todos).to.have.lengthOf(1)
    expect(vm.$data.todos[0]).to.deep.equal({ title: 'Learn TDD', done: false})
  })

  it('should show a count of how many todos are not yet done', () => {
    const data = { todos: [{ title: 'Write some code', done: true}, { title: 'Learn TDD', done: false}]}
    stubData(Todo, data)
    new Vue(Todo).$mount(div)

    expect($('span.todos-left').text()).to.contain('1')
  })

  it('should have a filter data property set to all by default', () => {
    const vm = new Vue(Todo).$mount(div)
    expect(vm.$data.filter).to.equal('all')
  })

  it('should only show active todos when filter is set to active', () => {
    const data = {
      todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: true}],
      filter: 'active'
    }

    stubData(Todo, data)
    new Vue(Todo).$mount(div)

    expect($('ul')).to.contain('Write some code')
    expect($('ul')).not.to.contain('Learn TDD')
  })

  it('should only show completed todos when filter is set to completed', () => {
    const data = {
      todos: [{ title: 'Write some code', done: false}, { title: 'Learn TDD', done: true}],
      filter: 'completed'
    }

    stubData(Todo, data)
    new Vue(Todo).$mount(div)

    expect($('ul')).not.to.contain('Write some code')
    expect($('ul')).to.contain('Learn TDD')
  })

  it('should set the filter when clicking the filter buttons', () => {
    const vm = new Vue(Todo).$mount(div)

    $('#active-todos').click()
    expect(vm.$data.filter).to.equal('active')

    $('#completed-todos').click()
    expect(vm.$data.filter).to.equal('completed')

    $('#all-todos').click()
    expect(vm.$data.filter).to.equal('all')
  })

  it('should set the css class to active on the filter button when that filter is active', (done) => {
    const vm = new Vue(Todo).$mount(div)
    expect($('#all-todos')).to.have.class('active')

    $('#active-todos').click()
    vm.$nextTick(() => {
      expect($('#active-todos')).to.have.class('active')
      expect($('#all-todos')).not.to.have.class('active')

      $('#completed-todos').click()
      vm.$nextTick(() => {
        expect($('#completed-todos')).to.have.class('active')
        expect($('#active-todos')).not.to.have.class('active')
        expect($('#all-todos')).not.to.have.class('active')
        done()
      })
    })
  }).timeout(100)
})

const stubData = function(component, data) {
  const oldData = component.data()
  const dataClone = JSON.parse(JSON.stringify(oldData));
  const newData = Object.assign(oldData, data)
  component.data = () => {
    return newData
  }

  afterEach(() => {
    component.data = () => {
      return dataClone
    }
  })
}
