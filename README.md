# ClinicManager

A modern Angular application for managing healthcare providers. This project demonstrates the use of **Angular 19+** features, including **Signals**, **Standalone Components**, and **Reactive Forms** with auto-save functionality.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.17.

## 🚀 Features

**[View Live Demo](https://lior25.github.io/clinic-manager/)**

*   **Provider List**: View a grid of healthcare providers.
*   **Real-time Search**: Filter providers by name, location, or phone number using computed signals.
*   **Inline Editing**: Edit provider details directly with a seamless UI.
*   **Auto-Save**: Changes are automatically saved after a short delay (debounce) while typing.
*   **CRUD Operations**: Create, Read, Update, and Delete providers.
*   **Optimistic UI**: Immediate UI updates for a snappy user experience, even with network latency.

## 🛠️ Tech Stack

*   **Framework**: Angular 19 (Standalone Components)
*   **State Management**: Angular Signals & RxJS
*   **Styling**: SCSS & Angular Material
*   **Forms**: Reactive Forms
*   **API**: JSONPlaceholder (Fake REST API)

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   Angular CLI

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/clinic-manager.git
    cd clinic-manager
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    ng serve
    ```

4.  Open your browser and navigate to `http://localhost:4200/`.

## 💡 Technical Decisions & Architecture

### 1. Standalone Components
The application is built entirely using Standalone Components, removing the need for `NgModule`. This reduces boilerplate and makes lazy loading routes (`loadComponent`) more straightforward.

### 2. State Management with Signals
We use **Angular Signals** for managing synchronous state (e.g., the list of providers, loading status) and **Computed Signals** for derived state (e.g., filtering the list based on a search query). This provides fine-grained reactivity and better performance than default Change Detection.

### 3. Reactive Forms & Auto-Save
The Provider Detail view uses **Reactive Forms**. Instead of a manual "Save" button, we subscribe to the form's `valueChanges` observable.
*   **Debounce**: We wait 500ms after the user stops typing to prevent excessive API calls.
*   **DistinctUntilChanged**: We ensure we only save if the data actually changed.

### 4. Optimistic Updates & Fake API Handling
Since the project uses `jsonplaceholder.typicode.com` (which doesn't actually persist data on the server):
*   **Local State Sync**: When creating or updating a provider, we manually update the local Signal state immediately. This ensures the UI reflects changes even though fetching the list again from the API would return the old data.
*   **ID Generation**: We generate unique IDs locally for new providers to prevent collisions with the static IDs returned by the fake API.

## 📂 Project Structure

src/app/
├── core/
│   ├── models/        # Domain and API models
│   └── services/      # Singleton services (data/state management)
├── features/
│   ├── providers/
│   │   ├── provider-list/    # List view with search & filtering
│   │   └── provider-detail/  # Detail/edit view with reactive form
├── shared/
│   └── components/    # Reusable, presentation-only components
└── app.routes.ts      # Application route definitions


## ⚠️ Known Limitations

*   **Persistence**: Because the backend is a mock API, data changes (new providers, edits) will disappear if you refresh the browser page.
