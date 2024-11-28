import request from 'supertest'
import app from '../../index' // Make sure your index.ts exports the app instance, not the server
import User from '../../models/User'

describe('Auth & User Controller', () => {
  describe('POST /api/auth/register', () => {
    const validUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/auth/register').send(validUser)
      console.log(response.status)
      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Registration successful')

      const user = await User.findOne({ email: validUser.email })
      expect(user).toBeTruthy()
      expect(user!.firstName).toBe(validUser.firstName)
    })

    it('should not register user with existing email', async () => {
      await User.create(validUser)

      const response = await request(app).post('/api/auth/register').send(validUser)

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch('User already registered, please login!')
    })

    it('should validate required fields', async () => {
      const response = await request(app).post('/api/auth/register').send({})

      expect(response.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    const userCredentials = {
      email: 'john@example.com',
      password: 'password123',
    }

    beforeEach(async () => {
      await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: userCredentials.email,
        password: userCredentials.password,
      })
    })

    it('should login successfully with correct credentials', async () => {
      const response = await request(app).post('/api/auth/login').send(userCredentials)

      expect(response.status).toBe(200)
      expect(response.headers['set-cookie']).toBeDefined()
      expect(response.body.data.user).toBeDefined()
      expect(response.body.data.user.password).toBeUndefined()
    })

    it('should fail with incorrect password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: userCredentials.email,
        password: 'wrongpassword',
      })

      expect(response.status).toBe(401)
    })

    it('should fail with non-existent email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: userCredentials.password,
      })

      expect(response.status).toBe(404)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should clear the token cookie', async () => {
      const response = await request(app).post('/api/auth/logout')

      expect(response.status).toBe(200)
      expect(response.headers['set-cookie'][0]).toMatch(/token=;/)
    })
  })

  describe('GET /api/auth/google/login', () => {
    it('should redirect to Google OAuth', async () => {
      const response = await request(app).get('/api/auth/google/login')

      expect(response.status).toBe(302)
      expect(response.header.location).toMatch(/accounts\.google\.com/)
    })

    it('should include custom fallback URL', async () => {
      const fallbackUrl = 'http://custom-url.com'
      const response = await request(app).get(`/api/auth/google/login?fallbackUrl=${encodeURIComponent(fallbackUrl)}`)

      expect(response.status).toBe(302)
      expect(response.header.location).toMatch(/state=/)
    })
  })

  describe('GET /api/user', () => {
    let token: string

    beforeEach(async () => {
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'john@example.com',
        password: 'password123',
      })

      token = loginResponse.headers['set-cookie'][0]
    })

    it('should return user details when authenticated', async () => {
      const response = await request(app).get('/api/user').set('Cookie', token)

      expect(response.status).toBe(200)
      expect(response.body.data.user).toBeDefined()
      expect(response.body.data.user.email).toBe('john@example.com')
      expect(response.body.data.user.firstName).toBe('John')
      expect(response.body.data.user.lastName).toBe('Doe')
      expect(response.body.data.user.password).toBeUndefined()
    })

    it('should fail when not authenticated', async () => {
      const response = await request(app).get('/api/user')

      expect(response.status).toBe(401)
    })
  })
})
