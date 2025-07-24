/// <reference types="@testing-library/jest-dom" />

import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPage from "./Login";

describe("Login Page", () => {
  it("renders the login page", () => {
    render(<LoginPage />);
    const loginElement = screen.getByText("Sign in");
    expect(loginElement).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Remember me" })
    ).toBeInTheDocument();
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
  });
});
