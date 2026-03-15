describe('Login Spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should display login page correctly', () => {
    cy.get('input[placeholder="email@contoh.com"]').should('be.visible');
    cy.get('input[placeholder="Masukkan password"]').should('be.visible');
    cy.get('button')
      .contains(/^Masuk$/)
      .should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.intercept('GET', '**/users/me').as('getUserProfile');
    cy.intercept('GET', '**/threads').as('getThreads');

    cy.get('input[placeholder="email@contoh.com"]').type(
      'aidonayaka4@gmail.com',
    );
    cy.get('input[placeholder="Masukkan password"]').type('12345678');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();

    cy.wait('@loginRequest')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);

    cy.wait('@getUserProfile')
      .its('response.statusCode')
      .should('eq', 200);

    cy.url().should('not.include', '/login');
    cy.get('nav').should('be.visible');
  });

  it('should show error message with invalid credentials', () => {
    cy.get('input[placeholder="email@contoh.com"]').type(
      'wrong1232@example.com',
    );
    cy.get('input[placeholder="Masukkan password"]').type(
      'wrongpassword128378',
    );
    cy.get('button')
      .contains(/^Masuk$/)
      .click();

    // Sesuaikan dengan selector pesan error di aplikasi Anda
    cy.get('.alert--error').should('be.visible');
  });

  it('should prevent login with empty fields', () => {
    cy.get('button')
      .contains(/^Masuk$/)
      .click();

    // Memastikan tetap di halaman login atau muncul alert validasi HTML5/UI
    cy.url().should('include', '/login');
    cy.get('input:invalid').should('have.length.at.least', 1);
  });

  it('should show error for invalid email format', () => {
    cy.get('input[placeholder="email@contoh.com"]').type('email-tidak-valid');
    cy.get('input[placeholder="Masukkan password"]').type('password123');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();

    cy.get('input:invalid').should('have.length', 1);
  });
});
