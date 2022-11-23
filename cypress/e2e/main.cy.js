/// <reference types="cypress" />

describe('Basic E2E run-through', () => {
  let newFeed;

  it('connects and displays the main menu', () => {
    cy.visit('http://localhost:3000', { timeout: 20000 })

    cy.getTableContainer().should('include.text', 'Connecting to chain')

    const connection = cy.getData('connection-status');

    connection.should('include.text', 'Connected');
    connection.should('include.text', 'ws://127.0.0.1:9944');

    cy.getData('account-select').should('exist');

    cy.getTableContainer().should('include.text', 'No feeds owned by this account').wait(2000)
  })

  it('creates a new feed', () => {
    cy.getData('create-feed').click();

    cy.getData('tx-queue').should('include.text', 'Creating a new feed');

    cy.wait(5000)

    newFeed = cy.getData('feed-row-0');

    newFeed.should('exist');
    newFeed.get('td:first').should('include.text', '0');
    newFeed.get('td:nth-child(2)').should('include.text', '0');
    newFeed.get('td:nth-child(3)').should('include.text', '0 B');
  })

  it('adds data to a feed', () => {
    newFeed.getData('add-data').click();

    cy.getData('tx-queue').should('include.text', 'Adding data to feed 0').wait(5000)

    newFeed.get('td:nth-child(2)').should('not.match', '0');
    newFeed.get('td:nth-child(3)').should('not.match', '0 B');
  })

  it('closes a feed', () => {
    newFeed.getData('close-feed').click().wait(2000);

    cy.getData('close-feed-modal').getData('close-feed-confirm').click()

    cy.getData('tx-queue').should('include.text', 'Closing feed 0').wait(5000)

    newFeed.getData('add-data').should('be.disabled');
    newFeed.getData('close-feed').should('be.disabled');
  })

  it('transfer a feed', () => {
    newFeed.getData('transfer-feed').click().wait(2000);

    cy.getData('new-owner').click()
    
    cy.get('div').contains('dave').click()

    cy.getData('transfer-feed-confirm').click();

    cy.getData('tx-queue').should('include.text', 'Transferring feed 0').wait(5000)

    cy.getTableContainer().should('include.text', 'No feeds owned by this account')

    cy.getData('account-select').click()
    
    cy.get('div').contains('dave').click()

    const transferredFeed = cy.getData('feed-row-0');

    transferredFeed.should('exist');
  })
})
