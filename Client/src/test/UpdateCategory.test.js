import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateCategory from "../components/UpdateCategory";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

let category, calledUrl;
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

describe("UpdateCategory", () => {
  beforeEach(() => {
    fetch.resetMocks();
    category = { _id: 0, name: "fake", description: "fakedesc" };
  });

  test("renders form successfully", async () => {
    fetch.once(JSON.stringify({ category }));
    await act(() => {
      render(
        <BrowserRouter>
          <UpdateCategory />
        </BrowserRouter>
      );
    });
    const form = screen.getByTestId("form");
    const name = screen.getByTestId('name');
    const description = screen.getByTestId('describtion');
    const adminpassword = screen.getByTestId('adminpassword');


    expect(form).toBeDefined();
    expect(name).toBeDefined();
    expect(description).toBeDefined();
    expect(adminpassword).toBeDefined();

  });

  test("submitting a valid form fields", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ message: "Category Updated" }));

    await act(() => {
      render(
        <BrowserRouter>
          <UpdateCategory />
        </BrowserRouter>
      );
    });
    const user = userEvent.setup();
    const name = screen.getByTestId("name");
    const description = screen.getByTestId("description");
    const adminpassword = screen.getByTestId("adminpassword");
    const update_btn = screen.getByRole("button", { name: "Update" });

    await user.clear(name);
    await user.clear(description);
    await user.clear(adminpassword);

    await user.type(name, "fake2");
    await user.type(name, category.description);
    await user.type(name,'123');
    await user.click(update_btn);

    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
    expect(calledUrl).toEqual("/category/0");
  });

  test("submitting invalid form fields", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(
        JSON.stringify({
          message: JSON.stringify([
            { param: "name" },
            { param: "adminpassword" },
          ]),
        })
      );

    await act(() => {
      render(
        <BrowserRouter>
          <UpdateCategory />
        </BrowserRouter>
      );
    });
    const user = userEvent.setup();
    const name = screen.getByTestId("name");
    const description = screen.getByTestId("description");
    const adminpassword = screen.getByTestId("adminpassword");
    const update_btn = screen.getByRole("button", { name: "Update" });

    await user.clear(name);
    await user.clear(description);
    await user.clear(adminpassword);

    await user.type(name, category.description);
    await user.type(name, "5656565");
    await user.click(update_btn);

    expect(
      name.className.split(" ")[name.className.split(" ").length - 1]
    ).toEqual("is-invalid");
    expect(
      adminpassword.className.split(" ")[
        adminpassword.className.split(" ").length - 1
      ]
    ).toEqual("is-invalid");
  });
});
