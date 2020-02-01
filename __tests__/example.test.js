function soma(a, b) {
  return a + b;
}

test('if I call function soma passing 3  and 3 it should return 6', () => {
  const result = soma(3, 3);
  expect(result).toBe(6);
});
