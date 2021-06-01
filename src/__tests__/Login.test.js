import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import Login from "../components/Login";
import { MemoryRouter } from "react-router";


describe("Login Tests", () => {
  test("welcome text rendered", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /welcome back!/i })).toBeDefined();
  });

  test("is login button present", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const loginButton = screen.getByRole('button', { name: /log in/i })
    expect(loginButton).toBeDefined();
  })

  test("is email input  present", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    expect(emailInput).toBeDefined();
  });

  test("is password input present", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeDefined();
  });

  test("email contains a value after typing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const email = "joe@gmail.com";
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    userEvent.type(emailInput, email);
    expect(emailInput).toHaveValue(email);
  });

  test("password contains a value after typing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const password = "mysecretpassword";
    const passwordInput = screen.getByPlaceholderText(/password/i);
    userEvent.type(passwordInput, password);
    expect(passwordInput).toHaveValue(password);
  })

});
