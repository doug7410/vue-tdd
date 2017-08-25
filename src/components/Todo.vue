<template>
    <div class="todo-list">
      <h1 class="title">Todo List</h1>
      <input type="text" name="new-todo" v-model="todo" @keyup="createTodo(todo, $event.key)" placeholder="add your todo...">
      <ul>
        <li v-for="(todo, index) in filteredTodos">
          <input :id="`toggle-todo-${index}`" type="checkbox" @click="toggleTodoDone(index)" :checked="todo.done" />
          <label>{{ todo.title }}</label>
          <button :id="`delete-todo-${index}`" class="remove" @click="deleteTodo(index)">x</button>
        </li>
      </ul>
      <div class="filters">
        <span class="todos-left">{{ leftTodo }} Todos left - </span>
        <button @click="filter = 'all'" id="all-todos" :class="{active : filter === 'all'}">All</button> -
        <button @click="filter = 'active'" id="active-todos" :class="{active : filter === 'active'}">Active</button> -
        <button @click="filter = 'completed'" id="completed-todos" :class="{active : filter === 'completed'}">Completed</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'todo',
  data () {
    return {
      todos: [],
      todo: '',
      filter: 'all'
    }
  },
  methods: {
    createTodo (todo, key) { // add a second argument for key
      if (key === 'Enter') { // add a conditional to check if the key is Enter
        this.todos.push({title: todo, done: false})
        this.todo = '' // clear the todo
      }
    },
    toggleTodoDone (index) {
      this.todos[index].done = !this.todos[index].done
      this.$nextTick()
    },
    deleteTodo (index) {
      this.todos.splice(index, 1)
    }
  },
  computed: {
    leftTodo () {
      const notDone = this.todos.filter((todo) => {
        return todo.done === false
      })
      return notDone.length
    },
    filteredTodos () {
      return this.todos.filter((todo) => {
        if (this.filter === 'active') {
          if (!todo.done) return todo
        }

        if (this.filter === 'all') {
          return todo
        }

        if (this.filter === 'completed') {
          if (todo.done) return todo
        }
      })
    }
  }
}
</script>

<style>
  body {
    background-color: #eaeaea;
  }

  ul {
    list-style: none;
    font-size: 1.5em;
  }

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  input[type=checkbox] {
    font-size: 1em;
    margin: 13px 0;
  }

  label {
    width: 100%;
    text-align: left;
    padding: 0 0 0 15px;
  }

  .todo-list {
    max-width: 400px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 15px;
    box-shadow: 2px 2px 2px #888;
    border-radius: 3px;
  }
  input[type=text] {
    font-size: 1.4em;
    padding: 3px 6px;
  }
  .filters .active {
    background-color: #0074D9;
    border: none;
    outline: none;
    color: #ffffff;
  }

  .filters button {
    border: none;
    outline: none;
    font-size: 1em;
    padding: 5px;
  }

  .remove {
    background-color: transparent;
    border: none;
    font-size: 1em;
  }

  .remove:hover {
    cursor: pointer;
  }
</style>
