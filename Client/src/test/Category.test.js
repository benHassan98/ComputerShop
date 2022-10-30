import { render, screen } from "@testing-library/react";
import Category from "../components/Category";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "../components/CartContext";
import { act } from "react-dom/test-utils";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: 0,
  }),
}));
let category, components;
describe("Category", () => {
  beforeEach(() => {
    
    fetch.resetMocks();
    category = { _id: 0, name: "fake", description: "fakedesc" };
    components = [
      {
        _id: 0,
        name: "fake1component",
        category,
        manufacturer: "fake",
        price: 10,
        stock: 20,
        features: "fakefake",
        image: { contentType: "image/png", data: { data: [] } },
      },
      {
        _id: 1,
        name: "fake2component",
        category,
        manufacturer: "fake",
        price: 10,
        stock: 20,
        features: "fakefake",
        image: { contentType: "image/png", data: { data: [] } },
      },
    ];
  });

  test("renders 2 links,paragraph and table", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ components }));
    
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <Category />
          </CartProvider>
        </BrowserRouter>
      );
    });

    const update_link = screen.getAllByRole("link", { name: "Update" });
    const delete_link = screen.getAllByRole("link", { name: "Delete" });
    const p = screen.getByText(/fakedesc/i);
    const table = screen.getByRole("table");
    const trs = screen.getAllByRole("row");
    screen.debug();
    expect(table).toBeDefined();
    expect(trs.length).toEqual(3);
    expect(update_link).toBeDefined();
    expect(delete_link).toBeDefined();
    expect(p.textContent).toEqual("fakedesc");
  });
  test("pressing on update renders UpdateCategory", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ components }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <Category />
          </CartProvider>
        </BrowserRouter>
      );
    });

    const update_link = screen.getByRole("link", { name: "Update" });
    expect(update_link.href).toEqual("http://localhost/category/update/0");
  });
  test("pressing on delete renders DeleteCategory", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ components }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <Category />
          </CartProvider>
        </BrowserRouter>
      );
    });

    const delete_link = screen.getByRole("link", { name: "Delete" });
    expect(delete_link.href).toEqual("http://localhost/category/delete/0");
  });
  test("pressing on component name renders Component", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ components }));
    await act(() => {
      render(
        <BrowserRouter>
          <CartProvider>
            <Category />
          </CartProvider>
        </BrowserRouter>
      );
    });

    const links = screen.getAllByRole("link", { name: /fake*/i });
    expect(links[0].href).toEqual("http://localhost/component/0");
  });
  
});
