import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateComponent from '../components/UpdateComponent';
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

let categories,component, calledUrl;
let mockedUseNavigate = jest.fn((url) => {
    calledUrl = url;
  });
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
  useParams: () => ({
    id: 0,
  }),
}));
describe('UpdateComponent',()=>{
beforeEach(()=>{
     mockedUseNavigate = jest.fn((url) => {
        calledUrl = url;
      });
    fetch.resetMocks();
    component = {
        _id: 0,
        name: "fake1component",
        category: { _id: 0, name: "fake1", description: "fakedesc1" },
        manufacturer: "fake",
        price: "10",
        stock: "20",
        features: "fake:blah,blah:fake",
        image: { contentType: "image/png", data: { data: [] } },
      };
      categories = [
        { _id: 0, name: "fake1", description: "fakedesc1" },
        { _id: 1, name: "fake2", description: "fakedesc2" },
        { _id: 2, name: "fake3", description: "fakedesc3" },
        { _id: 3, name: "fake4", description: "fakedesc4" },
      ];

});

test("renders form successfully", async () => {
    fetch
    .once(JSON.stringify({ component }))
    .once(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <UpdateComponent />
        </BrowserRouter>
      );
    });

    const form = screen.getByTestId("form");
    const name = screen.getByTestId("name");
    const category = screen.getByTestId("category");
    const manufacturer = screen.getByTestId("manufacturer");
    const price = screen.getByTestId("price");
    const stock = screen.getByTestId("stock");
    const features = screen.getByTestId("features");
    const image = screen.getByTestId("image");

    expect(form).toBeDefined();
    expect(name).toBeDefined();
    expect(category).toBeDefined();
    expect(manufacturer).toBeDefined();
    expect(price).toBeDefined();
    expect(stock).toBeDefined();
    expect(features).toBeDefined();
    expect(image).toBeDefined();
  });

  test("submit a valid form fields", async () => {
    fetch
    .once(JSON.stringify({ component }))
    .once(JSON.stringify({ categories }))
    .once(JSON.stringify({ message: "Component Updated", component }));

    await act(() => {
      render(
        <BrowserRouter>
          <UpdateComponent />
        </BrowserRouter>
      );
    });

    const name = screen.getByTestId("name");
    const category = screen.getByTestId("category");
    const manufacturer = screen.getByTestId("manufacturer");
    const price = screen.getByTestId("price");
    const stock = screen.getByTestId("stock");
    const features = screen.getByTestId("features");

    const user = userEvent.setup();
    const update_btn = screen.getByRole("button", { name: "Update" });

    await user.clear(name);
    await user.clear(manufacturer);
    await user.clear(price);
    await user.clear(stock);
    await user.clear(features);

    await user.type(name, 'fakefake');
    await user.selectOptions(category, categories[1].name);
    await user.type(manufacturer, component.manufacturer);
    await user.type(price, '20');
    await user.type(stock, '1');
    await user.type(features, component.features);
    await user.click(update_btn);

    expect(
      screen.getByRole("option", { name: categories[1].name }).selected
    ).toEqual(true);
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(calledUrl).toEqual("/component/0");
  });

  test("submitting invalid form fields", async () => {
    fetch
    .once(JSON.stringify({ component }))
    .once(JSON.stringify({ categories }))
    .once(
        JSON.stringify({
          message: JSON.stringify([{ param: "name" }, { param: "stock" }]),
        })
      );
    await act(() => {
      render(
        <BrowserRouter>
          <UpdateComponent />
        </BrowserRouter>
      );
    });

    const name = screen.getByTestId("name");
    const category = screen.getByTestId("category");
    const manufacturer = screen.getByTestId("manufacturer");
    const price = screen.getByTestId("price");
    const stock = screen.getByTestId("stock");
    const features = screen.getByTestId("features");

    const user = userEvent.setup();
    const update_btn = screen.getByRole("button", { name: "Update" });

    await user.clear(name);
    await user.clear(manufacturer);
    await user.clear(price);
    await user.clear(stock);
    await user.clear(features);

    await user.selectOptions(category, categories[2].name);
    await user.type(manufacturer, component.manufacturer);
    await user.type(price, component.price);
    await user.type(features, component.features);
    await user.click(update_btn);

    expect(name.classList[name.classList.length - 1]).toEqual("is-invalid");
    expect(stock.classList[stock.classList.length - 1]).toEqual("is-invalid");
  });



});
