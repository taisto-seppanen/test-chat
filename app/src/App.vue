<template>
  <div id="app" class="root">
    <ul class="messages">
      <li :key="msg.id" v-for="msg in messages" class="messages__msg message">
        <span class="message__time">#{{ msg.time }}</span>
        <span class="message__name">{{ msg.name }}</span>
        <span class="message__text"> {{ msg.text }}</span>
      </li>
    </ul>
    <form v-if="connected" class="form" method="post" @submit="sendMessage">
      <label class='form__label' for="message">{{ this.nickName ? '~/%' : '~/login@auth/%' }}
      </label>
      <input class='form__input' type="text" minlength=2 maxlength=150 required name="message" autocomplete="off">
      <button class="form__submit-btn">SEND</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      ws: {},
      nickName: '',
      messages: [],
      connected: false,
    }
  },
  methods: {
    messageStringify: (name, text) => JSON.stringify({ name, text }),
    setFocusOnInput: () => document.querySelector('.form__input').focus(),
    setNickName(name) {
      this.nickName = name
      this.updateChat(this.messageStringify('Chat system:', `name@set~ % ${this.nickName}`))
    },
    sendMessage(e) {
      e.preventDefault()
      const value = e.target.message.value
      e.target.reset()
      if (!this.nickName) {
        this.setNickName(value)
        return
      }
      this.ws.send(this.messageStringify(this.nickName, value))
      this.setFocusOnInput()
    },
    updateChat(msg) {
      msg = JSON.parse(msg)
      msg.time = new Date().toLocaleTimeString()
      this.messages.push(msg)
    },
    connect() {
      this.ws = new WebSocket("ws://localhost:3001")
    },
    startChat() {
      this.connect()
      this.ws.onopen = () => {
        this.updateChat(this.messageStringify('Status:', 'Online...'))
        this.connected = true
        if (!this.nickName) {
          this.updateChat(this.messageStringify('Chat system:', 'What is your name, stranger?'))
          this.connected = true
          document.addEventListener('click', this.setFocusOnInput)
        }
      }
      this.ws.onclose = () => {
        this.updateChat(this.messageStringify('Status:', 'offline'))
      };
      this.ws.onmessage = (data) => {
        this.updateChat(data.data)
      }
    }
  },
  mounted() {
    this.startChat();
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  height: 100vh;
  background-color: #000;
}

.root {
  padding: 10px;
}

.form__label,
.form__input,
.form__submit-btn,
.messages__msg {
  color: green;
  font-family: "Lucida Console", "Courier New", monospace;
  font-size: 14px;
}

.form__submit-btn {
  background-color: rgba(0, 0, 0, 0);
  outline: none;
  padding: 0;
  border: 1px dotted green;
  display: none;
}

@media screen and (max-width: 768px) {
  .form__submit-btn {
    display: block;
  }
}

.message__name {
  font-weight: bold;
  color: yellow;
}

.messages__msg>* {
  padding-left: 5px;
}

.form {
  display: flex;
}

.form__input {
  width: 100%;
  background: rgba(0, 0, 0, 0);
  border: none;
  caret-color: green;
  outline: none;
  font-size: 16px;
}

.messages {
  list-style: none;
  padding: 0;
  overflow-wrap: break-word;
}
</style>
