# Statement of Work (SOW)

## Auction Feature (Comprehensive & Final)

---

## 1. Purpose

The Auction Feature enables the platform to run **curated, scheduled, live auctions** on a recurring (weekly) basis. Auctions are controlled events managed by admins, combining:

* Product voting
* Manual participant approval
* Live bidding
* Winner confirmation with fallback handling

This document defines the **complete functional scope, rules, states, edge cases, and responsibilities** of the Auction Feature. It serves as the **single source of truth** for product, design, backend, and QA.

No technical or implementation details are included.

---

## 2. Roles & Permissions

### 2.1 Admin

Admins have full control over the auction lifecycle, except where explicitly restricted.

Admins can:

* Create, schedule, pause, extend, cancel auctions
* Select products for auctions
* View all votes (non‑anonymous)
* Manually override voting results
* Approve or remove participants
* Pause and resume live auctions
* Contact winners and fallback bidders

Admins **cannot**:

* Override the highest bidder as winner

---

### 2.2 Registered User

Registered users can:

* View auction content
* Vote during voting phase
* Request participation
* Participate in live bidding (if approved)
* Watch auctions without participating

---

### 2.3 Viewer

A viewer is any user watching a live auction without participation approval.

Viewers can:

* Watch live auctions
* See product, price, countdown, and final result

Viewers **cannot**:

* Bid
* Request participation once auction has started

---

## 3. Auction Structure

### 3.1 Auction Frequency

* Auctions are created weekly
* Only **one auction** can be active at any time

### 3.2 Auction Status

High‑level lifecycle state:

* Draft
* Scheduled
* Active
* Completed
* Cancelled

### 3.3 Auction Progress

Fine‑grained phase tracking:

* Voting Open
* Voting Closed
* Participation Approval
* Live Auction
* Winner Confirmation
* Fallback Resolution

Status and progress together define all system behavior and UI states.

---

## 4. Auction Creation (Admin)

Admins configure the following when creating an auction:

* Auction title and description
* Auction start date and time
* Voting end date and time
* Products included in the auction

### 4.1 Categories

* Categories are **not manually selected**
* Categories are automatically derived from selected products

Upon creation:

* Auction status = Scheduled
* Auction progress = Voting Open (if voting has started)

---

## 5. Dynamic Content & Features

The auction page content is driven by configurable features and variables.

### 5.1 No Active Auction

When no auction is active:

* Users see a promotional auction video
* Video source is configurable via variables

### 5.2 Active or Scheduled Auction

When an auction exists:

* Users see auction categories and products
* Display depends on auction progress

All content must be dynamically configurable without application updates.

---

## 6. Voting Phase

### 6.1 Voting Rules

* Voting is open until the configured voting end time
* Users can vote **once per category**
* Users may vote in multiple categories
* Votes can be changed until voting ends

### 6.2 Voting Visibility

* Votes are anonymous to users
* Votes are fully visible to admins

### 6.3 Voting Resolution

After voting ends:

* One product per category is selected (current scope)
* Admin may manually select a product
* Admin may cancel a category

### 6.4 Voting Edge Cases

* Categories with zero votes require admin action
* Voting may be closed early by admin
* Removing a product deletes its votes

---

## 7. Post‑Voting Lineup

After voting resolution:

* Only selected products remain visible
* These products form the live auction lineup
* Auction progresses to Participation Approval

---

## 8. Participation Requests

### 8.1 Purpose

Participation approval exists **only to confirm a real phone number** and user consent.

### 8.2 User Flow

* User selects a product or category
* A modal requests phone number confirmation
* Phone number is prefilled and editable
* User must accept Privacy Policy and Terms

### 8.3 Participation Rules

* Participation approval is **per product**
* Users may not request participation after auction start
* Duplicate requests are not allowed

### 8.4 Admin Controls

Admins can:

* Approve participants
* Decline participants
* Remove approved participants at any time before auction start

---

## 9. Pre‑Live State

Approved users see:

* Countdown to auction start
* Number of approved participants

Declined users see:

* Decline message
* No bidding access

---

## 10. Live Auction

### 10.1 General Rules

* Only one product is live at a time
* Auction progress = Live Auction
* Auction may be paused or extended by admin

### 10.2 Viewer Experience

All users see:

* Live product
* Current price
* Countdown timer
* Viewer count
* Participant count

### 10.3 Participant Experience

Approved participants additionally see:

* Bid list (no full history after auction)
* Configurable price increment buttons
* Ability to place bids

### 10.4 Bidding Rules

* Minimum bid price is enforced per product
* Last‑second bids are accepted
* Users who disconnect may rejoin

### 10.5 Pause Behavior

* When paused, countdown freezes
* Resuming continues countdown

---

## 11. Auction Completion & Winner Selection

### 11.1 Winner Determination

* Highest bidder becomes provisional winner
* Admins cannot override the winner

### 11.2 Winner Confirmation

* Winner must confirm and pay 15% prepayment
* Confirmation timeout is configurable

---

## 12. Fallback Logic

If the highest bidder:

* Rejects
* Fails payment
* Is unreachable

Then:

* Next highest bidder is contacted
* This continues until a winner is confirmed

If all fallback bidders reject:

* Auction is cancelled

Top fallback bidders see ranked status messages.

---

## 13. Post‑Auction State

After completion:

* Auction is marked Completed or Cancelled
* Winning price is visible to all users
* Winner identity is visible in masked form
* Past bid history is not visible

The most recent auction result remains visible until the next auction is scheduled.

---

## 14. Notifications

Push notifications are mandatory for:

* Auction start
* Approval / decline
* Auction pause / resume
* Winner and fallback status

SMS and email notifications are out of scope for MVP.

---

## 15. Explicit Out‑of‑Scope Items

* Payment gateway implementation
* Fraud detection logic
* Auction replay functionality
* Automated bidding bots

---

## 16. Acceptance Criteria

The Auction Feature is considered complete when:

* All auction states and transitions are enforced
* Admin control and restrictions are respected
* Users cannot bypass voting, participation, or bidding rules
* Auction outcomes are deterministic and auditable

---

**End of Statement of Work**
