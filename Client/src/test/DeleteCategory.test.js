import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteCategory from "../components/DeleteCategory";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
let category, components, calledUrl;
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
describe("DeleteCategory", () => {
  beforeEach(() => {
    mockedUseNavigate = jest.fn((url) => {
      calledUrl = url;
    });
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
  test("renders list when there are components", async () => {
    fetch
      .once(JSON.stringify({ category }))
      .once(JSON.stringify({ components }));
    await act(() => {
      render(
        <BrowserRouter>
          <DeleteCategory />
        </BrowserRouter>
      );
    });
const user = userEvent.setup();
const links = screen.getAllByRole('link');
const cancel_btn = screen.getByRole('button');
await user.click(cancel_btn);

expect(links.length).toEqual(2);
expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
expect(calledUrl).toEqual('/category/0');

  });
test('renders form when there are no components',async ()=>{
    components = [];
    fetch
    .once(JSON.stringify({ category }))
    .once(JSON.stringify({ components }));
  await act(() => {
    render(
      <BrowserRouter>
        <DeleteCategory />
      </BrowserRouter>
    );
  });
const form = screen.getByTestId('form');
const adminpassword = screen.getByTestId('adminpassword');


expect(form).toBeDefined();
expect(adminpassword).toBeDefined();
});
test('submitting a valid adminpassword',async()=>{
    components = [];
   
    fetch
    .once(JSON.stringify({ category }))
    .once(JSON.stringify({ components }))
    .once(JSON.stringify({ message:'Category Deleted' }));
  await act(() => {
    render(
      <BrowserRouter>
        <DeleteCategory />
      </BrowserRouter>
    );
  });
const user = userEvent.setup();
const adminpassword = screen.getByTestId('adminpassword');
await user.clear(adminpassword);
await user.type(adminpassword,'123');
await user.click(screen.getByRole('button',{name:'Delete'}));

expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
expect(calledUrl).toEqual('/');
});


test('submitting invalid adminpassword',async()=>{
    components = [];
    fetch
    .once(JSON.stringify({ category }))
    .once(JSON.stringify({ components }))
    .once(JSON.stringify({ message:'doesnot matter' }));
  await act(() => {
    render(
      <BrowserRouter>
        <DeleteCategory />
      </BrowserRouter>
    );
  });
const user = userEvent.setup();
const adminpassword = screen.getByTestId('adminpassword');
await user.clear(adminpassword);
await user.type(adminpassword,'123');
await user.click(screen.getByRole('button',{name:'Delete'}));
let length = adminpassword.className.split(' ').length;
expect(adminpassword.className.split(' ')[length-1]).toEqual('is-invalid');
});


});
