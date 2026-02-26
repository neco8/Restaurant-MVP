import { deleteProduct } from "./deleteProduct";

const mockDelete = vi.fn();

const repository = {
  delete: mockDelete,
};

test("calls repository.delete with id", async () => {
  mockDelete.mockResolvedValue(undefined);
  await deleteProduct(repository, "1");
  expect(mockDelete).toHaveBeenCalledWith("1");
});
