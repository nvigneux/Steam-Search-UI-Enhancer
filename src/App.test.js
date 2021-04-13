import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

const chrome = require("sinon-chrome")

window.chrome = chrome

test("renders learn react link", () => {
  render(<App />)
  const linkElement = screen.getByText(/URL:/i)
  expect(linkElement).toBeInTheDocument()
})
