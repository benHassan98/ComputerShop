import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCategory from '../components/CreateCategory';
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
let calledUrl,category;
let mockedUseNavigate = jest.fn((url) => {
  calledUrl = url;
});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));
describe('Create Category',()=>{
beforeEach(()=>{
    fetch.resetMocks();
    category = {_id:0,name:'fake',description:'fakedesc'};
});
    test('renders form successfully',async ()=>{


        await act(() => {
            render(
              <BrowserRouter>
                <CreateCategory />
              </BrowserRouter>
            );
          });
    
const form = screen.getByTestId('form');
const name = screen.getByTestId('name');
const description = screen.getByTestId('describtion');

expect(form).toBeDefined();
expect(name).toBeDefined();
expect(description).toBeDefined();
    });
test('submit a valid form fields', async()=>{

    fetch.once(JSON.stringify({ message:'Category Saved',category }));
    await act(() => {
        render(
          <BrowserRouter>
            <CreateCategory />
          </BrowserRouter>
        );
      });
const user = userEvent.setup();
const name = screen.getByTestId('name');
const description = screen.getByTestId('description');
const submit_btn = screen.getByRole('button',{name:'Create'});
await user.clear(name);
await user.clear(description);

await user.type(name,category.name);
await user.type(description,category.description);
await user.click(submit_btn);


expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
expect(calledUrl).toEqual('/category/0');

});
test('submit invalid form fields',async()=>{
    fetch.once(JSON.stringify({ message:JSON.stringify([{param:'name'}]) }));
    await act(() => {
        render(
          <BrowserRouter>
            <CreateCategory />
          </BrowserRouter>
        );
      });
const user = userEvent.setup();
const name = screen.getByTestId('name');
const description = screen.getByTestId('description');
const submit_btn = screen.getByRole('button',{name:'Create'});

await user.clear(name);
await user.clear(description);

await user.type(description,'fakefake');

await user.click(submit_btn);

expect(name.className.split(' ')[name.className.split(' ').length-1]).toEqual('is-invalid');

});





});
