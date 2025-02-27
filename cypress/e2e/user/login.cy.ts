describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login') // Adjust the route if necessary
  })

  //   it('should display the login form', () => {
  //     cy.get('[data-test="login-header"').contains('Login').should('be.visible')
  //     cy.get('[data-test="email-input"]').should('be.visible')
  //     cy.get('[data-test="password-input"]').should('be.visible')
  //     cy.get('button').contains('Login').should('be.visible')
  //   })

  it('should enable login button only when both fields are filled', () => {
    // Verify that login button is disabled initially
    cy.get('[data-test="login-btn"]').should('be.disabled')

    // Enter only email, button should still be disabled
    cy.get('[data-test="email-input"] input').type('admin@fitnthrive.com')
    cy.get('[data-test="login-btn"]').should('be.disabled')

    // Enter only password, button should still be disabled
    cy.get('[data-test="email-input"] input').clear()
    cy.get('[data-test="password-input"] input').type('password123')
    cy.get('[data-test="login-btn"]').should('be.disabled')

    // Enter both email and password, button should be enabled
    cy.get('[data-test="email-input"] input').type('admin@fitnthrive.com')
    cy.get('[data-test="login-btn"]').should('not.be.disabled')

    // Clear password, button should be disabled again
    cy.get('[data-test="password-input"] input').clear()
    cy.get('[data-test="login-btn"]').should('be.disabled')

    // Re-enter password, button should be enabled
    cy.get('[data-test="password-input"] input').type('password123')
    cy.get('[data-test="login-btn"]').should('not.be.disabled')
  })

  //   it('should show error for invalid email format', () => {
  //     cy.get('[data-test="email-input"]').type('invalidemail')
  //     cy.get('[data-test="password-input"]').type('password123')
  //     cy.get('button').contains('Login').click()
  //     cy.get('.v-messages').should('contain', 'Invalid email format')
  //   })

  //   it('should show an error for incorrect credentials', () => {
  //     cy.intercept('POST', '/api/login', {
  //       statusCode: 401,
  //       body: { message: 'Invalid email or password' },
  //     }).as('loginRequest')

  //     cy.get('[data-test="email-input"]').type('wrong@example.com')
  //     cy.get('[data-test="password-input"]').type('wrongpassword')
  //     cy.get('button').contains('Login').click()

  //     cy.wait('@loginRequest')
  //     cy.get('.v-alert').should('contain', 'Invalid email or password')
  //   })

  //   it('should log in successfully and set tokens', () => {
  //     cy.intercept('POST', '/api/login', {
  //       statusCode: 200,
  //       body: {
  //         token: 'mocked_token',
  //         refreshToken: 'mocked_refresh_token',
  //         message: 'Login successful',
  //       },
  //     }).as('loginRequest')

  //     cy.get('[data-test="email-input"]').type('test@example.com')
  //     cy.get('[data-test="password-input"]').type('password123')
  //     cy.get('button').contains('Login').click()

  //     cy.wait('@loginRequest')
  //     cy.get('.v-alert').should('contain', 'Login successful')

  //     cy.window().then((win) => {
  //       expect(win.document.cookie).to.include('token=mocked_token')
  //       expect(win.document.cookie).to.include('refreshToken=mocked_refresh_token')
  //     })

  //     cy.url().should('include', '/home') // Check redirection
  //   })

  //   it('should remember email if "Remember Me" is checked', () => {
  //     cy.get('[data-test="email-input"]').type('rememberme@example.com')
  //     cy.get('input[type="checkbox"]').check()
  //     cy.get('button').contains('Login').click()

  //     cy.reload()
  //     cy.get('[data-test="email-input"]').should('have.value', 'rememberme@example.com')
  //   })

  //   it('should allow toggling password visibility', () => {
  //     cy.get('[data-test="password-input"]').type('password123')
  //     cy.get('.mdi-eye').click()
  //     cy.get('[data-test="password-input"]').should('have.attr', 'type', 'text')
  //     cy.get('.mdi-eye-off').click()
  //     cy.get('[data-test="password-input"]').should('have.attr', 'type', 'password')
  //   })
})
