const name_input = document.getElementById('name_input')
const chat_window = document.getElementById('chat_window')
const message_input = document.getElementById('message_input')

const client_id = 'chat_client' + Math.random()

const options = {
  connectTimeout: 4000,

  // Authentication
  clientId: client_id,
  username: 'testuser',
  password: '121212',
  keepalive: 60,
  clean: true
}

// WebSocket connect url
const WebSocket_URL = 'ws://silvercauldron.xyz:8083/mqtt'

const client = mqtt.connect(WebSocket_URL, options)

client.on('connect', () => {
  console.log('Connect success')

  client.subscribe('chat', function (err) {
    if (!err) {
      console.log('SUBSCRIBE - SUCCESS')
    } else {
      console.log('SUBSCRIBE - ERROR')
    }
  })
})

client.on('reconnect', error => {
  console.log('wtf')
  console.log('reconnecting:', error)
})

client.on('error', error => {
  console.log('Connect Error:', error)
})

client.on('message', function (topic, message) {
  console.log('Te topic is ' + topic + ' and the message is ' + message.toString())

  // str to obj
  const received = JSON.parse(message.toString())
  // Am I?
  if (received.name.trim() == name_input.value.trim()) {
    chat_window.innerHTML = chat_window.innerHTML + '<div style="color: blue"><b>' + received.message + '</b></div>'
  } else {
    chat_window.innerHTML =
      chat_window.innerHTML + '<div style="color: grey"><i>' + received.name + ': </i>' + received.message + '</div>'
  }

  chat_window.scrollTop = chat_window.scrollHeight
})

message_input.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    // validate name
    if (name_input.value == '') {
      chat_window.innerHTML = chat_window.innerHTML + '<div style="color: red"><b>Your name is empty</b></div>'
      return
    }

    const to_send = {
      name: name_input.value,
      message: message_input.value
    }

    client.publish('chat', JSON.stringify(to_send))

    message_input.value - ''
  }
})
