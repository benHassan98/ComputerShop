import { render, screen } from "@testing-library/react";
import Cateogries from "../components/Categories";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

let categories;
describe("Categories", () => {
  beforeEach(() => {
    fetch.resetMocks();
    categories = [
      { _id: 0, name: "fake1", description: "fakedesc1" },
      { _id: 1, name: "fake2", description: "fakedesc2" },
      { _id: 2, name: "fake3", description: "fakedesc3" },
      { _id: 3, name: "fake4", description: "fakedesc4" },
    ];
  });
  test("renders a link and a list of cateogries", async () => {
    fetch.mockResponse(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <Cateogries />
        </BrowserRouter>
      );
    });

    let link = screen.getByRole("link", { name: "+ Create Category" });
    let ul = screen.getAllByText(/fake*/i);
    
    expect(link.href).toEqual('http://localhost/category/create');
    expect(ul.length).toEqual(4);
  });
  test('pressing on links renders category', async()=>{
    fetch.mockResponse(JSON.stringify({ categories }));
    await act(() => {
      render(
        <BrowserRouter>
          <Cateogries />
        </BrowserRouter>
      );
    });
    let links = screen.getAllByRole('link',{name:/fake*/i});
    
    expect(links[0].href).toEqual('http://localhost/category/0');

  });
});
