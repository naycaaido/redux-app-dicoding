# Frontend Testing Submission Evaluation Report

Based on the [frontend testing submission criteria], here is the status of your React Redux project:

## 1. Status Report: Completed vs. Missing

| Criterion | Requirement | Status | Current Implementation |
| :--- | :--- | :--- | :--- |
| **1** | Minimum of 2 tests for Reducer functions | **Completed** | [__tests__/threadsReducer.test.js](file:///d:/Programming/Dicoding/redux-app-dicoding/src/__tests__/threadsReducer.test.js) contains exactly 2 `it` test cases testing `setFilteredCategory` and `optimisticVoteThread`. |
| **2** | Minimum of 2 tests for Thunk functions | **Completed** | [__tests__/threadsThunk.test.js](file:///d:/Programming/Dicoding/redux-app-dicoding/src/__tests__/threadsThunk.test.js) contains exactly 2 `it` test cases testing `fetchThreads` and `voteThread`. |
| **3** | Minimum of 2 tests for React Components | **Completed** | You have 2 components tested ([CategoryFilter.test.jsx](file:///d:/Programming/Dicoding/redux-app-dicoding/src/__tests__/CategoryFilter.test.jsx) and [VoteButton.test.jsx](file:///d:/Programming/Dicoding/redux-app-dicoding/src/__tests__/VoteButton.test.jsx)), each with 1 `it` block. This totals 2 component tests. *(Note: see Recommendations below for making this even safer).* |
| **4** | Minimum of 1 E2E test for login flow | **Completed** | [cypress/e2e/login.cy.js](file:///d:/Programming/Dicoding/redux-app-dicoding/cypress/e2e/login.cy.js) exists and tests the login flow. *(Note: requires a small fix for headless mode, see below).* |
| **5** | explicitly written describe/it blocks | **Completed** | All test files use valid `describe` and `it` blocks provided by `vitest` and `cypress`. |
| **6** | Executable via `npm test` & `npm run e2e` | **Completed** | [package.json](file:///d:/Programming/Dicoding/redux-app-dicoding/package.json) contains `"test": "vitest run"` and `"e2e": "cypress run"`. |

---

## 2. Cypress E2E Login Test Fix (Race Condition in Headless Mode)

**Issue Identified:**
In headless mode, Cypress executes commands extremely fast. After the `cy.wait('@loginRequest')` completes, your test immediately checks `cy.url().should('not.include', '/login')` and `cy.get('nav').should('be.visible')`. However, React might still be in the process of fetching the user profile (`/users/me`) and rendering the homepage components. Because Cypress doesn't wait for these subsequent network calls, the test can flake and fail. 

**The Fix:**
You need to add a `cy.intercept` for the user profile fetch (or threads fetch) that happens right after a successful login, and `cy.wait()` for it.

**Update your [cypress/e2e/login.cy.js](file:///d:/Programming/Dicoding/redux-app-dicoding/cypress/e2e/login.cy.js) to include this:**
```javascript
  it('should login successfully with valid credentials', () => {
    // 1. Intercept both Login and subsequent User Profile fetch
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.intercept('GET', '**/users/me').as('getUserProfile'); // Missing intercept added
    cy.intercept('GET', '**/threads').as('getThreads'); // Good practice for the homepage

    cy.get('input[placeholder="email@contoh.com"]').type('aidonayaka4@gmail.com');
    cy.get('input[placeholder="Masukkan password"]').type('12345678');
    cy.get('button').contains(/^Masuk$/).click();

    // 2. Wait for login to complete
    cy.wait('@loginRequest')
      .its('response.statusCode')
      .should('be.oneOf', [200, 201]);

    // 3. Wait for the profile data to load to prevent race condition before checking UI
    cy.wait('@getUserProfile')
      .its('response.statusCode')
      .should('eq', 200);

    // 4. Now it's safe to assert the UI
    cy.url().should('not.include', '/login');
    cy.get('nav').should('be.visible');
  });
```

---

## 3. Next Steps & Recommended Boilerplate

Even though you have met the minimum requirements "by the letter", reviewers can sometimes be strict and interpret "2 tests for React Components" as **"2 test cases (it blocks) per component"**. To guarantee you pass without revision, I highly recommend adding a **second test case** for at least one of your components. 

Here is the complete boilerplate code to confidently round out your Component tests:

### Add this 2nd test case to [src/__tests__/VoteButton.test.jsx](file:///d:/Programming/Dicoding/redux-app-dicoding/src/__tests__/VoteButton.test.jsx):

```jsx
  it('should not call handlers when userId is not provided (user not logged in)', async () => {
    const onUpVote = vi.fn();
    const onDownVote = vi.fn();

    // Render component WITHOUT userId
    render(
      <VoteButton
        upVotesBy={['user-1']}
        downVotesBy={['user-2']}
        userId={null} // Not logged in
        onUpVote={onUpVote}
        onDownVote={onDownVote}
        size='sm'
      />,
    );

    await userEvent.click(screen.getByLabelText('Upvote'));
    await userEvent.click(screen.getByLabelText('Downvote'));

    // The handlers should NOT be triggered if the user is not authenticated
    expect(onUpVote).not.toHaveBeenCalled();
    expect(onDownVote).not.toHaveBeenCalled();
  });
```

With the provided E2E fixes and this additional test case, your submission will be rock-solid and guarantee a pass. You can apply these changes manually since you requested not to alter your code directly.
