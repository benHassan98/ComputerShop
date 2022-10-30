import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Component from "../components/Component";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { CartProvider, CartContext } from "../components/CartContext";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: 0,
  }),
}));
let component, addToCart;
describe("Component", () => {
  beforeEach(() => {
    fetch.resetMocks();
    
    addToCart =jest.fn();
    component = {
      _id: 0,
      name: "fake1component",
      category: {
        _id: 0,
        name: "fakecat",
        description: "fakedesc",
      },
      manufacturer: "fake",
      price: 10,
      stock: 20,
      features: "fakefake,fakefake",
      image: { contentType: "image/png", data: { data: [] } },
    };
  });

  test("renders successfully", async () => {
    fetch.mockResponse(JSON.stringify({ component }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <Component />
          </CartProvider>
        </BrowserRouter>
      );
    });

    const h3 = screen.getByRole("heading");
    const update_link = screen.getByRole("link", { name: "Update" });
    const delete_link = screen.getByRole("link", { name: "Delete" });
    const add_btn = screen.getByRole("button");
    const category_link = screen.getByRole("link", { name: "fakecat" });
    const price = screen.getByText("$" + component.price);
    const stock = screen.getByText(component.stock);
    const manu = screen.getByText(component.manufacturer);
    const features_ul = screen.getByRole("list");

    expect(h3.textContent).toEqual("fake1component");
    expect(update_link.href).toEqual("http://localhost/component/update/0");
    expect(delete_link.href).toEqual("http://localhost/component/delete/0");
    expect(add_btn).toBeDefined();
    expect(category_link.href).toEqual("http://localhost/category/0");
    expect(manu).toBeDefined();
    expect(price).toBeDefined();
    expect(stock).toBeDefined();
    expect(features_ul.children.length).toEqual(2);
  });
  test("pressing on add adds the component to the cart", async () => {
    fetch.mockResponse(JSON.stringify({ component }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartContext.Provider value={{ addToCart }}>
            <Component />
          </CartContext.Provider>
        </BrowserRouter>
      );
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole("button"));

    expect(addToCart).toHaveBeenCalledTimes(1);
  });
});
