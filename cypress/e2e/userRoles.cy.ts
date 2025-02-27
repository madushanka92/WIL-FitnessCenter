describe('User Roles Management', () => {
  beforeEach(() => {
    cy.AdminLogin() // Assume you have a custom login command
    cy.visit('/user-roles') // Navigate to the user roles page
  })

  it('should display the user roles table', () => {
    cy.get('.v-data-table').should('be.visible')
    cy.get('thead').contains('Role')
    cy.get('thead').contains('Active')
  })

  it('should open the Add Role dialog', () => {
    cy.get('button').contains('Add Role').click()
    cy.get('.v-dialog').should('be.visible')
    cy.get('.v-card-title').contains('Add Role')
  })

  it('should create a new role', () => {
    cy.get('button').contains('Add Role').click()
    cy.get("[data-test='role-input']").type('Test Admin')
    cy.get('button').contains('Save').click()

    cy.wait(500) // Wait for API response
    cy.get('.v-data-table').contains('Admin').should('be.visible')
  })

  it('should edit the newly created role', () => {
    cy.get('.v-data-table tbody tr') // Get all rows
      .contains('Test Admin') // Find the row containing 'Test Admin'
      .closest('tr') // Get the closest row element
      .find('.v-icon.mdi-pencil') // Find the edit button in that row
      .click() // Click the edit button

    cy.get("[data-test='role-input']").clear().type('Updated Role')
    cy.get('button').contains('Save').click()

    cy.wait(500)
    cy.get('.v-data-table').contains('Updated Role').should('be.visible')
  })

  it('should delete the "Updated Role" role with confirmation', () => {
    cy.get('.v-data-table tbody tr') // Get all rows
      .contains('Updated Role') // Find the row containing 'Updated Role'
      .closest('tr') // Get the closest row element
      .find('.v-icon.mdi-delete') // Find the delete button in that row
      .click() // Click the delete button

    cy.get('.v-dialog').contains('Confirm Delete').should('be.visible')
    cy.get('button').contains('Delete').click()

    cy.wait(500)
    cy.get('.v-data-table').should('not.contain', 'Updated Role')
  })

  it('should show an error if trying to delete a role linked to users', () => {
    cy.get('.v-data-table tbody tr') // Get all rows
      .contains('admin') // Find the row containing 'Admin'
      .closest('tr') // Get the closest row element
      .find('.v-icon.mdi-delete') // Find the delete button in that row
      .click() // Click the delete button

    cy.get('.v-dialog').contains('Confirm Delete').should('be.visible')
    cy.get('button').contains('Delete').click()

    cy.wait(500) // Wait for API response
    cy.get('.v-snackbar').should(
      'contain',
      'Cannot delete role, it is currently assigned to users.',
    )
  })
})
