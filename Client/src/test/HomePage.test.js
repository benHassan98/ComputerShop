import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../components/HomePage";
import { CartProvider, CartContext } from "../components/CartContext";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

let categories, cart, emptyCart, removeFromCart,calledUrl;
const mockedUseNavigate = jest.fn((url)=>{calledUrl = url;});
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate:()=> mockedUseNavigate,
    }));
describe("HomePage", () => {
  beforeEach(() => {
    fetch.resetMocks();
    categories = [
      { _id: 0, name: "fake1", description: "fakedesc1" },
      { _id: 1, name: "fake2", description: "fakedesc2" },
      { _id: 2, name: "fake3", description: "fakedesc3" },
      { _id: 3, name: "fake4", description: "fakedesc4" },
    ];
    cart = {
      fake1: {
        name: "fake1component",
        category: categories[0],
        manufacturer: "fake",
        price: 10,
        stock: 20,
        features: "fakefake",
      },
      fake2: {
        name: "fake2component",
        category: categories[1],
        manufacturer: "fake",
        price: 10,
        stock: 20,
        features: "fakefake",
      },
    };

    emptyCart = jest.fn();
    removeFromCart = jest.fn();
  });

  test("renders a table of categories successfully", async () => {
    fetch.mockResponse(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </BrowserRouter>
      );
    });

    let table = screen.findByRole("table");
    let choose = await screen.findAllByText(/Choose/i);
    expect(table).toBeDefined();
    expect(choose.length).toEqual(4);
  });
  test("pressing on Choose renders the category", async () => {
    fetch.mockResponse(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <HomePage />
          </CartProvider>
        </BrowserRouter>
      );
    });
    const user = userEvent.setup();
    const btn = screen.getAllByText(/Choose/i);
    await user.click(btn[0]);
  expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  expect(calledUrl).toEqual('/category/0');
  });
  test("pressing on Remove deletes the element from cart", async () => {
    fetch.mockResponse(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={{ cart, removeFromCart, emptyCart }}>
            <HomePage />
          </CartContext.Provider>
        </BrowserRouter>
      );
    });

    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: "Remove" })[0]);
    expect(removeFromCart).toHaveBeenCalledTimes(1);
  });
});
