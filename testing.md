# Testing Setup Tasks

## Overview
Setting up comprehensive testing for the oluwatimilehin portfolio website using Jest + React Testing Library for component/API testing and Playwright for E2E testing.

---

## Task 1: Jest + React Testing Library Setup

### 1.1 Install Dependencies
- [ ] Install `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- [ ] Install `jest-environment-jsdom` for DOM testing
- [ ] Install `@types/jest` for TypeScript support
- [ ] Install `msw` (Mock Service Worker) for API mocking

### 1.2 Configure Jest
- [ ] Create `jest.config.js` or update `package.json` with Jest configuration
- [ ] Configure test environment for Next.js (jsdom)
- [ ] Set up module name mapping for `@/` imports
- [ ] Configure test file patterns (`**/__tests__/**/*`, `**/*.test.*`)
- [ ] Set up transform for TypeScript/JSX files

### 1.3 Configure Testing Library
- [ ] Create `jest.setup.js` for global test setup
- [ ] Import `@testing-library/jest-dom` matchers
- [ ] Configure custom render function if needed

### 1.4 Update package.json
- [ ] Add test scripts: `"test"`, `"test:watch"`, `"test:coverage"`

---

## Task 2: Contact Form Component Tests

### 2.1 Form Rendering Tests
- [ ] Test that form renders with all input fields (name, email, subject, message)
- [ ] Test that submit button is present
- [ ] Test that form fields have correct placeholders
- [ ] Test that form fields are required

### 2.2 Form Validation Tests
- [ ] Test empty form submission shows validation errors
- [ ] Test email format validation (invalid email formats)
- [ ] Test that all required fields are validated
- [ ] Test that valid form can be submitted

### 2.3 Form Interaction Tests
- [ ] Test typing into name field
- [ ] Test typing into email field
- [ ] Test typing into subject field
- [ ] Test typing into message textarea
- [ ] Test form submission triggers API call
- [ ] Test loading state during submission
- [ ] Test form clears after successful submission

### 2.4 Form Submission Success Tests
- [ ] Test success message displays after successful submission
- [ ] Test form resets after success
- [ ] Test submit button is disabled during submission
- [ ] Test loading spinner appears during submission

### 2.5 Form Error Handling Tests
- [ ] Test error message displays on API failure
- [ ] Test form state is preserved on error
- [ ] Test user can retry after error

---

## Task 3: Contact API Route Tests

### 3.1 API Route Setup
- [ ] Set up MSW to mock `/api/contact` endpoint
- [ ] Create mock handlers for success and error scenarios

### 3.2 API Validation Tests
- [ ] Test API rejects requests with missing fields (name, email, subject, message)
- [ ] Test API rejects invalid email format
- [ ] Test API returns 400 status for validation errors

### 3.3 API Success Tests
- [ ] Test API accepts valid request data
- [ ] Test API calls Resend service (mocked)
- [ ] Test API returns 200 status on success
- [ ] Test API response includes success message
- [ ] Test API sends email with correct format (HTML and text)
- [ ] Test API uses correct recipient email (`lehinadenekan@gmail.com`)
- [ ] Test API uses `replyTo` field correctly

### 3.4 API Error Handling Tests
- [ ] Test API handles missing `RESEND_API_KEY` gracefully
- [ ] Test API returns success even without Resend (development mode)
- [ ] Test API handles Resend API errors (500, network errors)
- [ ] Test API returns appropriate error messages

### 3.5 Resend Mock Tests
- [ ] Mock Resend API calls
- [ ] Verify Resend is initialized with correct API key
- [ ] Verify email content includes name, email, subject, message
- [ ] Verify email is sent to correct recipient

---

## Task 4: Other Component Tests

### 4.1 Sidebar Component Tests
- [ ] Test sidebar renders navigation items
- [ ] Test sidebar collapse/expand on desktop (toggle button)
- [ ] Test sidebar shows/hides navigation when collapsed
- [ ] Test sidebar burger menu on mobile
- [ ] Test sidebar overlay on mobile
- [ ] Test active section highlighting
- [ ] Test navigation links scroll to correct sections

### 4.2 Hero Component Tests
- [ ] Test typewriter animation displays text character by character
- [ ] Test tagline fades in after typewriter completes
- [ ] Test typewriter restarts after pause
- [ ] Test tagline fades out on restart

### 4.3 Services Component Tests
- [ ] Test service cards render correctly
- [ ] Test Calendly widget is present
- [ ] Test contact form is integrated

---

## Task 5: Playwright E2E Testing Setup

### 5.1 Install Playwright
- [ ] Install `@playwright/test`
- [ ] Run `npx playwright install` to install browsers
- [ ] Configure Playwright in `playwright.config.ts`

### 5.2 Configure Playwright
- [ ] Set base URL (localhost:3000 for dev, production URL for CI)
- [ ] Configure test timeouts
- [ ] Set up screenshot/video on failure
- [ ] Configure browser options (headless mode)

### 5.3 Update package.json
- [ ] Add E2E test scripts: `"test:e2e"`, `"test:e2e:ui"`, `"test:e2e:headed"`

---

## Task 6: Contact Form E2E Tests

### 6.1 Form Submission Flow Test
- [ ] Navigate to Services section
- [ ] Fill in name field
- [ ] Fill in email field
- [ ] Fill in subject field
- [ ] Fill in message textarea
- [ ] Click submit button
- [ ] Verify loading state appears
- [ ] Verify success message displays
- [ ] Verify form fields are cleared

### 6.2 Form Validation E2E Test
- [ ] Navigate to Services section
- [ ] Try to submit empty form
- [ ] Verify browser validation prevents submission
- [ ] Fill in name only, verify email is required
- [ ] Fill invalid email format, verify validation
- [ ] Fill all fields with valid data, verify submission works

### 6.3 Form Error Handling E2E Test
- [ ] Mock API to return error
- [ ] Fill form and submit
- [ ] Verify error message displays
- [ ] Verify form data is preserved on error
- [ ] Verify user can retry submission

### 6.4 Email Verification Test
- [ ] Configure test email account or use mail testing service
- [ ] Submit form with test data
- [ ] Verify email is received at `lehinadenekan@gmail.com`
- [ ] Verify email contains correct content (name, email, subject, message)
- [ ] Verify `replyTo` is set correctly

---

## Task 7: Navigation E2E Tests

### 7.1 Section Navigation Tests
- [ ] Test clicking "Home" navigates to hero section
- [ ] Test clicking "Music" navigates to music section
- [ ] Test clicking "Commercial Work" navigates to commercial section
- [ ] Test clicking "Creative Projects" navigates to creative section
- [ ] Test clicking "Let's Work Together" navigates to services section
- [ ] Test smooth scroll behavior

### 7.2 Sidebar E2E Tests
- [ ] Test sidebar collapse/expand button on desktop
- [ ] Test sidebar navigation items are hidden when collapsed
- [ ] Test sidebar toggle button is positioned in middle
- [ ] Test burger menu opens sidebar on mobile
- [ ] Test overlay closes sidebar on mobile

### 7.3 Responsive Design E2E Tests
- [ ] Test mobile viewport (375px width)
- [ ] Test tablet viewport (768px width)
- [ ] Test desktop viewport (1280px width)
- [ ] Verify sidebar behavior on different screen sizes

---

## Task 8: CI/CD Integration

### 8.1 GitHub Actions Setup
- [ ] Create `.github/workflows/test.yml`
- [ ] Configure workflow to run on push and PR
- [ ] Set up Node.js environment
- [ ] Install dependencies
- [ ] Run Jest tests
- [ ] Run Playwright tests
- [ ] Configure test reporting

### 8.2 Environment Variables for CI
- [ ] Set up test environment variables
- [ ] Configure mock Resend API key for tests
- [ ] Ensure no real emails are sent during CI tests

---

## Task 9: Test Coverage

### 9.1 Coverage Configuration
- [ ] Configure Jest coverage thresholds
- [ ] Set minimum coverage requirements (e.g., 80%)
- [ ] Configure coverage reporting format

### 9.2 Coverage Reports
- [ ] Generate coverage reports for each test run
- [ ] View coverage in terminal
- [ ] Generate HTML coverage reports (optional)

---

## Task 10: Documentation

### 10.1 Testing Documentation
- [ ] Document how to run tests
- [ ] Document test file structure
- [ ] Document testing conventions
- [ ] Document how to write new tests
- [ ] Document mocking strategy

### 10.2 README Updates
- [ ] Add testing section to README
- [ ] Include commands to run tests
- [ ] Include information about test coverage

---

## Testing Strategy

### Component Tests
- Focus on user interactions and component behavior
- Use React Testing Library best practices (test behavior, not implementation)
- Mock external dependencies (APIs, services)

### API Tests
- Test request/response handling
- Test validation logic
- Mock external services (Resend)
- Test error scenarios

### E2E Tests
- Test critical user flows
- Test contact form end-to-end
- Test navigation and user experience
- Use real browser environment

### Test Data
- Use test fixtures for consistent test data
- Create reusable test utilities
- Mock API responses with MSW

---

## Priority Order

1. **High Priority**: Contact form tests (component + API + E2E) - Critical functionality
2. **Medium Priority**: Navigation tests - User experience
3. **Medium Priority**: Sidebar component tests - Core UI feature
4. **Low Priority**: Hero component tests - Visual/animation testing
5. **Low Priority**: Other component tests - Additional coverage

---

## Success Criteria

- [ ] All tests pass
- [ ] Contact form tests cover all scenarios (success, validation, errors)
- [ ] E2E tests verify email submission works
- [ ] Test coverage > 80% for critical paths
- [ ] Tests run in CI/CD pipeline
- [ ] Tests are maintainable and well-documented

