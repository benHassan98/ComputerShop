import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Components from "../components/Components";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { CartProvider, CartContext } from "../components/CartContext";

let components,addToCart,calledUrl;
const mockedUseNavigate = jest.fn((url)=>{calledUrl = url;});
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate:()=> mockedUseNavigate,
    }));

describe("Components", () => {
  beforeEach(() => {
    fetch.resetMocks();
    components = [
      {
        _id: 0,
        name: "fake1component",
        category: {
          _id: 0,
          name: "fake1cat",
          description: "fake1desc",
        },
        manufacturer: "fake",
        price: 10,
        stock: 20,
        features: "fakefake,fakefake",
        image: { contentType: "image/png", data: { data: [] } },
      },
      {
        _id: 1,
        name: "fake2component",
        category: {
          _id: 1,
          name: "fake2cat",
          description: "fake2desc",
        },
        manufacturer: "fakefake",
        price: 20,
        stock: 10,
        features: "fakefake,fakefake,fake",
        image: { contentType: "image/png", data: { data: [] } },
      },
    ];
    addToCart = jest.fn();
  });

  test("renders a link and a list of cateogries", async () => {
    fetch.mockResponse(JSON.stringify({ components }));
    await act(() => {
        render(
          <BrowserRouter>
            <CartProvider>
              <Components />
            </CartProvider>
          </BrowserRouter>
        );
      });
  
      const link = screen.getByRole('link',{name:'+ Create Component'});
      const table = screen.getByRole('table');
      const trs = screen.getAllByRole('row');
      
      expect(link.href).toEqual('http://localhost/component/create');
      expect(table).toBeDefined();
      expect(trs.length).toEqual(3);
    });

    test("pressing on add adds the component to the cart", async () => {
        fetch.mockResponse(JSON.stringify({ components }));
        await act(() => {
          render(
            <BrowserRouter>
              <CartContext.Provider value={{ addToCart }}>
                <Components />
              </CartContext.Provider>
            </BrowserRouter>
          );
        });
    
        const user = userEvent.setup();
        await user.click(screen.getAllByRole("button")[0]);
    
        expect(addToCart).toHaveBeenCalledTimes(1);
        expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
        expect(calledUrl).toEqual('/');
      });
});
