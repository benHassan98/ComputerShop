import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteComponent from "../components/DeleteComponent";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
let component, calledUrl;
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
describe("DeleteComponent", () => {
  beforeEach(() => {
    mockedUseNavigate = jest.fn((url) => {
      calledUrl = url;
    });
    fetch.resetMocks();
    component = {
      _id: 0,
      name: "fake1component",
      category: { _id: 0, name: "fake", description: "fakedesc" },
      manufacturer: "fake",
      price: 10,
      stock: 20,
      features: "fakefake",
      image: { contentType: "image/png", data: { data: [] } },
    };
  });

  test("renders form successfully", async () => {
    fetch.once(JSON.stringify({ component }));
    await act(() => {
      render(
        <BrowserRouter>
          <DeleteComponent />
        </BrowserRouter>
      );
    });
    const form = screen.getByTestId("form");
    const adminpassword = screen.getByTestId("adminpassword");

    expect(form).toBeDefined();
    expect(adminpassword).toBeDefined();
  });
  test("submitting a valid adminpassword", async () => {
    fetch
      .once(JSON.stringify({ component }))
      .once(JSON.stringify({ message: "Component Deleted" }));
    await act(() => {
      render(
        <BrowserRouter>
          <DeleteComponent />
        </BrowserRouter>
      );
    });
    const user = userEvent.setup();
    const adminpassword = screen.getByTestId("adminpassword");
    await user.clear(adminpassword);
    await user.type(adminpassword, "123");
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(calledUrl).toEqual("/");
  });

  test("submitting invalid adminpassword", async () => {
    fetch
      .once(JSON.stringify({ component }))
      .once(JSON.stringify({ message: "doesnot matter" }));
    await act(() => {
      render(
        <BrowserRouter>
          <DeleteComponent />
        </BrowserRouter>
      );
    });
    const user = userEvent.setup();
    const adminpassword = screen.getByTestId("adminpassword");
    await user.clear(adminpassword);
    await user.type(adminpassword, "123");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    let length = adminpassword.className.split(" ").length;
    expect(adminpassword.className.split(" ")[length - 1]).toEqual(
      "is-invalid"
    );
  });
});
