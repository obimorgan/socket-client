
import { useState, useEffect } from 'react'
import { Col, Container, Row, Form, FormControl, ListGroup } from 'react-bootstrap'
import { io } from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css';


const ADDRESS = 'http://localhost:4000'
const socket = io(ADDRESS, { transports: ['websocket'] })

function Home() {

  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connection is now established!')
    })

  socket.on('loggedin', () => {

  console.log('username successfully registered! :)')
      setLoggedIn(true)
      fetchOnlineUsers()

  socket.on('newConnection', () => {

    console.log('a new user just connected!')
    fetchOnlineUsers()
  })
    socket.on('message', (message) => {
      console.log('new message received!')

      console.log(message)

      setChatHistory((currentChatHistory) => [...currentChatHistory, message])

    })
    })
  }, [])

  const submitUsername = (e) => {
    e.preventDefault()

    socket.emit('setUsername', { username: username })

  }

  const fetchOnlineUsers = async () => {
    try {
      let response = await fetch(ADDRESS + '/online-users')
      if (response.ok) {
        
        let data = await response.json()
        console.log(data)
        let onlineUsers = data.onlineUsers
        setOnlineUsers(onlineUsers)
      } else {
        console.log('error retrieving online users')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitMessage = (e) => {
    e.preventDefault()
    
    const newMessage = {
      text: message,
      sender: username,
      id: socket.id,
      timestamp: Date.now(),
    }

    socket.emit('sendmessage', newMessage)

    setChatHistory([...chatHistory, newMessage])
    
    setMessage('')
  }

  return (
    <Container fluid className='px-4'>
      <Row className='my-3' style={{ height: '95vh' }}>
        <Col md={10} className='d-flex flex-column justify-content-between'>
          {/* MAIN COLUMN */}
          {/* USERNAME INPUT FIELD */}
          <Form onSubmit={submitUsername}>
            <FormControl
              placeholder='Insert here your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
          </Form>
          <ListGroup>
            {chatHistory.map((message, i) => (
              <ListGroup.Item key={i}>
                <strong>{message.sender}</strong>
                <span className='mx-1'> | </span>
                <span>{message.text}</span>
                <span className='ml-2' style={{ fontSize: '0.7rem' }}>
                  {new Date(message.timestamp).toLocaleTimeString('en-US')}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form onSubmit={handleSubmitMessage}>
            <FormControl
              placeholder="What's your message?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={2}>
          <div className='mb-3'>Connected users:</div>
          <ListGroup>
            {onlineUsers.length === 0 && <ListGroup.Item>No users yet</ListGroup.Item>}
            {onlineUsers.map((user) => (
              <ListGroup.Item key={user.id}>{user.username}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default Home

  

