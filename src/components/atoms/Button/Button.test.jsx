import React from "react"

import { render, screen } from "@testing-library/react"
import Button from "./Button" // component to test

test("render children content", () => {
  render(
    <Button type="button" color="primary">
      This is a button
    </Button>
  )

  expect(screen.getByText(/This is a button/)).toBeInTheDocument()
})
